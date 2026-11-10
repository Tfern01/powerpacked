// Powerpacked — Landing page (Mobile 390) — native editable Figma frames
const TOK = { cream:'#F4EFE2', paper:'#FAF7EC', ink:'#1B1611', inkSoft:'#3A332B', red:'#C1272D', redDark:'#9C1E23', gold:'#D9A441', muted:'#7C7264', line:'#E2D9C3', dark:'#14100C', dark2:'#221C15', white:'#FFFFFF', creamDim:'#FFE9E4' };
const C = (hex) => { const n = parseInt(hex.slice(1), 16); return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }; };
const solid = (hex, op) => [{ type: 'SOLID', color: C(hex), opacity: op == null ? 1 : op }];

await figma.loadFontAsync({ family: 'Bebas Neue', style: 'Regular' });
await figma.loadFontAsync({ family: 'Barlow', style: 'Regular' });
await figma.loadFontAsync({ family: 'Barlow', style: 'Bold' });
await figma.loadFontAsync({ family: 'Barlow', style: 'SemiBold' });
await figma.loadFontAsync({ family: 'Barlow', style: 'Medium' });

function F(parent, o) {
  const f = figma.createFrame();
  f.name = o.name || 'Frame';
  if (o.fill) f.fills = solid(o.fill, o.fillOp);
  else f.fills = [];
  if (o.w != null) f.resize(o.w, o.h != null ? o.h : 10);
  else if (o.h != null) f.resize(10, o.h);
  if (o.layout) {
    f.layoutMode = o.layout;
    f.primaryAxisSizingMode = o.primary || 'AUTO';
    f.counterAxisSizingMode = o.counter || (o.layout === 'HORIZONTAL' ? 'AUTO' : 'FIXED');
  }
  if (o.gap != null) f.itemSpacing = o.gap;
  if (o.pad != null) { f.paddingTop = f.paddingBottom = f.paddingLeft = f.paddingRight = o.pad; }
  if (o.padX != null) { f.paddingLeft = f.paddingRight = o.padX; }
  if (o.padY != null) { f.paddingTop = f.paddingBottom = o.padY; }
  if (o.radius != null) f.cornerRadius = o.radius;
  if (o.stroke) { f.strokes = solid(o.stroke); f.strokeWeight = o.strokeW || 1; }
  if (o.align) f.primaryAxisAlignItems = o.align;
  if (o.cross) f.counterAxisAlignItems = o.cross;
  if (o.clips != null) f.clipsContent = o.clips;
  if (parent) parent.appendChild(f);
  if (o.x != null) f.x = o.x;
  if (o.y != null) f.y = o.y;
  if (o.sizingH) f.layoutSizingHorizontal = o.sizingH;
  if (o.sizingV) f.layoutSizingVertical = o.sizingV;
  if (o.layoutAlign) f.layoutAlign = o.layoutAlign;
  return f;
}
function R(parent, o) {
  const r = figma.createRectangle();
  r.name = o.name || 'Rect';
  r.fills = o.fill ? solid(o.fill, o.fillOp) : [];
  if (o.stroke) { r.strokes = solid(o.stroke); r.strokeWeight = o.strokeW || 1; }
  r.resize(o.w || 10, o.h || 10);
  if (o.radius != null) r.cornerRadius = o.radius;
  if (o.x != null) r.x = o.x;
  if (o.y != null) r.y = o.y;
  if (o.rot != null) r.rotation = o.rot;
  if (o.abs) r.layoutPositioning = 'ABSOLUTE';
  if (parent) parent.appendChild(r);
  if (o.sizingH) r.layoutSizingHorizontal = o.sizingH;
  return r;
}
async function T(parent, str, o) {
  const t = figma.createText();
  t.name = o.name || str.slice(0, 24);
  const fam = o.font || 'Barlow';
  const sty = o.style || 'Regular';
  await figma.loadFontAsync({ family: fam, style: sty });
  t.fontName = { family: fam, style: sty };
  t.characters = str;
  t.fontSize = o.size || 16;
  t.fills = solid(o.color || TOK.ink, o.fillOp);
  if (o.spacing != null) t.letterSpacing = { unit: 'PERCENT', value: o.spacing };
  if (o.lh != null) t.lineHeight = { unit: 'PERCENT', value: o.lh };
  if (o.align) t.textAlignHorizontal = o.align;
  if (o.width != null) { t.resize(o.width, 10); t.textAutoResize = 'HEIGHT'; }
  if (o.abs) { t.layoutPositioning = 'ABSOLUTE'; if (o.x != null) t.x = o.x; if (o.y != null) t.y = o.y; }
  parent.appendChild(t);
  if (o.sizingH) t.layoutSizingHorizontal = o.sizingH;
  return t;
}
async function btn(parent, label, kind) {
  const b = F(parent, { name: 'Button / ' + label, layout: 'HORIZONTAL', gap: 8, cross: 'CENTER', radius: kind === 'huge' ? 10 : 6, padY: kind === 'huge' ? 16 : kind === 'big' ? 14 : 9, padX: kind === 'huge' ? 51 : kind === 'big' ? 35 : 19 });
  if (kind === 'red' || kind === 'big') b.fills = solid(TOK.red);
  else if (kind === 'cream' || kind === 'huge') b.fills = solid(TOK.cream);
  else if (kind === 'ghost') { b.fills = []; b.strokes = solid(TOK.cream, 0.7); b.strokeWeight = 2; }
  else if (kind === 'outline') { b.fills = []; b.strokes = solid(TOK.ink); b.strokeWeight = 2; }
  const size = kind === 'huge' ? 32 : kind === 'big' ? 24 : kind === 'red' ? 20 : 17;
  const col = (kind === 'red' || kind === 'big') ? TOK.white : (kind === 'cream' || kind === 'huge') ? TOK.ink : kind === 'ghost' ? TOK.cream : TOK.ink;
  await T(b, label.toUpperCase(), { font: 'Bebas Neue', size, color: col, spacing: 12, lh: 100 });
  return b;
}
function kicker(parent, str) { return T(parent, str.toUpperCase(), { font: 'Barlow', style: 'Bold', size: 13, color: TOK.red, spacing: 28, lh: 130 }); }
function sectionTitle(parent, str) { return T(parent, str.toUpperCase(), { font: 'Bebas Neue', size: 30, color: TOK.ink, spacing: 4, lh: 102 }); }

