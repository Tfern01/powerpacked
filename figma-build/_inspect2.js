const page = figma.currentPage;
const out = [];
for (const f of page.children) {
  if (f.name.includes('Landing / Desktop')) {
    const cards = f.findAll(n => n.name.startsWith('Event card'));
    for (const c of cards.slice(0, 1)) {
      out.push({ card: c.name, padL: c.paddingLeft, padT: c.paddingTop, kids: c.children.map(k => ({ name: k.name.slice(0,20), x: Math.round(k.x), y: Math.round(k.y), w: Math.round(k.width) })) });
    }
  }
}
return out;
