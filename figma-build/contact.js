// 27/28 — Contact (Desktop + Mobile) — UNTESTED, written for resume after rate-limit reset
const y0 = stackY();
const out = { frames: [] };

async function buildContact(V, name) {
  const page = newPageFrame(name, V, y0);
  topbar(page, V);
  pageHead(page, V, 'Say hello', 'Contact Us', 'Questions about the club, events, or merch? Send us a message and we\u2019ll get back to you.');
  const narrow = V.mob ? V.wrap : 720;
  const { wrap } = section(page, V, TOK.cream, narrow);
  wrap.itemSpacing = 0;
  const form = F(wrap, { name: 'Contact form', layout: 'VERTICAL', gap: 18, sizingH: 'FILL' });
  await field(form, 'Name', 'Your name', V);
  await field(form, 'Email', 'you@example.com', V);
  await field(form, 'Subject', 'What is this about?', V);
  const msgLabel = F(form, { name: 'Textarea', layout: 'VERTICAL', gap: 6, sizingH: 'FILL' });
  await T(msgLabel, 'Message', { size: 16, color: TOK.ink, style: 'SemiBold' });
  R(msgLabel, { name: 'Message input', w: narrow, h: 110, fill: TOK.paper, stroke: TOK.line, strokeW: 2, radius: 6, sizingH: 'FILL' });
  await btn(form, 'Send Message', 'big');
  wrap.itemSpacing = 14;
  await footer(page, V);
  out.frames.push({ id: page.id, name, w: Math.round(page.width), h: Math.round(page.height) });
  return page;
}
await buildContact(D, '27 — Contact / Desktop');
await buildContact(M, '28 — Contact / Mobile');
return out;
