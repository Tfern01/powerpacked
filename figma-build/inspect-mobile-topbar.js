// Inspect mobile topbar subtree
const page = figma.getNodeById('19:2');
const topbar = page.children[0];
function walk(n, depth, out) {
  const at = n.absoluteTransform || [[1,0,0],[0,1,0]];
  out.push({ name: n.name, type: n.type, x: Math.round(n.x), y: Math.round(n.y), w: Math.round(n.width), h: Math.round(n.height), absX: Math.round(at[0][2]), absY: Math.round(at[1][2]), vis: n.visible });
  if (depth < 5 && 'children' in n) for (const c of n.children) walk(c, depth + 1, out);
  return out;
}
return walk(topbar, 0, []);
