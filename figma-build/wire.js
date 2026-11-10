// Prototype wiring + frame arrangement (Desktop + Mobile) — UNTESTED, written for resume after rate-limit reset
// Flow order (left to right): Coming Soon → Landing → Signup → Account → Member → Vehicle →
// Gallery → Events → Forum → Category → Thread → Shop → Login → Contact → Admin → Search → About
// Rules: forward links go to the next step in their flow; back links go exactly one step back;
// header logo always returns to Landing. Dead ends by design: Shop (coming soon), form submits,
// and the lock gate (UNLOCK goes to Landing, which is the gate opening).
const out = { linked: [], warnings: [], errors: [] };
const ORDER = ['Coming Soon', 'Landing', 'Signup', 'Account', 'Member', 'Vehicle', 'Gallery', 'Events', 'Forum', 'Forum Category', 'Forum Thread', 'Shop', 'Login', 'Contact', 'Admin', 'Search', 'About'];
const NUM = { 'Coming Soon': '29', 'Landing': '01', 'Signup': '11', 'Account': '15', 'Member': '17', 'Vehicle': '19', 'Gallery': '07', 'Events': '05', 'Forum': '21', 'Forum Category': '23', 'Forum Thread': '25', 'Shop': '09', 'Login': '13', 'Contact': '27', 'Admin': '31', 'Search': '33', 'About': '03' };

function frameBy(key, vp) {
  const suffix = vp === 'D' ? 'Desktop' : 'Mobile';
  const want = NUM[key] + ' — ' + key + ' / ' + suffix;
  const found = figma.currentPage.children.find(n => n.name === want);
  return found || null;
}
function findIn(frame, name) {
  if (!frame) { return []; }
  return frame.findAll(n => n.name === name);
}
function nav(node, dest, label) {
  try {
    node.reactions = [{ action: { type: 'NODE', destinationId: dest.id, navigation: 'NAVIGATE', transition: { type: 'DISSOLVE', duration: 0.2 } }, trigger: { type: 'ON_CLICK' } }];
    out.linked.push(label);
  } catch (e) { out.errors.push(label + ': ' + (e && e.message ? e.message : e)); }
}
function link(frameKey, vp, nodeName, destKey, label) {
  const frame = frameBy(frameKey, vp);
  const dest = frameBy(destKey, vp);
  if (!frame) { out.warnings.push('frame missing: ' + frameKey + ' / ' + vp); return; }
  if (!dest) { out.warnings.push('dest missing: ' + destKey + ' / ' + vp); return; }
  const nodes = findIn(frame, nodeName);
  if (!nodes.length) { out.warnings.push('node missing: ' + nodeName + ' on ' + frameKey + ' / ' + vp); return; }
  for (const n of nodes) { nav(n, dest, (label || nodeName) + ' (' + frameKey + ' ' + vp + ' → ' + destKey + ')'); }
}
function linkAll(frameKey, vp, nodeNames, destKey) {
  for (const nn of nodeNames) { link(frameKey, vp, nn, destKey); }
}

// --- 1. Arrange frames in flow order ---
for (let i = 0; i < ORDER.length; i++) {
  const d = frameBy(ORDER[i], 'D');
  const m = frameBy(ORDER[i], 'M');
  if (d) { d.x = i * 1640; d.y = 0; }
  if (m) { m.x = i * 590; m.y = 3400; }
}

// --- 2. Hamburger menu overlays (one per viewport) ---
function buildOverlay(vp) {
  const W = vp === 'D' ? 320 : 390;
  const ov = figma.createFrame();
  ov.name = 'Menu Overlay / ' + (vp === 'D' ? 'Desktop' : 'Mobile');
  ov.resize(W, 460);
  ov.fills = [{ type: 'SOLID', color: { r: 0.078, g: 0.063, b: 0.047 } }];
  ov.layoutMode = 'VERTICAL';
  ov.paddingTop = 16; ov.paddingBottom = 16; ov.paddingLeft = 24; ov.paddingRight = 24;
  ov.itemSpacing = 14;
  ov.x = 0; ov.y = 7000;
  figma.currentPage.appendChild(ov);
  return ov;
}
const MENU = [['Home', 'Landing'], ['About', 'About'], ['Events', 'Events'], ['Members Corner', 'Gallery'], ['Forum', 'Forum'], ['Shop', 'Shop'], ['Contact', 'Contact'], ['Join Powerpacked', 'Signup'], ['Log in', 'Login']];
async function overlayLinks(ov, vp) {
  await figma.loadFontAsync({ family: 'Barlow', style: 'SemiBold' });
  for (const [label, destKey] of MENU) {
    const t = figma.createText();
    t.name = 'Menu link / ' + label;
    t.fontName = { family: 'Barlow', style: 'SemiBold' };
    t.characters = label;
    t.fontSize = 18;
    t.fills = [{ type: 'SOLID', color: { r: 0.957, g: 0.937, b: 0.886 } }];
    ov.appendChild(t);
    const dest = frameBy(destKey, vp);
    if (dest) { nav(t, dest, 'Menu / ' + label + ' (' + vp + ' → ' + destKey + ')'); }
  }
}
const ovD = buildOverlay('D');
const ovM = buildOverlay('M');
await overlayLinks(ovD, 'D');
await overlayLinks(ovM, 'M');
function openOverlay(frameKey, vp, ov) {
  const frame = frameBy(frameKey, vp);
  if (!frame) { return; }
  const nodes = findIn(frame, 'Nav / Menu');
  for (const n of nodes) {
    try {
      n.reactions = [{ action: { type: 'OVERLAY', destinationId: ov.id, overlaySettings: { positionType: 'TOP_LEFT', offset: { x: 16, y: 64 } } }, trigger: { type: 'ON_CLICK' } }];
      out.linked.push('Menu open (' + frameKey + ' ' + vp + ')');
    } catch (e) { out.errors.push('Menu open (' + frameKey + ' ' + vp + '): ' + (e && e.message ? e.message : e)); }
  }
}