const W = 390;
const page = F(figma.currentPage, { name: '02 — Landing / Mobile', layout: 'VERTICAL', gap: 0, w: W, counter: 'FIXED', primary: 'AUTO', x: 1560, y: 0 });
page.fills = solid(TOK.cream);

// ---- topbar ----
const topbar = F(page, { name: 'Topbar', layout: 'VERTICAL', gap: 0, sizingH: 'FILL', fill: TOK.dark, cross: 'CENTER' });
const topRow = F(topbar, { name: 'Topbar inner', layout: 'HORIZONTAL', gap: 0, cross: 'CENTER', w: W, primary: 'FIXED', counter: 'AUTO', padX: 16, padY: 9 });
const leftBox = F(topRow, { name: 'Left', layout: 'HORIZONTAL', gap: 0, cross: 'CENTER', w: 46, primary: 'FIXED' });
const ham = F(leftBox, { name: 'Hamburger', layout: 'VERTICAL', gap: 6, cross: 'CENTER', align: 'CENTER', w: 44, h: 44 });
R(ham, { name: 'bar', w: 26, h: 2.5, fill: TOK.cream, radius: 1.25 });
R(ham, { name: 'bar', w: 26, h: 2.5, fill: TOK.cream, radius: 1.25 });
R(ham, { name: 'bar', w: 26, h: 2.5, fill: TOK.cream, radius: 1.25 });
const logoRect = R(topRow, { name: 'Logo (upload logo.png here)', w: 220, h: 25, fill: TOK.dark2 });
const rightBox = F(topRow, { name: 'Right', layout: 'HORIZONTAL', gap: 4, cross: 'CENTER', align: 'MAX', w: 92, primary: 'FIXED' });
const searchIc = F(rightBox, { name: 'Search icon', w: 44, h: 44 });
const sCircle = figma.createEllipse(); sCircle.name = 'lens'; sCircle.resize(14, 14); sCircle.x = 12; sCircle.y = 12; sCircle.fills = []; sCircle.strokes = solid(TOK.cream); sCircle.strokeWeight = 2.2; searchIc.appendChild(sCircle);
R(searchIc, { name: 'handle', w: 2.2, h: 8, fill: TOK.cream, x: 24.5, y: 24, rot: 45 });
const acctIc = F(rightBox, { name: 'Account icon', w: 44, h: 44 });
const aHead = figma.createEllipse(); aHead.name = 'head'; aHead.resize(9, 9); aHead.x = 17.5; aHead.y = 12; aHead.fills = []; aHead.strokes = solid(TOK.cream); aHead.strokeWeight = 2.2; acctIc.appendChild(aHead);
const aBody = figma.createRectangle(); aBody.name = 'shoulders'; aBody.resize(19, 11); aBody.x = 12.5; aBody.y = 24; aBody.fills = []; aBody.strokes = solid(TOK.cream); aBody.strokeWeight = 2.2; aBody.topLeftRadius = 9; aBody.topRightRadius = 9; aBody.bottomLeftRadius = 0; aBody.bottomRightRadius = 0; acctIc.appendChild(aBody);
R(topbar, { name: 'Red rule', w: W, h: 3, fill: TOK.red, sizingH: 'FILL' });

