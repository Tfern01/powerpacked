const found = figma.currentPage.findAll(n => n.name === 'Manifesto');
const out = [];
for (const m of found) {
  out.push({ name: m.name, padL: m.paddingLeft, padR: m.paddingRight, w: Math.round(m.width),
    kids: m.children.map(c => ({ name: c.name.slice(0,20), type: c.type, x: Math.round(c.x), y: Math.round(c.y), w: Math.round(c.width), h: Math.round(c.height), tar: c.textAutoResize || '' })) });
}
return out;
