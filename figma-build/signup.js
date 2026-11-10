// 11/12 — Signup (Desktop + Mobile)
const y0 = stackY();
const out = { frames: [] };

async function buildSignup(V, name) {
  const page = newPageFrame(name, V, y0);
  topbar(page, V);
  const narrow = V.mob ? V.wrap : 720;
  const { wrap } = section(page, V, TOK.cream, narrow);
  wrap.itemSpacing = 0;
  await kicker(wrap, 'Claim your number');
  await T(wrap, 'JOIN POWERPACKED', { font: 'Bebas Neue', size: V.title, color: TOK.ink, spacing: 4, lh: 102, width: narrow });
  await T(wrap, 'Sign up free and get your official member number, your garage page, and a spot on the Members Corner wall.', { size: 16, color: TOK.muted, lh: 160, width: narrow });
  const form = F(wrap, { name: 'Signup form', layout: 'VERTICAL', gap: 18, sizingH: 'FILL' });
  await field(form, 'Username', 'Pick a username', V);
  await field(form, 'Email', 'you@example.com', V);
  await field(form, 'Password', 'At least 8 characters', V);
  await field(form, 'Confirm password', 'Type it again', V);
  await btn(form, 'Join Now!', 'big');
  const loginLine = F(wrap, { name: 'Login line', layout: 'HORIZONTAL', gap: 6, cross: 'CENTER' });
  await T(loginLine, 'Already a member?', { size: 16, color: TOK.muted });
  await T(loginLine, 'Log in', { name: 'Link / Log in', size: 16, color: TOK.red, style: 'SemiBold' });
  wrap.itemSpacing = 14;
  await footer(page, V);
  out.frames.push({ id: page.id, name, w: Math.round(page.width), h: Math.round(page.height) });
  return page;
}
await buildSignup(D, '11 — Signup / Desktop');
await buildSignup(M, '12 — Signup / Mobile');
return out;
