// 31/32 — Admin dashboard (Desktop + Mobile) — UNTESTED, written for resume after rate-limit reset
const y0 = stackY();
const out = { frames: [] };
const STATS = [
  { n: '128', label: 'Members' },
  { n: '96', label: 'Rides' },
  { n: '4', label: 'Upcoming events' },
  { n: '0', label: 'Active products' },
  { n: '3', label: 'Unread messages' },
];
const LINKS = [
  { title: 'Manage Events', desc: 'Add, edit, and remove events on the calendar.', meta: '4 upcoming' },
  { title: 'Manage Products', desc: 'Add merch and set prices for the shop.', meta: '0 products' },
  { title: 'Contact Inbox', desc: 'Read and reply to messages from visitors.', meta: '3 unread' },
];

async function buildAdmin(V, name) {
  const page = newPageFrame(name, V, y0);
  topbar(page, V);
  pageHead(page, V, 'Site owner', 'Admin Panel', 'The numbers, the inbox, and the switches for the whole club.');
  const { wrap } = section(page, V, TOK.cream);
  wrap.itemSpacing = 24;
  const statsRow = F(wrap, { name: 'Stat cards', layout: 'HORIZONTAL', gap: 16, sizingH: 'FILL', wrap: true });
  const statW = V.mob ? Math.floor((V.wrap - 16) / 2) : Math.floor((V.wrap - 4 * 16) / 5);
  for (const s of STATS) {
    const card = F(statsRow, { name: 'Stat / ' + s.label, layout: 'VERTICAL', gap: 4, w: statW, fill: TOK.paper, stroke: TOK.line, radius: 8, padX: 20, padY: 20 });
    await T(card, s.n, { font: 'Bebas Neue', size: 48, color: TOK.red, lh: 100 });
    await T(card, s.label, { size: 14, color: TOK.muted });
  }
  const linksRow = F(wrap, { name: 'Admin links', layout: V.mob ? 'VERTICAL' : 'HORIZONTAL', gap: 22, sizingH: 'FILL' });
  for (const l of LINKS) {
    const card = F(linksRow, { name: 'Admin link / ' + l.title, layout: 'VERTICAL', gap: 8, sizingH: 'FILL', fill: TOK.paper, stroke: TOK.line, radius: 10, padX: 24, padY: 22 });
    await T(card, l.title.toUpperCase(), { font: 'Bebas Neue', size: 26, color: TOK.red, spacing: 6, lh: 105 });
    await T(card, l.desc, { size: 15, color: TOK.muted, lh: 150, width: V.mob ? V.wrap - 48 : 320 });
    await T(card, l.meta, { size: 14, color: TOK.muted, style: 'SemiBold' });
  }
  await footer(page, V);
  out.frames.push({ id: page.id, name, w: Math.round(page.width), h: Math.round(page.height) });
  return page;
}
await buildAdmin(D, '31 — Admin / Desktop');
await buildAdmin(M, '32 — Admin / Mobile');
return out;
