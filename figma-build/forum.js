// 21/22 Forum index, 23/24 Forum category, 25/26 Forum thread (Desktop + Mobile)
// UNTESTED, written for resume after rate-limit reset
const y0 = stackY();
const out = { frames: [] };
const CATS = [
  { name: 'General Discussion', desc: 'Say hello, introduce yourself, and talk anything Powerpacked.', threads: 2, posts: 5, latest: 'Welcome to the club!', latestBy: 'Marcus T.' },
  { name: 'Builds & Projects', desc: 'Show your build, ask for help, and steal ideas (with credit).', threads: 2, posts: 6, latest: 'C10 frame-off resto \u2014 paint code help?', latestBy: 'Marcus T.' },
  { name: 'Events & Meets', desc: 'Cruise nights, car shows, and meetups \u2014 plan them here.', threads: 1, posts: 3, latest: 'Cruise night \u2014 who is going?', latestBy: 'Dana R.' },
  { name: 'Tech Talk', desc: 'Engines, suspension, wiring \u2014 the greasy details.', threads: 1, posts: 4, latest: 'Best carb for a 350?', latestBy: 'Cole B.' },
];
const THREADS = [
  { title: 'C10 frame-off resto \u2014 paint code help?', by: 'Marcus T.', date: 'Oct 12, 2026', posts: 3, latestBy: 'Dana R.', latestDate: 'Oct 13', locked: false },
  { title: '350 swap \u2014 what mounts?', by: 'Dana R.', date: 'Oct 12, 2026', posts: 2, latestBy: 'Cole B.', latestDate: 'Oct 13', locked: false },
  { title: 'Show your engine bay', by: 'Cole B.', date: 'Oct 11, 2026', posts: 1, latestBy: 'Cole B.', latestDate: 'Oct 11', locked: true },
];
const POSTS = [
  { user: 'Marcus T.', num: 'PWR-001', date: 'Oct 12, 2026', body: 'Frame is back from blasting and I am staring at a paint code chart like it owes me money. Truck is a 72 C10, original color was Hugger Orange but the tag is gone. Anyone know where the SPID label hides on these?' },
  { user: 'Dana R.', num: 'PWR-002', date: 'Oct 12, 2026', body: 'Glove box door, inside. If it is gone, the build sheet is sometimes tucked under the seat springs. Hugger Orange is code 72 if you want to go back to stock.' },
  { user: 'Cole B.', num: 'PWR-003', date: 'Oct 13, 2026', body: 'Second the glove box. Mine was under the passenger seat, folded into the springs. Worth the dig.' },
];

async function buildForumIndex(V, name) {
  const page = newPageFrame(name, V, y0);
  topbar(page, V);
  pageHead(page, V, 'The clubhouse bulletin board', 'Forum', 'Talk builds, plan meets, ask the club. Keep it friendly, keep it about cars.');
  const { wrap } = section(page, V, TOK.cream);
  wrap.itemSpacing = 20;
  for (const c of CATS) {
    const card = F(wrap, { name: 'Forum cat / ' + c.name, layout: 'VERTICAL', gap: 12, sizingH: 'FILL', fill: TOK.paper, stroke: TOK.line, radius: 10, padX: 24, padY: 22 });
    const row = F(card, { name: 'Cat row', layout: 'HORIZONTAL', gap: 24, cross: 'CENTER', sizingH: 'FILL' });
    const left = F(row, { name: 'Cat text', layout: 'VERTICAL', gap: 6, sizingH: 'FILL' });
    await T(left, c.name.toUpperCase(), { name: 'Category / ' + c.name, font: 'Bebas Neue', size: 27, color: TOK.ink, spacing: 6, lh: 105 });
    await T(left, c.desc, { size: 15, color: TOK.muted, lh: 150, width: V.mob ? V.wrap - 48 : 700 });
    const stats = F(row, { name: 'Cat stats', layout: 'VERTICAL', gap: 2, cross: 'END' });
    await T(stats, c.threads + ' threads \u00b7 ' + c.posts + ' posts', { size: 14, color: TOK.muted });
    const div = R(card, { name: 'Divider', w: 1, h: 1, fill: TOK.line, sizingH: 'FILL' });
    await T(card, 'Latest: ' + c.latest + ' by ' + c.latestBy, { size: 14, color: TOK.muted, width: V.wrap - 48 });
  }
  await footer(page, V);
  out.frames.push({ id: page.id, name, w: Math.round(page.width), h: Math.round(page.height) });
  return page;
}

