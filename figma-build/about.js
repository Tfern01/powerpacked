// 03/04 — About (Desktop + Mobile)
const y0 = stackY();
const out = { frames: [], slots: [] };
const MANIFESTO = [
  'Different cars. Different people. One Community! Unity without Uniformity. Powerpacked stems from a deep rooted love and appreciation of the automobile, and the many cultures that surround it. Powerpacked combines all subsects of car culture into one large community where everyone can come together and share their passions, regardless of what brand or model of vehicle they own.',
  'Powerpacked is a central hub. It levels the playing field and unites everyone under one central core idea; being Powerpacked! We would have our own unique vehicles, but be part of a large network where we fit in regardless of what we drive.',
  'Powerpacked blurs the lines of car manufacturers, styles, type of propulsion, etc. and creates one large community that shares a love of all things that move on 2 or more wheels. The core element of this brand is to be happy driving what you have, showing it off, and networking with unique individuals.',
];
const VALUES = [
  { t: 'Power.', s: 'The machines we love.' },
  { t: 'Mobility.', s: 'The freedom to roam.' },
  { t: 'Freedom.', s: 'No gatekeeping, ever.' },
];

async function buildAbout(V, name) {
  const page = newPageFrame(name, V, y0);
  topbar(page, V);
  pageHead(page, V, 'Why we exist', 'About Powerpacked');
  const narrow = V.mob ? V.wrap : 720;
  const { wrap } = section(page, V, TOK.cream, narrow);
  wrap.itemSpacing = 20;
  await sectionTitle(wrap, 'The Mission', V);
  const mani = F(wrap, { name: 'Manifesto', layout: 'VERTICAL', gap: 16, sizingH: 'FILL', fill: TOK.paper, stroke: TOK.line, radius: 4, padX: 35, padY: 32, shadow: true, clips: true });
  const spine = R(mani, { name: 'Red spine', w: 6, h: 10, fill: TOK.red, x: 0, y: 0, abs: true });
  for (const p of MANIFESTO) {
    await T(mani, p, { size: V.mob ? 16 : 18, color: TOK.inkSoft, lh: 160, width: narrow - 70 });
  }
  spine.resize(6, mani.height);
  const vals = F(wrap, { name: 'Values', layout: V.mob ? 'VERTICAL' : 'HORIZONTAL', gap: 16, sizingH: 'FILL' });
  for (const v of VALUES) {
    const card = F(vals, { name: 'Value / ' + v.t, layout: 'VERTICAL', gap: 5, sizingH: 'FILL', fill: TOK.dark2, stroke: TOK.line, radius: 10, padX: 19, padY: 19 });
    await T(card, v.t.toUpperCase(), { font: 'Bebas Neue', size: 22, color: TOK.gold, spacing: 6, lh: 105 });
    await T(card, v.s, { size: 15, color: TOK.muted, lh: 150 });
  }
  const ctaWrap = F(wrap, { name: 'CTA', layout: 'HORIZONTAL', gap: 0, cross: 'CENTER', sizingH: 'FILL' });
  await btn(ctaWrap, 'Join the Community', 'big');
  await footer(page, V);
  out.frames.push({ id: page.id, name, w: Math.round(page.width), h: Math.round(page.height) });
  return page;
}
await buildAbout(D, '03 — About / Desktop');
await buildAbout(M, '04 — About / Mobile');
return out;