// ---- hero ----
const hero = F(page, { name: 'Hero', w: W, h: 640, sizingH: 'FILL', fill: TOK.dark, clips: true });
const heroImg = R(hero, { name: 'Hero image (upload hero.jpg here)', w: W, h: 640, fill: TOK.dark2, x: 0, y: 0 });
const heroShade = R(hero, { name: 'Overlay', w: W, h: 640, fill: '#0A0806', fillOp: 0.45, x: 0, y: 0 });
const heroContent = F(hero, { name: 'Hero content', layout: 'VERTICAL', gap: 28, x: 20, y: 150, w: 350 });
await T(heroContent, 'DRIVEN BY\nDIFFERENCE', { font: 'Bebas Neue', size: 58, color: TOK.cream, spacing: 4, lh: 100 });
const heroCtas = F(heroContent, { name: 'Hero CTAs', layout: 'HORIZONTAL', gap: 12, cross: 'CENTER' });
await btn(heroCtas, 'Join Now', 'big');
await btn(heroCtas, 'See the Rides', 'ghost');
heroContent.y = Math.round((640 - heroContent.height) / 2);

// ---- about teaser ----
const teaser = F(page, { name: 'About teaser', layout: 'VERTICAL', gap: 0, sizingH: 'FILL', padY: 45, cross: 'CENTER', fill: TOK.cream });
const teaserInner = F(teaser, { name: 'Teaser inner', layout: 'VERTICAL', gap: 0, cross: 'CENTER', w: 350 });
await kicker(teaserInner, 'One community');
await T(teaserInner, 'DIFFERENT CARS. DIFFERENT PEOPLE.', { font: 'Bebas Neue', size: 30, color: TOK.ink, spacing: 4, lh: 102, align: 'CENTER', width: 350 });
await T(teaserInner, 'Powerpacked unites every subsect of car culture under one roof. No gatekeeping, just people who love what moves.', { size: 16, color: TOK.muted, align: 'CENTER', width: 330, lh: 160 });
const teaserBtnWrap = F(teaserInner, { name: 'Teaser CTA', layout: 'HORIZONTAL', gap: 0, cross: 'CENTER' });
await btn(teaserBtnWrap, 'Our Story', 'outline');
teaserInner.itemSpacing = 14;

