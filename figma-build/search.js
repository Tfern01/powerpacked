// 33/34 — Search results (Desktop + Mobile) — UNTESTED, written for resume after rate-limit reset
const y0 = stackY();
const out = { frames: [] };
const ME = SAMPLE.members[0];

async function buildSearch(V, name) {
  const page = newPageFrame(name, V, y0);
  topbar(page, V);
  pageHead(page, V, 'Find it', 'Search results for \u201cC10\u201d', '1 member \u00b7 1 ride \u00b7 0 events');
  const { wrap } = section(page, V, TOK.cream);
  wrap.itemSpacing = 28;
  await sectionTitle(wrap, 'Members', V);
  const mCard = F(wrap, { name: 'Search member / Marcus T.', layout: 'HORIZONTAL', gap: 16, cross: 'CENTER', sizingH: 'FILL', fill: TOK.paper, stroke: TOK.line, radius: 10, padX: 22, padY: 16 });
  const av = F(mCard, { name: 'Avatar', layout: 'VERTICAL', gap: 0, cross: 'CENTER', main: 'CENTER', w: 52, h: 52, fill: TOK.dark, stroke: TOK.red, strokeW: 2, radius: 26 });
  await T(av, 'M', { font: 'Bebas Neue', size: 28, color: TOK.gold });
  const mInfo = F(mCard, { name: 'Member info', layout: 'VERTICAL', gap: 2, sizingH: 'FILL' });
  await T(mInfo, 'Marcus T.', { name: 'Link / Marcus T.', size: 16, color: TOK.ink, style: 'Bold' });
  await T(mInfo, 'PWR-001', { size: 14, color: TOK.muted });
  await T(mCard, 'View profile', { name: 'Link / View profile', size: 14, color: TOK.red, style: 'SemiBold' });
  await sectionTitle(wrap, 'Rides', V);
  const grid = F(wrap, { name: 'Search rides', layout: 'HORIZONTAL', gap: 22, sizingH: 'FILL' });
  await vehicleCard(grid, { user: 'Marcus T.', num: 'PWR-001', ride: 'Big Red', spec: '1972 Chevrolet C10', img: 'ph1', likes: 24, primary: true }, V, { primary: true });
  await footer(page, V);
  out.frames.push({ id: page.id, name, w: Math.round(page.width), h: Math.round(page.height) });
  return page;
}
await buildSearch(D, '33 — Search / Desktop');
await buildSearch(M, '34 — Search / Mobile');
return out;
