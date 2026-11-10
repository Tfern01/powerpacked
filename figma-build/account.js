// 15/16 — Account / garage (Desktop + Mobile) — UNTESTED, written for resume after rate-limit reset
const y0 = stackY();
const out = { frames: [] };
const ME = SAMPLE.members[0];
const GARAGE = [
  { user: 'Marcus T.', num: 'PWR-001', ride: 'Big Red', spec: '1972 Chevrolet C10', img: 'ph1', likes: 24, primary: true },
  { user: 'Marcus T.', num: 'PWR-001', ride: 'Night Owl', spec: '1969 Ford Mustang', img: 'ph3', likes: 8, primary: false },
];

async function garageCard(parent, m, V) {
  const cardW = V.mob ? V.wrap : Math.floor((V.wrap - 22) / 2);
  const card = F(parent, { name: 'Vehicle card / ' + m.ride, layout: 'VERTICAL', gap: 0, sizingH: 'FILL', fill: TOK.paper, stroke: TOK.line, radius: 10, pad: 0, shadow: true, clips: true });
  imgRect(card, m.img, cardW, V.mob ? 200 : 220);
  const body = F(card, { name: 'Card body', layout: 'VERTICAL', gap: 6, sizingH: 'FILL', padX: 22, padY: 16 });
  const titleRow = F(body, { name: 'Title row', layout: 'HORIZONTAL', gap: 8, cross: 'CENTER', sizingH: 'FILL' });
  await T(titleRow, m.ride.toUpperCase(), { name: 'Vehicle / ' + m.ride, font: 'Bebas Neue', size: 26, color: TOK.ink, spacing: 6, lh: 105 });
  if (m.primary) {
    const pill = F(titleRow, { name: 'Primary pill', layout: 'HORIZONTAL', gap: 0, cross: 'CENTER', fill: TOK.red, radius: 999, padX: 10, padY: 3 });
    await T(pill, 'PRIMARY', { font: 'Barlow', style: 'Bold', size: 11, color: TOK.white, spacing: 14 });
  }
  await T(body, m.spec, { size: 15, color: TOK.muted, lh: 150 });
  const likeRow = F(body, { name: 'Like row', layout: 'HORIZONTAL', gap: 6, cross: 'CENTER' });
  heart(likeRow, 14, TOK.red);
  await T(likeRow, String(m.likes) + ' likes \u00b7 ', { size: 14, color: TOK.muted });
  await T(likeRow, 'view', { name: 'Link / view', size: 14, color: TOK.red, style: 'SemiBold' });
  const acts = F(body, { name: 'Card actions', layout: 'HORIZONTAL', gap: 8, sizingH: 'FILL', wrap: true });
  await btn(acts, 'Edit', 'outline');
  if (!m.primary) { await btn(acts, 'Set as primary', 'outline'); }
  await btn(acts, 'Remove', 'outline');
  return card;
}

async function buildAccount(V, name) {
  const page = newPageFrame(name, V, y0);
  topbar(page, V);
  const head = pageHead(page, V, ME.num, 'My Account');
  const headWrap = head.children[0];
  const links = F(headWrap, { name: 'Profile links', layout: 'HORIZONTAL', gap: 8, cross: 'CENTER' });
  await T(links, 'View my public profile', { name: 'Link / View my public profile', size: 16, color: TOK.red, style: 'SemiBold' });
  await T(links, '\u00b7', { size: 16, color: TOK.greyBg });
  await T(links, 'Admin panel', { name: 'Link / Admin panel', size: 16, color: TOK.red, style: 'SemiBold' });
  const { wrap } = section(page, V, TOK.cream);
  wrap.itemSpacing = 20;
  const alert = F(wrap, { name: 'Welcome alert', layout: 'VERTICAL', gap: 0, sizingH: 'FILL', fill: TOK.greenBg, stroke: TOK.greenLine, radius: 8, padX: 19, padY: 14 });
  await T(alert, 'Welcome to the club, Marcus T.! Your member number is PWR-001. Set up your profile below.', { size: 16, color: TOK.greenTx, lh: 150, width: V.wrap - 38 });
  await sectionTitle(wrap, 'Profile', V);
  const form = F(wrap, { name: 'Profile form', layout: 'VERTICAL', gap: 18, sizingH: 'FILL' });
  const avRow = F(form, { name: 'Avatar row', layout: 'HORIZONTAL', gap: 16, cross: 'CENTER', sizingH: 'FILL' });
  const av = F(avRow, { name: 'Avatar', layout: 'VERTICAL', gap: 0, cross: 'CENTER', main: 'CENTER', w: 52, h: 52, fill: TOK.dark, stroke: TOK.red, strokeW: 2, radius: 26 });
  await T(av, 'M', { name: 'Avatar initial', font: 'Bebas Neue', size: 28, color: TOK.gold });
  await field(avRow, 'Profile picture', 'Choose a photo\u2026', V);
  await field(form, 'Bio (up to 500 characters)', ME.bio, V);
  await field(form, 'New password (leave blank to keep current)', 'New password', V);
  await btn(form, 'Save Profile', 'red');
  await sectionTitle(wrap, 'My Garage', V);
  const grid = F(wrap, { name: 'Garage cards', layout: V.mob ? 'VERTICAL' : 'HORIZONTAL', gap: 22, sizingH: 'FILL' });
  for (const m of GARAGE) { await garageCard(grid, m, V); }
  await T(wrap, 'ADD A RIDE', { font: 'Bebas Neue', size: 24, color: TOK.ink, spacing: 6, lh: 102 });
  const addForm = F(wrap, { name: 'Add ride form', layout: 'VERTICAL', gap: 18, sizingH: 'FILL' });
  const fg = F(addForm, { name: 'Form grid', layout: V.mob ? 'VERTICAL' : 'HORIZONTAL', gap: 18, sizingH: 'FILL' });
  await field(fg, 'Ride name / nickname *', 'e.g. Big Red', V);
  await field(fg, 'Year', 'e.g. 1972', V);
  if (!V.mob) {
    const fg2 = F(addForm, { name: 'Form grid 2', layout: 'HORIZONTAL', gap: 18, sizingH: 'FILL' });
    await field(fg2, 'Make', 'e.g. Chevrolet', V);
    await field(fg2, 'Model', 'e.g. Chevelle', V);
  } else {
    await field(addForm, 'Make', 'e.g. Chevrolet', V);
    await field(addForm, 'Model', 'e.g. Chevelle', V);
  }
  await field(addForm, 'Photo (jpg, png, gif, or webp, up to 15MB)', 'Choose a photo\u2026', V);
  await btn(addForm, 'Add Ride', 'red');
  await btn(wrap, 'Log out', 'outline');
  await footer(page, V);
  out.frames.push({ id: page.id, name, w: Math.round(page.width), h: Math.round(page.height) });
  return page;
}
await buildAccount(D, '15 — Account / Desktop');
await buildAccount(M, '16 — Account / Mobile');
return out;