// ---- events preview ----
const events = F(page, { name: 'Events preview', layout: 'VERTICAL', gap: 0, sizingH: 'FILL', padY: 45, fill: TOK.paper, cross: 'CENTER' });
const evWrap = F(events, { name: 'Wrap 350', layout: 'VERTICAL', gap: 20, w: 350, layoutAlign: 'CENTER' });
const evHead = F(evWrap, { name: 'Section head', layout: 'VERTICAL', gap: 14, sizingH: 'FILL' });
const evHeadL = F(evHead, { name: 'Head left', layout: 'VERTICAL', gap: 6, sizingH: 'FILL' });
await kicker(evHeadL, 'Mark the calendar');
await sectionTitle(evHeadL, 'Upcoming Events');
await btn(evHead, 'All Events', 'outline');
const evCards = F(evWrap, { name: 'Event cards', layout: 'VERTICAL', gap: 16, sizingH: 'FILL' });
const evData = [
  { d: '13', m: 'OCT', title: 'Burger King Cruise Night', loc: 'Longview, TX' },
  { d: '17', m: 'OCT', title: 'Best of Both Worlds Auto & Cycle Show', loc: 'Hawkins, TX' },
  { d: '17', m: 'OCT', title: 'Pin Ups & Pistons', loc: 'Longview, TX' },
];
for (const e of evData) {
  const card = F(evCards, { name: 'Event card / ' + e.title, layout: 'VERTICAL', gap: 6, sizingH: 'FILL', fill: TOK.paper, stroke: TOK.line, radius: 10, padX: 22, padY: 19 });
  card.paddingLeft = 83;
  const badge = F(card, { name: 'Date badge', layout: 'VERTICAL', gap: 0, cross: 'CENTER', align: 'CENTER', w: 54, padY: 6, fill: TOK.red, radius: 8 });
  badge.layoutPositioning = 'ABSOLUTE'; badge.x = 18; badge.y = 19;
  await T(badge, e.d, { font: 'Bebas Neue', size: 27, color: TOK.white, lh: 100, align: 'CENTER' });
  await T(badge, e.m, { font: 'Barlow', style: 'Bold', size: 11, color: TOK.white, spacing: 12, align: 'CENTER' });
  await T(card, e.title.toUpperCase(), { font: 'Bebas Neue', size: 26, color: TOK.ink, spacing: 6, lh: 105, width: 225 });
  await T(card, e.loc, { size: 16, color: TOK.muted, lh: 150 });
}

// ---- members corner ----
const corner = F(page, { name: 'Members Corner', layout: 'VERTICAL', gap: 0, sizingH: 'FILL', padY: 45, fill: TOK.cream, cross: 'CENTER' });
const coWrap = F(corner, { name: 'Wrap 350', layout: 'VERTICAL', gap: 20, w: 350, layoutAlign: 'CENTER' });
const coHead = F(coWrap, { name: 'Section head', layout: 'VERTICAL', gap: 14, sizingH: 'FILL' });
const coHeadL = F(coHead, { name: 'Head left', layout: 'VERTICAL', gap: 6, sizingH: 'FILL' });
await kicker(coHeadL, 'The clubhouse wall');
await sectionTitle(coHeadL, 'Members Corner');
await btn(coHead, 'Full Gallery', 'outline');
const carousel = F(coWrap, { name: 'Carousel', w: 350, h: 263, sizingH: 'FILL', fill: TOK.dark, radius: 12, stroke: TOK.line, clips: true });
const carImg = R(carousel, { name: 'Carousel image (upload placeholder-1.jpg here)', w: 350, h: 263, fill: TOK.dark2, x: 0, y: 0 });
const capBand = R(carousel, { name: 'Caption band', w: 350, h: 80, fill: '#0A0806', fillOp: 0.75, x: 0, y: 183 });
const capRow = F(carousel, { name: 'Caption', layout: 'HORIZONTAL', gap: 10, cross: 'CENTER', x: 16, y: 216 });
await T(capRow, 'MARCUS T.', { font: 'Bebas Neue', size: 22, color: TOK.cream, spacing: 8 });
await T(capRow, 'PWR-001', { font: 'Barlow', style: 'Bold', size: 12, color: TOK.gold, spacing: 20 });
const dots = F(carousel, { name: 'Dots', layout: 'HORIZONTAL', gap: 7, cross: 'CENTER', x: 350 - 16 - 47, y: 263 - 12 - 11 });
const d1 = figma.createEllipse(); d1.name = 'dot active'; d1.resize(11, 11); d1.fills = solid(TOK.red); dots.appendChild(d1);
for (let i = 0; i < 2; i++) { const d = figma.createEllipse(); d.name = 'dot'; d.resize(11, 11); d.fills = []; d.strokes = solid(TOK.cream); d.strokeWeight = 2; dots.appendChild(d); }