async function buildForumCategory(V, name) {
  const page = newPageFrame(name, V, y0);
  topbar(page, V);
  const head = pageHead(page, V, 'Category', 'Builds & Projects', 'Show your build, ask for help, and steal ideas (with credit).');
  const headWrap = head.children[0];
  const back = F(headWrap, { name: 'Back link', layout: 'HORIZONTAL', gap: 0, cross: 'CENTER' });
  await T(back, '\u2190 Forum', { name: 'Link / Back to Forum', size: 16, color: TOK.cream, style: 'SemiBold' });
  headWrap.insertChild(0, back);
  const { wrap } = section(page, V, TOK.cream);
  wrap.itemSpacing = 20;
  const headRow = F(wrap, { name: 'Threads head', layout: 'HORIZONTAL', gap: 0, cross: 'CENTER', sizingH: 'FILL' });
  await T(headRow, 'THREADS', { font: 'Bebas Neue', size: 24, color: TOK.ink, spacing: 6, lh: 102, width: V.wrap - 170 });
  await btn(headRow, 'Start a Thread', 'red');
  for (const t of THREADS) {
    const card = F(wrap, { name: 'Thread row / ' + t.title, layout: 'HORIZONTAL', gap: 24, cross: 'CENTER', sizingH: 'FILL', fill: TOK.paper, stroke: TOK.line, radius: 10, padX: 24, padY: 20 });
    const left = F(card, { name: 'Thread text', layout: 'VERTICAL', gap: 6, sizingH: 'FILL' });
    const titleRow = F(left, { name: 'Thread title row', layout: 'HORIZONTAL', gap: 10, cross: 'CENTER' });
    await T(titleRow, t.title, { name: 'Thread / ' + t.title, font: 'Bebas Neue', size: 22, color: TOK.ink, spacing: 4, lh: 105 });
    if (t.locked) {
      const pill = F(titleRow, { name: 'Locked pill', layout: 'HORIZONTAL', gap: 0, cross: 'CENTER', fill: TOK.dark, radius: 999, padX: 10, padY: 3 });
      await T(pill, 'LOCKED', { font: 'Barlow', style: 'Bold', size: 11, color: TOK.gold, spacing: 14 });
    }
    await T(left, 'by ' + t.by + ' \u00b7 ' + t.date, { size: 14, color: TOK.muted });
    const stats = F(card, { name: 'Thread stats', layout: 'VERTICAL', gap: 2, cross: 'END' });
    await T(stats, t.posts + ' posts', { size: 14, color: TOK.muted });
    await T(stats, 'latest by ' + t.latestBy + ' \u00b7 ' + t.latestDate, { size: 14, color: TOK.muted });
  }
  await footer(page, V);
  out.frames.push({ id: page.id, name, w: Math.round(page.width), h: Math.round(page.height) });
  return page;
}

async function buildForumThread(V, name) {
  const page = newPageFrame(name, V, y0);
  topbar(page, V);
  const head = pageHead(page, V, 'Thread by Marcus T.', 'C10 frame-off resto \u2014 paint code help?', 'Posted Oct 12, 2026 \u00b7 3 posts');
  const headWrap = head.children[0];
  const back = F(headWrap, { name: 'Back link', layout: 'HORIZONTAL', gap: 0, cross: 'CENTER' });
  await T(back, '\u2190 Builds & Projects', { name: 'Link / Back to Builds & Projects', size: 16, color: TOK.cream, style: 'SemiBold' });
  headWrap.insertChild(0, back);
  const narrow = V.mob ? V.wrap : 720;
  const { wrap } = section(page, V, TOK.cream, narrow);
  wrap.itemSpacing = 20;
  for (const p of POSTS) {
    const card = F(wrap, { name: 'Post / ' + p.user, layout: 'VERTICAL', gap: 8, sizingH: 'FILL', fill: TOK.paper, stroke: TOK.line, radius: 8, padX: 18, padY: 16 });
    const chead = F(card, { name: 'Post head', layout: 'HORIZONTAL', gap: 8, cross: 'CENTER', sizingH: 'FILL' });
    await T(chead, p.user, { size: 16, color: TOK.ink, style: 'Bold' });
    await T(chead, p.num, { size: 14, color: TOK.muted });
    await T(chead, p.date, { size: 14, color: TOK.muted });
    await T(card, p.body, { size: 16, color: TOK.ink, lh: 160, width: narrow - 36 });
  }
  const form = F(wrap, { name: 'Reply form', layout: 'VERTICAL', gap: 12, sizingH: 'FILL' });
  const taLabel = F(form, { name: 'Textarea', layout: 'VERTICAL', gap: 6, sizingH: 'FILL' });
  await T(taLabel, 'Reply to this thread', { size: 16, color: TOK.ink, style: 'SemiBold' });
  R(taLabel, { name: 'Reply input', w: narrow, h: 110, fill: TOK.paper, stroke: TOK.line, strokeW: 2, radius: 6, sizingH: 'FILL' });
  await btn(form, 'Post Reply', 'red');
  const loginLine = F(wrap, { name: 'Login line', layout: 'HORIZONTAL', gap: 6, cross: 'CENTER' });
  await T(loginLine, 'Want to join the discussion?', { size: 16, color: TOK.muted });
  await T(loginLine, 'Log in', { name: 'Link / Log in', size: 16, color: TOK.red, style: 'SemiBold' });
  await footer(page, V);
  out.frames.push({ id: page.id, name, w: Math.round(page.width), h: Math.round(page.height) });
  return page;
}
await buildForumIndex(D, '21 — Forum / Desktop');
await buildForumIndex(M, '22 — Forum / Mobile');
await buildForumCategory(D, '23 — Forum Category / Desktop');
await buildForumCategory(M, '24 — Forum Category / Mobile');
await buildForumThread(D, '25 — Forum Thread / Desktop');
await buildForumThread(M, '26 — Forum Thread / Mobile');
return out;
