// Powerpacked Figma build — shared helpers (prepended to each screen script)
const TOK = { cream:'#F4EFE2', paper:'#FAF7EC', ink:'#1B1611', inkSoft:'#3A332B', red:'#C1272D', redDark:'#9C1E23', gold:'#D9A441', muted:'#7C7264', line:'#E2D9C3', dark:'#14100C', dark2:'#221C15', white:'#FFFFFF', creamDim:'#FFE9E4', greyBg:'#A89E8B', footMut:'#6F6656', lockCard:'#1E1A16', lockLine:'#3A332B', greenBg:'#E6F4E3', greenLine:'#9CCB92', greenTx:'#2C5B25' };
const C = (hex) => { const n = parseInt(hex.slice(1), 16); return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }; };
const solid = (hex, op) => [{ type: 'SOLID', color: C(hex), opacity: op == null ? 1 : op }];

await figma.loadFontAsync({ family: 'Bebas Neue', style: 'Regular' });
await figma.loadFontAsync({ family: 'Barlow', style: 'Regular' });
await figma.loadFontAsync({ family: 'Barlow', style: 'Bold' });
await figma.loadFontAsync({ family: 'Barlow', style: 'SemiBold' });
await figma.loadFontAsync({ family: 'Barlow', style: 'Medium' });
await figma.loadFontAsync({ family: 'Barlow', style: 'Italic' });

