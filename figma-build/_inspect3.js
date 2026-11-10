const page = figma.currentPage;
const out = [];
const cards = page.findAll(n => n.name === 'Event card / Burger King Cruise Night');
for (const c of cards) {
  out.push({ card: c.name, padL: c.paddingLeft, padT: c.paddingTop, kids: c.children.map(k => ({ name: k.name.slice(0,22), x: Math.round(k.x), y: Math.round(k.y), w: Math.round(k.width) })) });
}
return out;
