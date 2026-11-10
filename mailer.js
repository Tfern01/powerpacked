/**
 * Verification emails for Powerpacked.
 * Uses SendGrid when SENDGRID_API_KEY + SENDGRID_FROM are set.
 * Otherwise logs the link (local dev / no service configured) so the
 * verification flow can still be tested end to end.
 */
async function sendVerificationEmail(to, link) {
  const apiKey = process.env.SENDGRID_API_KEY || '';
  const from = process.env.SENDGRID_FROM || '';
  if (!apiKey || !from) {
    console.log(`[mailer] No email service configured — verification link for ${to}: ${link}`);
    return { sent: false, reason: 'no-service' };
  }
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from, name: 'Powerpacked' },
      subject: 'Verify your Powerpacked account',
      content: [
        {
          type: 'text/plain',
          value:
            `Welcome to Powerpacked!\n\nClick the link below to verify your email and activate your account:\n\n${link}\n\nThis link expires in 24 hours. If you didn't sign up, you can ignore this email.`,
        },
        {
          type: 'text/html',
          value:
            `<p>Welcome to Powerpacked!</p><p><a href="${link}">Click here to verify your email and activate your account</a></p><p>This link expires in 24 hours. If you didn't sign up, you can ignore this email.</p>`,
        },
      ],
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error('[mailer] SendGrid error', res.status, body);
    return { sent: false, reason: 'sendgrid-' + res.status };
  }
  return { sent: true };
}

module.exports = { sendVerificationEmail };
