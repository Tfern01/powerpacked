// 07/08 — Gallery / Members Corner (Desktop + Mobile)
const y0 = stackY();
const out = { frames: [] };
const WALL = [
  { user: 'Marcus T.', num: 'PWR-001', img: 'ph1', likes: 24, liked: true },
  { user: 'Dana R.', num: 'PWR-002', img: 'ph2', likes: 18, liked: false },
  { user: 'Cole B.', num: 'PWR-003', img: 'ph3', likes: 31, liked: false },
  { user: 'Riley K.', num: 'PWR-004', img: 'ph2', likes: 12, liked: false },
  { user: 'Jess M.', num: 'PWR-005', img: 'ph3', likes: 9, liked: false },
  { user: 'Tony L.', num: 'PWR-006', img: 'ph1', likes: 15, liked: false },
];

async function wallItem(parent, w, m) {
  const item = F(parent, { name: 'Wall item / ' + m.user, w, h: w, fill: TOK.dark2, radius: 8, clips: true });
  imgRect(item, m.img, w, w, { x: 0, y: 0 });
  const band = R(item, { name: 'Caption band', w, h: 64, fill: '#0A0806', fillOp: 0.75, x: 0, y: w - 64 });
  const cap = F(item, { name: 'Caption', layout: 'HORIZONTAL', gap: 10, cross: 'CENTER', x: 14, y: w - 40 });
  await T(cap, m.user.toUpperCase(), { font: 'Bebas Neue', size: 20, color: TOK.cream, spacing: 8 });
  await T(cap, m.num, { font: 'Barlow', style: 'Bold', size: 12, color: TOK.gold, spacing: 18 });
  const pill = F(item, { name: 'Like pill', layout: 'HORIZONTAL', gap: 6, cross: 'CENTER', fill: m.liked ? TOK.red : '#0A0806', fillOp: m.liked ? 1 : 0.55, stroke: m.liked ? TOK.red : TOK.cream, strokeW: 2, radius: 999, padX: 13, padY: 6, x: w - 78, y: 10 });
  heart(pill, 13, TOK.white);
  await T(pill, String(m.likes), { font: 'Barlow', style: 'Bold', size: 14, color: TOK.cream });
  return item;
}

async function buildGallery(V, name) {
  const page = newPageFrame(name, V, y0);
  topbar(page, V);
  pageHead(page, V, 'The clubhouse wall', 'Members Corner', 'Every member\u2019s chosen ride, in one place. Click any photo to like and comment.');
  const { wrap } = section(page, V, TOK.cream);
  wrap.itemSpacing = 16;
  const cols = V.mob ? 2 : 4;
  const gap = 16;
  const cw = Math.floor((V.wrap - (cols - 1) * gap) / cols);
  for (let i = 0; i < WALL.length; i += cols) {
    const row = F(wrap, { name: 'Wall row', layout: 'HORIZONTAL', gap, sizingH: 'FILL' });
    for (const m of WALL.slice(i, i + cols)) { await wallItem(row, cw, m); }
  }
  await footer(page, V);
  out.frames.push({ id: page.id, name, w: Math.round(page.width), h: Math.round(page.height) });
  return page;
}
await buildGallery(D, '07 — Gallery / Desktop');
await buildGallery(M, '08 — Gallery / Mobile');
return out;
