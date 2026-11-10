// Inspect bounds of the landing frame subtree
const page = figma.getNodeById('11:2');
function walk(n, depth, out) {
  const at = n.absoluteTransform || [[1,0,0],[0,1,0]];
  out.push({ name: n.name, type: n.type, x: Math.round(n.x), y: Math.round(n.y), w: Math.round(n.width), h: Math.round(n.height), absX: Math.round(at[0][2]), absY: Math.round(at[1][2]), tar: n.type === 'TEXT' ? n.textAutoResize : (n.layoutMode || ''), lsH: n.layoutSizingHorizontal || '', lsV: n.layoutSizingVertical || '', align: n.layoutAlign || '' });
  if (depth < 4 && 'children' in n) {
    for (const c of n.children) walk(c, depth + 1, out);
  }
  return out;
}
const rows = walk(page, 0, []);
return { pageW: page.width, pageH: page.height, rows: rows.filter(r => r.type === 'FRAME' || r.type === 'TEXT') };
