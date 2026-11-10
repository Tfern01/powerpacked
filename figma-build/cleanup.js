// Remove nodes by ID (cleanup before a rebuild)
const IDS = ['6:81'];
const removed = [];
for (const id of IDS) {
  const n = figma.getNodeById(id);
  if (n) { n.remove(); removed.push(id); }
}
return { removed };