// --- 3. Header + footer on every screen (except lock page, which has neither) ---
const LOGGED_IN = ['Account', 'Member', 'Vehicle', 'Admin'];
for (const key of ORDER) {
  if (key === 'Coming Soon') { continue; }
  for (const vp of ['D', 'M']) {
    link(key, vp, 'Nav / Logo', 'Landing');
    link(key, vp, 'Nav / Search', 'Search');
    link(key, vp, 'Nav / Account', LOGGED_IN.includes(key) ? 'Account' : 'Login');
    openOverlay(key, vp, vp === 'D' ? ovD : ovM);
    // footer links are wired individually in the next loop (each to its own page)
  }
}
// Footer links need individual destinations; redo them properly:
for (const key of ORDER) {
  if (key === 'Coming Soon') { continue; }
  for (const vp of ['D', 'M']) {
    link(key, vp, 'Footer / Home', 'Landing');
    link(key, vp, 'Footer / About', 'About');
    link(key, vp, 'Footer / Events', 'Events');
    link(key, vp, 'Footer / Members Corner', 'Gallery');
    link(key, vp, 'Footer / Forum', 'Forum');
    link(key, vp, 'Footer / Shop', 'Shop');
    link(key, vp, 'Footer / Contact', 'Contact');
    link(key, vp, 'Footer / Join', 'Signup');
  }
}

// --- 4. Flow-specific links ---
for (const vp of ['D', 'M']) {
  link('Coming Soon', vp, 'Button / Unlock', 'Landing');
  // Landing
  linkAll('Landing', vp, ['Button / Join Now', 'Button / Join Now!'], 'Signup');
  link('Landing', vp, 'Button / See the Rides', 'Gallery');
  link('Landing', vp, 'Button / Our Story', 'About');
  link('Landing', vp, 'Button / All Events', 'Events');
  link('Landing', vp, 'Button / Full Gallery', 'Gallery');
  link('Landing', vp, 'Carousel', 'Member');
  for (const t of ['Burger King Cruise Night', 'Best of Both Worlds Auto & Cycle Show', 'Pin Ups & Pistons', 'Old School Cruise Night']) {
    link('Landing', vp, 'Event card / ' + t, 'Events');
  }
  // Join flow
  link('Signup', vp, 'Button / Join Now!', 'Account');
  link('Signup', vp, 'Link / Log in', 'Login');
  link('Login', vp, 'Button / Log in', 'Account');
  link('Login', vp, 'Link / Join Powerpacked', 'Signup');
  link('Account', vp, 'Link / View my public profile', 'Member');
  link('Account', vp, 'Link / Admin panel', 'Admin');
  link('Account', vp, 'Vehicle card / Big Red', 'Vehicle');
  link('Account', vp, 'Vehicle card / Night Owl', 'Vehicle');
  link('Member', vp, 'Vehicle card / Big Red', 'Vehicle');
  link('Member', vp, 'Vehicle card / Night Owl', 'Vehicle');
  // Browse flow
  for (const u of ['Marcus T.', 'Dana R.', 'Cole B.', 'Riley K.', 'Jess M.', 'Tony L.']) {
    link('Gallery', vp, 'Wall item / ' + u, 'Vehicle');
  }
  link('Vehicle', vp, 'Link / Back to Members Corner', 'Gallery');
  link('Vehicle', vp, 'Link / Marcus T.', 'Member');
  link('Vehicle', vp, 'Link / Log in', 'Login');
  // Forum flow
  for (const c of ['General Discussion', 'Builds & Projects', 'Events & Meets', 'Tech Talk']) {
    link('Forum', vp, 'Forum cat / ' + c, 'Forum Category');
  }
  for (const t of ['C10 frame-off resto \u2014 paint code help?', '350 swap \u2014 what mounts?', 'Show your engine bay']) {
    link('Forum Category', vp, 'Thread row / ' + t, 'Forum Thread');
  }
  link('Forum Category', vp, 'Link / Back to Forum', 'Forum');
  link('Forum Thread', vp, 'Link / Back to Builds & Projects', 'Forum Category');
  link('Forum Thread', vp, 'Link / Log in', 'Login');
  // Shop + Contact + Search
  link('Shop', vp, 'Button / Join Now', 'Signup');
  link('Search', vp, 'Search member / Marcus T.', 'Member');
  link('Search', vp, 'Link / View profile', 'Member');
  link('Search', vp, 'Vehicle card / Big Red', 'Vehicle');
}

// --- 5. Prototype starting frame = Coming Soon (desktop) ---
try {
  const start = frameBy('Coming Soon', 'D');
  if (start) { figma.currentPage.prototypeStartNode = start; out.linked.push('Starting frame = Coming Soon / Desktop'); }
} catch (e) { out.warnings.push('prototypeStartNode not settable: ' + (e && e.message ? e.message : e) + ' — set manually: right-click Coming Soon / Desktop → Set as starting point'); }

return out;