function F(parent, o) {
  const f = figma.createFrame();
  f.name = o.name || 'Frame';
  if (o.fill) f.fills = solid(o.fill, o.fillOp);
  else f.fills = [];
  if (o.w != null) f.resize(o.w, o.h != null ? o.h : 10);
  else if (o.h != null) f.resize(10, o.h);
  if (o.layout) {
    f.layoutMode = o.layout;
    f.primaryAxisSizingMode = o.primary || 'AUTO';
    f.counterAxisSizingMode = o.counter || (o.layout === 'HORIZONTAL' ? 'AUTO' : 'FIXED');
  }
  if (o.gap != null) f.itemSpacing = o.gap;
  if (o.pad != null) { f.paddingTop = f.paddingBottom = f.paddingLeft = f.paddingRight = o.pad; }
  if (o.padX != null) { f.paddingLeft = f.paddingRight = o.padX; }
  if (o.padY != null) { f.paddingTop = f.paddingBottom = o.padY; }
  if (o.radius != null) f.cornerRadius = o.radius;
  if (o.stroke) { f.strokes = solid(o.stroke); f.strokeWeight = o.strokeW || 1; }
  if (o.align) f.primaryAxisAlignItems = o.align;
  if (o.cross) f.counterAxisAlignItems = o.cross;
  if (o.clips != null) f.clipsContent = o.clips;
  if (o.shadow) f.effects = [{ type: 'DROP_SHADOW', color: { r: 0.106, g: 0.086, b: 0.067, a: 0.14 }, offset: { x: 0, y: 10 }, radius: 30, spread: 0, visible: true, blendMode: 'NORMAL' }];
  if (parent) parent.appendChild(f);
  if (o.x != null) f.x = o.x;
  if (o.y != null) f.y = o.y;
  if (o.sizingH) f.layoutSizingHorizontal = o.sizingH;
  if (o.sizingV) f.layoutSizingVertical = o.sizingV;
  if (o.layoutAlign) f.layoutAlign = o.layoutAlign;
  if (o.wrap) f.layoutWrap = 'WRAP';
  return f;
}
function R(parent, o) {
  const r = figma.createRectangle();
  r.name = o.name || 'Rect';
  r.fills = o.fill ? solid(o.fill, o.fillOp) : [];
  if (o.stroke) { r.strokes = solid(o.stroke); r.strokeWeight = o.strokeW || 1; }
  r.resize(o.w || 10, o.h || 10);
  if (o.radius != null) r.cornerRadius = o.radius;
  if (o.rot != null) r.rotation = o.rot;
  if (parent) parent.appendChild(r);
  if (o.abs) r.layoutPositioning = 'ABSOLUTE';
  if (o.x != null) r.x = o.x;
  if (o.y != null) r.y = o.y;
  if (o.sizingH) r.layoutSizingHorizontal = o.sizingH;
  return r;
}
async function T(parent, str, o) {
  const t = figma.createText();
  t.name = o.name || String(str).slice(0, 24);
  const fam = o.font || 'Barlow';
  const sty = o.style || 'Regular';
  await figma.loadFontAsync({ family: fam, style: sty });
  t.fontName = { family: fam, style: sty };
  t.characters = str;
  t.fontSize = o.size || 16;
  t.fills = solid(o.color || TOK.ink, o.fillOp);
  if (o.spacing != null) t.letterSpacing = { unit: 'PERCENT', value: o.spacing };
  if (o.lh != null) t.lineHeight = { unit: 'PERCENT', value: o.lh };
  if (o.align) t.textAlignHorizontal = o.align;
  if (o.width != null) { t.resize(o.width, 10); t.textAutoResize = 'HEIGHT'; }
  parent.appendChild(t);
  if (o.abs) { t.layoutPositioning = 'ABSOLUTE'; if (o.x != null) t.x = o.x; if (o.y != null) t.y = o.y; }
  if (o.sizingH) t.layoutSizingHorizontal = o.sizingH;
  return t;
}
function heart(parent, size, color) {
  const g = F(parent, { name: 'Heart', w: size, h: size * 0.95, clips: false });
  const c1 = figma.createEllipse(); c1.name = 'hl'; c1.resize(size * 0.5, size * 0.5); c1.x = 0; c1.y = 0; c1.fills = solid(color); g.appendChild(c1);
  const c2 = figma.createEllipse(); c2.name = 'hr'; c2.resize(size * 0.5, size * 0.5); c2.x = size * 0.5; c2.y = 0; c2.fills = solid(color); g.appendChild(c2);
  const sq = figma.createRectangle(); sq.name = 'hb'; sq.resize(size * 0.66, size * 0.66); sq.x = size * 0.17; sq.y = size * 0.22; sq.rotation = 45; sq.fills = solid(color); g.appendChild(sq);
  return g;
}
async function btn(parent, label, kind, o) {
  o = o || {};
  const b = F(parent, { name: 'Button / ' + label, layout: 'HORIZONTAL', gap: 8, cross: 'CENTER', radius: kind === 'huge' ? 10 : 6, padY: kind === 'huge' ? 16 : kind === 'big' ? 14 : 9, padX: kind === 'huge' ? 51 : kind === 'big' ? 35 : 19 });
  if (kind === 'red' || kind === 'big') b.fills = solid(TOK.red);
  else if (kind === 'cream' || kind === 'huge') b.fills = solid(TOK.cream);
  else if (kind === 'ghost') { b.fills = []; b.strokes = solid(TOK.cream, 0.7); b.strokeWeight = 2; }
  else if (kind === 'outline') { b.fills = []; b.strokes = solid(TOK.ink); b.strokeWeight = 2; }
  const size = kind === 'huge' ? 48 : kind === 'big' ? 24 : kind === 'red' ? 20 : 17;
  const col = (kind === 'red' || kind === 'big') ? TOK.white : (kind === 'cream' || kind === 'huge') ? TOK.ink : kind === 'ghost' ? TOK.cream : TOK.ink;
  await T(b, label.toUpperCase(), { font: 'Bebas Neue', size, color: col, spacing: 12, lh: 100 });
  return b;
}
function kicker(parent, str) { return T(parent, str.toUpperCase(), { font: 'Barlow', style: 'Bold', size: 13, color: TOK.red, spacing: 28, lh: 130 }); }
function sectionTitle(parent, str, V, o) { return T(parent, str.toUpperCase(), { font: 'Bebas Neue', size: V.section, color: TOK.ink, spacing: 4, lh: 102, width: o && o.width }); }
function imgRect(parent, key, w, h, o) {
  o = o || {};
  const r = R(parent, { name: 'IMG / ' + key, w, h, fill: TOK.dark2, radius: o.radius, x: o.x, y: o.y, sizingH: o.sizingH });
  if (o.abs) r.layoutPositioning = 'ABSOLUTE';
  return r;
}
function topbar(page, V) {
  const topbar = F(page, { name: 'Topbar', layout: 'VERTICAL', gap: 0, sizingH: 'FILL', fill: TOK.dark, cross: 'CENTER' });
  const innerW = V.mob ? V.W : 1280;
  const topRow = F(topbar, { name: 'Topbar inner', layout: 'HORIZONTAL', gap: 0, cross: 'CENTER', w: innerW, primary: 'FIXED', counter: 'AUTO', layoutAlign: 'CENTER', padX: 16, padY: 9 });
  const leftBox = F(topRow, { name: 'Left', layout: 'HORIZONTAL', gap: 0, cross: 'CENTER', sizingH: 'FILL' });
  const ham = F(leftBox, { name: 'Nav / Menu', layout: 'VERTICAL', gap: 6, cross: 'CENTER', align: 'CENTER', w: 44, h: 44 });
  R(ham, { name: 'bar', w: 26, h: 2.5, fill: TOK.cream, radius: 1.25 });
  R(ham, { name: 'bar', w: 26, h: 2.5, fill: TOK.cream, radius: 1.25 });
  R(ham, { name: 'bar', w: 26, h: 2.5, fill: TOK.cream, radius: 1.25 });
  const logoRect = imgRect(topRow, 'logo', V.mob ? 220 : 299, V.mob ? 25 : 34);
  logoRect.name = 'Nav / Logo';
  const rightBox = F(topRow, { name: 'Right', layout: 'HORIZONTAL', gap: 4, cross: 'CENTER', align: 'MAX', sizingH: 'FILL' });
  const searchIc = F(rightBox, { name: 'Nav / Search', w: 44, h: 44 });
  const sCircle = figma.createEllipse(); sCircle.name = 'lens'; sCircle.resize(14, 14); sCircle.x = 12; sCircle.y = 12; sCircle.fills = []; sCircle.strokes = solid(TOK.cream); sCircle.strokeWeight = 2.2; searchIc.appendChild(sCircle);
  R(searchIc, { name: 'handle', w: 2.2, h: 8, fill: TOK.cream, x: 24.5, y: 24, rot: 45 });
  const acctIc = F(rightBox, { name: 'Nav / Account', w: 44, h: 44 });
  const aHead = figma.createEllipse(); aHead.name = 'head'; aHead.resize(9, 9); aHead.x = 17.5; aHead.y = 12; aHead.fills = []; aHead.strokes = solid(TOK.cream); aHead.strokeWeight = 2.2; acctIc.appendChild(aHead);
  const aBody = figma.createRectangle(); aBody.name = 'shoulders'; aBody.resize(19, 11); aBody.x = 12.5; aBody.y = 24; aBody.fills = []; aBody.strokes = solid(TOK.cream); aBody.strokeWeight = 2.2; aBody.topLeftRadius = 9; aBody.topRightRadius = 9; aBody.bottomLeftRadius = 0; aBody.bottomRightRadius = 0; acctIc.appendChild(aBody);
  R(topbar, { name: 'Red rule', w: V.W, h: 3, fill: TOK.red, sizingH: 'FILL' });
  return { topbar, logo: logoRect, ham, search: searchIc, acct: acctIc };
}
async function pageHead(page, V, kick, title, sub) {
  const head = F(page, { name: 'Page head', layout: 'VERTICAL', gap: 0, sizingH: 'FILL', padY: V.mob ? 36 : 48, cross: 'CENTER', fill: TOK.dark });
  const wrap = F(head, { name: 'Wrap', layout: 'VERTICAL', gap: 6, w: V.wrap, layoutAlign: 'CENTER' });
  if (kick) { await kicker(wrap, kick); }
  await T(wrap, title.toUpperCase(), { font: 'Bebas Neue', size: V.title, color: TOK.cream, spacing: 4, lh: 102, width: V.wrap });
  if (sub) { await T(wrap, sub, { size: 16, color: TOK.greyBg, lh: 160, width: V.wrap }); }
  R(head, { name: 'Red rule', w: V.W, h: 3, fill: TOK.red, sizingH: 'FILL' });
  return head;
}
async function footer(page, V) {
  const footer = F(page, { name: 'Footer', layout: 'VERTICAL', gap: 0, sizingH: 'FILL', padY: V.mob ? 40 : 48, cross: 'CENTER', fill: TOK.dark });
  const fBrand = F(footer, { name: 'Footer brand', layout: 'HORIZONTAL', gap: 16, cross: 'CENTER' });
  await T(fBrand, 'POWERPACKED', { font: 'Bebas Neue', size: V.mob ? 28 : 32, color: TOK.cream, spacing: 20 });
  await T(fBrand, 'DRIVEN BY DIFFERENCE', { font: 'Bebas Neue', size: V.mob ? 13 : 16, color: TOK.gold, spacing: 20 });
  await T(footer, 'One community for every kind of car culture. Power. Mobility. Freedom.', { size: V.mob ? 15 : 16, color: TOK.greyBg, align: 'CENTER', width: V.mob ? 330 : 560, lh: 160 });
  const fNav = F(footer, { name: 'Footer nav', layout: 'HORIZONTAL', gap: V.mob ? 18 : 24, cross: 'CENTER', w: V.mob ? 350 : 900, primary: 'FIXED', counter: 'AUTO', align: 'CENTER', wrap: V.mob });
  for (const l of ['Home', 'About', 'Events', 'Members Corner', 'Forum', 'Shop', 'Contact', 'Join']) {
    await T(fNav, l, { name: 'Footer / ' + l, font: 'Barlow', style: 'SemiBold', size: 15, color: TOK.cream });
  }
  await T(footer, '© 2026 Powerpacked Car Club. All rights reserved.', { size: V.mob ? 13 : 14, color: TOK.footMut, align: 'CENTER', width: V.mob ? 330 : 560, lh: 150 });
  footer.itemSpacing = V.mob ? 16 : 18;
  return footer;
}
async function field(parent, label, placeholder, V, o) {
  o = o || {};
  const wrap = F(parent, { name: 'Field / ' + label, layout: 'VERTICAL', gap: 6, sizingH: 'FILL' });
  await T(wrap, label, { font: 'Barlow', style: 'SemiBold', size: 15, color: TOK.ink });
  const input = F(wrap, { name: 'Input', layout: 'HORIZONTAL', gap: 0, cross: 'CENTER', sizingH: 'FILL', fill: TOK.white, stroke: TOK.line, strokeW: 2, radius: 8, padX: 14, padY: 12 });
  await T(input, placeholder, { size: 16, color: TOK.muted });
  if (o.rows) input.resize(input.width, 120);
  return wrap;
}
function section(page, V, fill, width) {
  const s = F(page, { name: 'Section', layout: 'VERTICAL', gap: 0, sizingH: 'FILL', padY: V.mob ? 45 : 64, cross: 'CENTER', fill: fill || TOK.cream });
  const wrap = F(s, { name: 'Wrap ' + (width || V.wrap), layout: 'VERTICAL', gap: 0, w: width || V.wrap, layoutAlign: 'CENTER' });
  return { s, wrap };
}
function newPageFrame(name, V, y) {
  // remove any existing frame with this name (idempotent rerun)
  for (const c of [...figma.currentPage.children]) { if (c.name === name) c.remove(); }
  const page = F(figma.currentPage, { name, layout: 'VERTICAL', gap: 0, w: V.W, counter: 'FIXED', primary: 'AUTO', x: V.mob ? 1560 : 0, y });
  page.fills = solid(TOK.cream);
  return page;
}
function stackY() {
  let m = 0;
  for (const c of figma.currentPage.children) { if (c.type === 'FRAME') m = Math.max(m, c.y + c.height); }
  return m + 120;
}
const D = { W: 1440, wrap: 1140, title: 58, section: 43, mob: false };
const M = { W: 390, wrap: 350, title: 40, section: 30, mob: true };
const SAMPLE = {
  members: [
    { user: 'Marcus T.', num: 'PWR-001', ride: 'Big Red', spec: '1972 Chevrolet C10', img: 'ph1', likes: 24, bio: 'East Texas born, Chevy raised. If it ain\u2019t got a V8, I probably still like it.' },
    { user: 'Dana R.', num: 'PWR-002', ride: 'Sunset Chaser', spec: '1993 Toyota Supra', img: 'ph2', likes: 18, bio: 'Turbo noises and golden-hour cruises. Supra owner since 2019.' },
    { user: 'Cole B.', num: 'PWR-003', ride: 'Night Owl', spec: '1969 Ford Mustang', img: 'ph3', likes: 31, bio: 'Night-shift wrench turner. Mustang guy, rain or shine.' },
  ],
  events: [
    { d: '13', m: 'OCT', title: 'Burger King Cruise Night', date: 'Tuesday, October 13, 2026', time: '6:00 PM', loc: 'Longview, TX', desc: 'Weekly cruise-in at the Burger King lot. All makes welcome, food inside.' },
    { d: '17', m: 'OCT', title: 'Best of Both Worlds Auto & Cycle Show', date: 'Saturday, October 17, 2026', time: '7:00 AM', loc: 'Hawkins, TX', desc: 'Cars and bikes together for a full day of show, shine, and swap meet.' },
    { d: '17', m: 'OCT', title: 'Pin Ups & Pistons', date: 'Saturday, October 17, 2026', time: '10:00 AM', loc: 'Longview, TX', desc: 'Pin-up contest, live music, and a whole lot of chrome.' },
    { d: '17', m: 'OCT', title: 'Old School Cruise Night', date: 'Saturday, October 17, 2026', time: '6:30 PM', loc: 'Tyler, TX', desc: 'Old school rides roll through downtown Tyler after dark.' },
  ],
  pastEvents: [ { title: 'Bullard Bluebonnet Festival Car Show', date: 'October 3, 2026', loc: 'Bullard, TX' } ],
};
function dateBadge(parent, d, m) {
  const badge = F(parent, { name: 'Date badge', layout: 'VERTICAL', gap: 0, cross: 'CENTER', align: 'CENTER', w: 54, padY: 6, fill: TOK.red, radius: 8 });
  return badge;
}
async function eventCard(parent, e, V, o) {
  o = o || {};
  const card = F(parent, { name: 'Event card / ' + e.title, layout: 'VERTICAL', gap: 6, sizingH: 'FILL', fill: TOK.paper, stroke: TOK.line, radius: 10, padX: 22, padY: 19, shadow: true });
  card.paddingLeft = 83;
  const badge = F(card, { name: 'Date badge', layout: 'VERTICAL', gap: 0, cross: 'CENTER', align: 'CENTER', w: 54, padY: 6, fill: TOK.red, radius: 8 });
  badge.layoutPositioning = 'ABSOLUTE'; badge.x = 18; badge.y = 19;
  await T(badge, e.d, { font: 'Bebas Neue', size: 27, color: TOK.white, lh: 100, align: 'CENTER' });
  await T(badge, e.m, { font: 'Barlow', style: 'Bold', size: 11, color: TOK.white, spacing: 12, align: 'CENTER' });
  await T(card, e.title.toUpperCase(), { font: 'Bebas Neue', size: 26, color: TOK.ink, spacing: 6, lh: 105, width: V.mob ? 225 : 260 });
  await T(card, e.date + (e.time ? ' \u00b7 ' + e.time : ''), { size: 15, color: TOK.muted, lh: 150 });
  if (e.loc) await T(card, e.loc, { size: 15, color: TOK.muted, lh: 150 });
  if (o.desc && e.desc) { await T(card, e.desc, { size: 15, color: TOK.inkSoft, lh: 160, width: V.mob ? 225 : 260 }); }
  return card;
}
async function vehicleCard(parent, m, V, o) {
  o = o || {};
  const card = F(parent, { name: 'Vehicle card / ' + m.ride, layout: 'VERTICAL', gap: 0, sizingH: 'FILL', fill: TOK.paper, stroke: TOK.line, radius: 10, pad: 0, shadow: true, clips: true });
  const th = imgRect(card, m.img, 0, 0, { sizingH: 'FILL' });
  th.resize(th.width, V.mob ? 220 : 240);
  const body = F(card, { name: 'Card body', layout: 'VERTICAL', gap: 6, sizingH: 'FILL', padX: 22, padY: 16 });
  const titleRow = F(body, { name: 'Title row', layout: 'HORIZONTAL', gap: 8, cross: 'CENTER', sizingH: 'FILL' });
  await T(titleRow, m.ride.toUpperCase(), { name: 'Vehicle / ' + m.ride, font: 'Bebas Neue', size: 26, color: TOK.ink, spacing: 6, lh: 105 });
  if (o.primary) {
    const pill = F(titleRow, { name: 'Primary pill', layout: 'HORIZONTAL', gap: 0, cross: 'CENTER', fill: TOK.red, radius: 999, padX: 10, padY: 3 });
    await T(pill, 'PRIMARY', { font: 'Barlow', style: 'Bold', size: 11, color: TOK.white, spacing: 14 });
  }
  await T(body, m.spec, { size: 15, color: TOK.muted, lh: 150 });
  const likeRow = F(body, { name: 'Like row', layout: 'HORIZONTAL', gap: 6, cross: 'CENTER' });
  heart(likeRow, 14, TOK.red);
  await T(likeRow, String(m.likes) + (m.likes === 1 ? ' like' : ' likes'), { size: 14, color: TOK.muted });
  return card;
}