// ---- CTA band ----
const cta = F(page, { name: 'CTA band', layout: 'VERTICAL', gap: 0, sizingH: 'FILL', padY: 56, cross: 'CENTER', fill: TOK.red });
await T(cta, "GOT A RIDE? YOU'RE ONE OF US.", { font: 'Bebas Neue', size: 38, color: TOK.white, spacing: 4, lh: 102, align: 'CENTER', width: 350 });
await T(cta, 'Classic muscle, exotic, truck, bike, side-by-side, EV, if it moves, it belongs. Claim your member number today.', { size: 17, color: TOK.creamDim, align: 'CENTER', width: 330, lh: 150 });
const ctaBtnWrap = F(cta, { name: 'CTA button', layout: 'HORIZONTAL', gap: 0, cross: 'CENTER' });
await btn(ctaBtnWrap, 'Join Now!', 'huge');
cta.itemSpacing = 16;

// ---- footer ----
const footer = F(page, { name: 'Footer', layout: 'VERTICAL', gap: 0, sizingH: 'FILL', padY: 40, cross: 'CENTER', fill: TOK.dark });
const fBrand = F(footer, { name: 'Footer brand', layout: 'HORIZONTAL', gap: 12, cross: 'CENTER' });
await T(fBrand, 'POWERPACKED', { font: 'Bebas Neue', size: 28, color: TOK.cream, spacing: 20 });
await T(fBrand, 'DRIVEN BY DIFFERENCE', { font: 'Bebas Neue', size: 13, color: TOK.gold, spacing: 20 });
await T(footer, 'One community for every kind of car culture. Power. Mobility. Freedom.', { size: 15, color: '#A89E8B', align: 'CENTER', width: 330, lh: 160 });
const fNav = F(footer, { name: 'Footer nav', layout: 'HORIZONTAL', gap: 18, cross: 'CENTER', w: 350, primary: 'FIXED', counter: 'AUTO', align: 'CENTER' });
fNav.layoutWrap = 'WRAP';
for (const l of ['Home', 'About', 'Events', 'Members Corner', 'Forum', 'Shop', 'Contact', 'Join']) {
  await T(fNav, l, { font: 'Barlow', style: 'SemiBold', size: 15, color: TOK.cream });
}
await T(footer, '© 2026 Powerpacked Car Club. All rights reserved.', { size: 13, color: '#6F6656', align: 'CENTER', width: 330, lh: 150 });
footer.itemSpacing = 16;

return { pageId: page.id, pageName: page.name, width: page.width, height: Math.round(page.height), imageSlots: { logo: logoRect.id, hero: heroImg.id, carousel: carImg.id }, children: page.children.map(c => ({ id: c.id, name: c.name, h: Math.round(c.height) })) };
