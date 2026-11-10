// 09/10 — Shop coming-soon (Desktop + Mobile)
const y0 = stackY();
const out = { frames: [] };

async function buildShop(V, name) {
  const page = newPageFrame(name, V, y0);
  topbar(page, V);
  pageHead(page, V, 'Wear the badge', 'Shop');
  const { wrap } = section(page, V, TOK.cream);
  const box = F(wrap, { name: 'Coming soon box', layout: 'VERTICAL', gap: 0, sizingH: 'FILL', fill: TOK.paper, stroke: TOK.line, strokeW: 2, radius: 10, padX: 32, padY: 64, cross: 'CENTER' });
  box.dashPattern = [0, 0];
  const badge = F(box, { name: 'Soon badge', layout: 'HORIZONTAL', gap: 0, cross: 'CENTER', fill: TOK.dark, stroke: TOK.gold, strokeW: 2, radius: 4, padX: 22, padY: 6 });
  badge.rotation = -3;
  await T(badge, 'COMING SOON', { font: 'Bebas Neue', size: 18, color: TOK.gold, spacing: 30, lh: 100 });
  await T(box, 'THE MERCH GARAGE IS BEING STOCKED', { name: 'Empty title', font: 'Bebas Neue', size: V.mob ? 28 : 32, color: TOK.ink, spacing: 6, lh: 102, align: 'CENTER', width: V.mob ? 300 : 600 });
  await T(box, 'Tees, decals, banners, the good stuff is on the way. Join the club and you\u2019ll hear about drops first.', { size: 16, color: TOK.muted, align: 'CENTER', width: V.mob ? 300 : 560, lh: 160 });
  const btnWrap = F(box, { name: 'CTA', layout: 'HORIZONTAL', gap: 0, cross: 'CENTER', sizingH: 'FILL' });
  await btn(btnWrap, 'Join Now', 'red');
  box.itemSpacing = 19;
  await footer(page, V);
  out.frames.push({ id: page.id, name, w: Math.round(page.width), h: Math.round(page.height) });
  return page;
}
await buildShop(D, '09 — Shop / Desktop');
await buildShop(M, '10 — Shop / Mobile');
return out;
