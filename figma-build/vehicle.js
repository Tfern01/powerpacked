// 19/20 — Vehicle detail (Desktop + Mobile) — UNTESTED, written for resume after rate-limit reset
const y0 = stackY();
const out = { frames: [] };
const ME = SAMPLE.members[0];
const COMMENTS = [
  { user: 'Dana R.', num: 'PWR-002', date: 'Oct 12, 2026', body: 'That stance is perfect. What drop did you go with up front?' },
  { user: 'Cole B.', num: 'PWR-003', date: 'Oct 13, 2026', body: 'Saw this at the cruise night, looks even better in person. Clean build.' },
];

async function buildVehicle(V, name) {
  const page = newPageFrame(name, V, y0);
  topbar(page, V);
  const head = pageHead(page, V, 'Member ride', 'Big Red', '1972 Chevrolet C10 \u2014 owned by Marcus T. (PWR-001)');
  const headWrap = head.children[0];
  const back = F(headWrap, { name: 'Back link', layout: 'HORIZONTAL', gap: 0, cross: 'CENTER' });
  await T(back, '\u2190 Members Corner', { name: 'Link / Back to Members Corner', size: 16, color: TOK.cream, style: 'SemiBold' });
  headWrap.insertChild(0, back);
  const narrow = V.mob ? V.wrap : 720;
  const { wrap } = section(page, V, TOK.cream, narrow);
  wrap.itemSpacing = 24;
  imgRect(wrap, 'ph1', narrow, Math.round(narrow * 10 / 16), { name: 'IMG / vehicle hero' });
  const meta = F(wrap, { name: 'Meta row', layout: 'HORIZONTAL', gap: 16, cross: 'CENTER', sizingH: 'FILL' });
  const av = F(meta, { name: 'Avatar', layout: 'VERTICAL', gap: 0, cross: 'CENTER', main: 'CENTER', w: 52, h: 52, fill: TOK.dark, stroke: TOK.red, strokeW: 2, radius: 26 });
  await T(av, 'M', { font: 'Bebas Neue', size: 28, color: TOK.gold });
  const owner = F(meta, { name: 'Owner', layout: 'VERTICAL', gap: 2, sizingH: 'FILL' });
  await T(owner, 'Marcus T.', { name: 'Link / Marcus T.', size: 16, color: TOK.ink, style: 'SemiBold' });
  await T(owner, 'PWR-001', { size: 14, color: TOK.muted });
  const likeBtn = F(meta, { name: 'Button / Like', layout: 'HORIZONTAL', gap: 8, cross: 'CENTER', fill: TOK.red, radius: 4, padX: 16, padY: 10 });
  heart(likeBtn, 16, TOK.white);
  await T(likeBtn, '24 likes', { font: 'Barlow', style: 'Bold', size: 16, color: TOK.white });
  await sectionTitle(wrap, 'Comments (2)', V);
  for (const c of COMMENTS) {
    const card = F(wrap, { name: 'Comment / ' + c.user, layout: 'VERTICAL', gap: 8, sizingH: 'FILL', fill: TOK.paper, stroke: TOK.line, radius: 8, padX: 18, padY: 16 });
    const chead = F(card, { name: 'Comment head', layout: 'HORIZONTAL', gap: 8, cross: 'CENTER', sizingH: 'FILL' });
    await T(chead, c.user, { size: 16, color: TOK.ink, style: 'Bold' });
    await T(chead, c.num, { size: 14, color: TOK.muted });
    await T(chead, c.date, { size: 14, color: TOK.muted });
    await T(card, c.body, { size: 16, color: TOK.ink, lh: 160, width: narrow - 36 });
  }
  const form = F(wrap, { name: 'Comment form', layout: 'VERTICAL', gap: 12, sizingH: 'FILL' });
  const taLabel = F(form, { name: 'Textarea', layout: 'VERTICAL', gap: 6, sizingH: 'FILL' });
  await T(taLabel, 'Add a comment', { size: 16, color: TOK.ink, style: 'SemiBold' });
  const ta = R(taLabel, { name: 'Comment input', w: narrow, h: 110, fill: TOK.paper, stroke: TOK.line, strokeW: 2, radius: 6, sizingH: 'FILL' });
  await btn(form, 'Post Comment', 'red');
  const loginLine = F(wrap, { name: 'Login line', layout: 'HORIZONTAL', gap: 6, cross: 'CENTER' });
  await T(loginLine, 'Want to comment?', { size: 16, color: TOK.muted });
  await T(loginLine, 'Log in', { name: 'Link / Log in', size: 16, color: TOK.red, style: 'SemiBold' });
  await footer(page, V);
  out.frames.push({ id: page.id, name, w: Math.round(page.width), h: Math.round(page.height) });
  return page;
}
await buildVehicle(D, '19 — Vehicle / Desktop');
await buildVehicle(M, '20 — Vehicle / Mobile');
return out;
