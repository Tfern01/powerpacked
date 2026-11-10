// 05/06 — Events (Desktop + Mobile)
const y0 = stackY();
const out = { frames: [] };

async function buildEvents(V, name) {
  const page = newPageFrame(name, V, y0);
  topbar(page, V);
  pageHead(page, V, 'Meets, cruises & shows', 'Events Calendar');
  const { wrap } = section(page, V, TOK.cream);
  wrap.itemSpacing = 28;
  await sectionTitle(wrap, 'Upcoming', V);
  const evs = SAMPLE.events;
  if (V.mob) {
    const col = F(wrap, { name: 'Event cards', layout: 'VERTICAL', gap: 16, sizingH: 'FILL' });
    for (const e of evs) { await eventCard(col, e, V, { desc: true }); }
  } else {
    for (let i = 0; i < evs.length; i += 3) {
      const row = F(wrap, { name: 'Event row', layout: 'HORIZONTAL', gap: 22, sizingH: 'FILL' });
      for (const e of evs.slice(i, i + 3)) { await eventCard(row, e, V, { desc: true }); }
    }
  }
  await sectionTitle(wrap, 'Past Events', V);
  const past = F(wrap, { name: 'Past event card', layout: 'VERTICAL', gap: 6, sizingH: 'FILL', fill: TOK.paper, stroke: TOK.line, radius: 10, padX: 22, padY: 19, shadow: true });
  past.opacity = 0.72;
  await T(past, SAMPLE.pastEvents[0].title.toUpperCase(), { font: 'Bebas Neue', size: 26, color: TOK.ink, spacing: 6, lh: 105, width: V.mob ? 280 : 1000 });
  await T(past, SAMPLE.pastEvents[0].date + ' \u00b7 ' + SAMPLE.pastEvents[0].loc, { size: 15, color: TOK.muted, lh: 150 });
  await footer(page, V);
  out.frames.push({ id: page.id, name, w: Math.round(page.width), h: Math.round(page.height) });
  return page;
}
await buildEvents(D, '05 — Events / Desktop');
await buildEvents(M, '06 — Events / Mobile');
return out;