// 13/14 — Login (Desktop + Mobile)
const y0 = stackY();
const out = { frames: [] };

async function buildLogin(V, name) {
  const page = newPageFrame(name, V, y0);
  topbar(page, V);
  const narrow = V.mob ? V.wrap : 720;
  const { wrap } = section(page, V, TOK.cream, narrow);
  wrap.itemSpacing = 0;
  await kicker(wrap, 'Welcome back');
  await T(wrap, 'LOG IN', { font: 'Bebas Neue', size: V.title, color: TOK.ink, spacing: 4, lh: 102, width: narrow });
  const form = F(wrap, { name: 'Login form', layout: 'VERTICAL', gap: 18, sizingH: 'FILL' });
  await field(form, 'Username or email', 'Username or email', V);
  await field(form, 'Password', 'Your password', V);
  await btn(form, 'Log in', 'big');
  const joinLine = F(wrap, { name: 'Join line', layout: 'HORIZONTAL', gap: 6, cross: 'CENTER' });
  await T(joinLine, 'Not a member yet?', { size: 16, color: TOK.muted });
  await T(joinLine, 'Join Powerpacked', { name: 'Link / Join Powerpacked', size: 16, color: TOK.red, style: 'SemiBold' });
  const resendLine = F(wrap, { name: 'Resend line', layout: 'HORIZONTAL', gap: 6, cross: 'CENTER' });
  await T(resendLine, 'Didn\u2019t get your verification email?', { size: 16, color: TOK.muted });
  await T(resendLine, 'Resend it', { name: 'Link / Resend it', size: 16, color: TOK.red, style: 'SemiBold' });
  wrap.itemSpacing = 14;
  await footer(page, V);
  out.frames.push({ id: page.id, name, w: Math.round(page.width), h: Math.round(page.height) });
  return page;
}
await buildLogin(D, '13 — Login / Desktop');
await buildLogin(M, '14 — Login / Mobile');
return out;
