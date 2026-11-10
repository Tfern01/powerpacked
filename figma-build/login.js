// 13/14 — Login (Desktop + Mobile)
const y0 = stackY();
const out = { frames: [] };

async function buildLogin(V, name) {
  const page = newPageFrame(name, V, y0);
  topbar(page, V);
  const narrow = V.mob ? V.wrap : 720;
  const { wrap } = section(page, V, TOK.cream, narrow);
  wrap.itemSpacing = 0;
  await kicker(wrap, 'Welcome back');
  await T(wrap, 'LOG IN', { font: 'Bebas Neue', size: V.title, color: TOK.ink, spacing: 4, lh: 102, width: narrow });
  const form = F(wrap, { name: 'Login form', layout: 'VERTICAL', gap: 18, sizingH: 'FILL' });
  await field(form, 'Username or email', 'Username or email', V);
  await field(form, 'Password', 'Your password', V);
  await btn(form, 'Log in', 'big');
  const joinLine = F(wrap, { name: 'Join line', layout: 'HORIZONTAL', gap: 6, cross: 'CENTER' });
  await T(joinLine, 'Not a member yet?', { size: 16, color: TOK.muted });
  await T(joinLine, 'Join Powerpacked', { name: 'Link / Join Powerpacked', size: 16, color: TOK.red, style: 'SemiBold' });
  const resendLine = F(wrap, { name: 'Resend line', layout: 'HORIZONTAL', gap: 6, cross: 'CENTER' });
  await T(resendLine, 'Didn\u2019t get your verification email?', { size: 16, color: TOK.muted });
  await T(resendLine, 'Resend it', { name: 'Link / Resend it', size: 16, color: TOK.red, style: 'SemiBold' });
  wrap.itemSpacing = 14;
  await footer(page, V);
  out.frames.push({ id: page.id, name, w: Math.round(page.width), h: Math.round(page.height) });
  return page;
}
await buildLogin(D, '13 — Login / Desktop');
await buildLogin(M, '14 — Login / Mobile');
return out;
