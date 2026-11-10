// 29/30 — Coming Soon lock page (Desktop + Mobile) — UNTESTED, written for resume after rate-limit reset
// No topbar/footer: full dark page with a centered card, nudged 3vh above center.
const y0 = stackY();
const out = { frames: [] };

async function buildLock(V, name, H) {
  const page = figma.createFrame();
  page.name = name;
  page.resize(V.W, H);
  page.fills = solid('#141210');
  page.layoutMode = 'NONE';
  figma.currentPage.appendChild(page);
  page.x = V.mob ? 1560 : 0;
  page.y = y0;
  const cardW = V.mob ? 330 : 420;
  const card = F(page, { name: 'Lock card', layout: 'VERTICAL', gap: 0, cross: 'CENTER', w: cardW, fill: '#1E1A16', stroke: '#3A332B', strokeW: 1, radius: 12, padX: 36, padY: 40 });
  const pill = F(card, { name: 'Coming soon pill', layout: 'HORIZONTAL', gap: 0, cross: 'CENTER', fill: '#1E1A16', stroke: TOK.red, strokeW: 2, radius: 999, padX: 18, padY: 6 });
  await T(pill, 'COMING SOON', { font: 'Bebas Neue', size: 16, color: TOK.red, spacing: 40, lh: 100 });
  await T(card, 'POWERPACKED', { font: 'Bebas Neue', size: V.mob ? 34 : 40, color: TOK.cream, spacing: 12, lh: 100, align: 'CENTER' });
  await T(card, 'Driven by Difference', { font: 'Barlow', style: 'Italic', size: 20, color: TOK.cream, align: 'CENTER' });
  await T(card, 'One community for every kind of ride. We\u2019re still in the garage, tuning up \u2014 check back soon.', { size: 16, color: '#B8AF9E', lh: 160, align: 'CENTER', width: cardW - 72 });
  R(card, { name: 'Divider', w: cardW - 72, h: 1, fill: '#3A332B' });
  await T(card, 'PRIVATE PREVIEW', { font: 'Barlow', style: 'Bold', size: 13, color: TOK.muted, spacing: 24, align: 'CENTER' });
  const pw = F(card, { name: 'Password field', layout: 'VERTICAL', gap: 6, sizingH: 'FILL' });
  const input = R(pw, { name: 'Password input', w: cardW - 72, h: 46, fill: '#14100C', stroke: '#3A332B', strokeW: 2, radius: 6, sizingH: 'FILL' });
  const ph = figma.createText(); await figma.loadFontAsync({ family: 'Barlow', style: 'Regular' }); ph.fontName = { family: 'Barlow', style: 'Regular' }; ph.characters = 'Preview password'; ph.fontSize = 16; ph.fills = solid(TOK.muted); ph.x = 14; ph.y = 14; input.appendChild(ph);
  const unlock = F(card, { name: 'Button / Unlock', layout: 'HORIZONTAL', gap: 0, cross: 'CENTER', main: 'CENTER', fill: TOK.red, radius: 4, padX: 16, padY: 12, sizingH: 'FILL' });
  await T(unlock, 'UNLOCK', { font: 'Barlow', style: 'Bold', size: 16, color: TOK.white, spacing: 10 });
  card.itemSpacing = 16;
  card.x = Math.round((V.W - cardW) / 2);
  card.y = Math.round((H - card.height) / 2 - H * 0.03);
  out.frames.push({ id: page.id, name, w: V.W, h: H });
  return page;
}
await buildLock(D, '29 — Coming Soon / Desktop', 900);
await buildLock(M, '30 — Coming Soon / Mobile', 844);
return out;
