// 17/18 — Member profile (Desktop + Mobile) — UNTESTED, written for resume after rate-limit reset
const y0 = stackY();
const out = { frames: [] };
const ME = SAMPLE.members[0];
const GARAGE = [
  { user: 'Marcus T.', num: 'PWR-001', ride: 'Big Red', spec: '1972 Chevrolet C10', img: 'ph1', likes: 24, primary: true },
  { user: 'Marcus T.', num: 'PWR-001', ride: 'Night Owl', spec: '1969 Ford Mustang', img: 'ph3', likes: 8, primary: false },
];

async function buildMember(V, name) {
  const page = newPageFrame(name, V, y0);
  topbar(page, V);
  const head = F(page, { name: 'Page head', layout: 'VERTICAL', gap: 0, sizingH: 'FILL', padY: V.mob ? 36 : 48, cross: 'CENTER', fill: TOK.dark });
  const headWrap = F(head, { name: 'Member head', layout: V.mob ? 'VERTICAL' : 'HORIZONTAL', gap: 24, cross: V.mob ? 'CENTER' : 'CENTER', w: V.wrap, layoutAlign: 'CENTER' });
  const av = F(headWrap, { name: 'Avatar', layout: 'VERTICAL', gap: 0, cross: 'CENTER', main: 'CENTER', w: 120, h: 120, fill: TOK.dark, stroke: TOK.red, strokeW: 4, radius: 60 });
  await T(av, 'M', { name: 'Avatar initial', font: 'Bebas Neue', size: 56, color: TOK.gold });
  const info = F(headWrap, { name: 'Member info', layout: 'VERTICAL', gap: 6, sizingH: 'FILL' });
  await kicker(info, ME.num);
  await T(info, ME.user.toUpperCase(), { font: 'Bebas Neue', size: V.title, color: TOK.cream, spacing: 4, lh: 102, width: V.mob ? V.wrap : 700 });
  await T(info, ME.bio, { size: 16, color: TOK.cream, lh: 160, width: V.mob ? V.wrap : 700 });
  await T(info, 'Member since October 2026', { size: 15, color: TOK.greyBg, lh: 150 });
  R(head, { name: 'Red rule', w: V.W, h: 3, fill: TOK.red, sizingH: 'FILL' });
  const { wrap } = section(page, V, TOK.cream);
  wrap.itemSpacing = 28;
  await sectionTitle(wrap, 'The Garage', V);
  const grid = F(wrap, { name: 'Garage cards', layout: V.mob ? 'VERTICAL' : 'HORIZONTAL', gap: 22, sizingH: 'FILL' });
  for (const m of GARAGE) { await vehicleCard(grid, m, V, { primary: m.primary }); }
  await footer(page, V);
  out.frames.push({ id: page.id, name, w: Math.round(page.width), h: Math.round(page.height) });
  return page;
}
await buildMember(D, '17 — Member / Desktop');
await buildMember(M, '18 — Member / Mobile');
return out;
