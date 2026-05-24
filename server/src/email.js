// Nodemailer wrapper. Falls back to console.log when SMTP isn't configured.
const nodemailer = require('nodemailer');

const ACCENT = '#8B3A2A';

function envConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS,
  );
}

let _transporter = null;
function transporter() {
  if (_transporter) return _transporter;
  if (!envConfigured()) return null;
  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return _transporter;
}

function fromAddress() {
  return (
    process.env.SMTP_FROM ||
    `${process.env.RESTAURANT_NAME || 'Restoran'} <${process.env.SMTP_USER}>`
  );
}

function logFallback(label, payload) {
  console.log(`\n[email:${label}] (SMTP not configured — printing instead)`);
  console.log(JSON.stringify(payload, null, 2));
}

async function send({ to, subject, text, html }) {
  const tx = transporter();
  if (!tx) {
    logFallback('skip', { to, subject, text });
    return { skipped: true };
  }
  return tx.sendMail({ from: fromAddress(), to, subject, text, html });
}

function htmlShell(title, bodyInner) {
  return `<!doctype html>
<html lang="bs">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#fbf7f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#2b1d16;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fbf7f3;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #ead9c8;">
        <tr><td style="background:${ACCENT};padding:22px 26px;color:#fff;">
          <div style="font-size:14px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.85;">
            ${escapeHtml(process.env.RESTAURANT_NAME || 'Restoran')}
          </div>
          <div style="font-size:22px;font-weight:700;margin-top:4px;">${escapeHtml(title)}</div>
        </td></tr>
        <tr><td style="padding:26px;">
          ${bodyInner}
        </td></tr>
        <tr><td style="padding:14px 26px;background:#f6ece1;color:#7a5e4d;font-size:12px;">
          ${escapeHtml(process.env.RESTAURANT_NAME || 'Restoran')} ·
          ${escapeHtml(process.env.RESTAURANT_PHONE || '')}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function summaryRows(rows) {
  return rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 0;color:#7a5e4d;font-size:14px;">${escapeHtml(label)}</td>
          <td style="padding:8px 0;color:#2b1d16;font-size:14px;font-weight:600;text-align:right;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join('');
}

async function sendGuestConfirmation({ booking, restaurant }) {
  if (!booking.guest_email) return { skipped: 'no_email' };
  const restName = restaurant.name || process.env.RESTAURANT_NAME || 'Restoran';
  const phone = restaurant.phone || process.env.RESTAURANT_PHONE || '';
  const subject = `Potvrda rezervacije – ${restName}`;
  const body = `
    <p style="margin:0 0 12px 0;font-size:15px;">Poštovani <strong>${escapeHtml(booking.guest_name)}</strong>,</p>
    <p style="margin:0 0 16px 0;font-size:15px;color:#5e4636;">
      Vaša rezervacija je primljena. Veselimo se vašoj posjeti.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ead9c8;border-radius:10px;padding:14px 18px;">
      ${summaryRows([
        ['Datum', booking.date],
        ['Vrijeme', booking.time],
        ['Broj gostiju', String(booking.guests)],
        ['Ime', booking.guest_name],
      ])}
    </table>
    <p style="margin:18px 0 0 0;font-size:13px;color:#7a5e4d;">
      Za otkazivanje ili izmjenu rezervacije, kontaktirajte nas na
      <a href="tel:${escapeHtml(phone)}" style="color:${ACCENT};text-decoration:none;font-weight:600;">${escapeHtml(phone)}</a>.
    </p>
  `;
  const text =
    `Poštovani ${booking.guest_name},\n\n` +
    `Vaša rezervacija u restoranu ${restName} je primljena.\n\n` +
    `Datum: ${booking.date}\nVrijeme: ${booking.time}\nBroj gostiju: ${booking.guests}\n\n` +
    `Za otkazivanje pozovite ${phone}.`;
  return send({
    to: booking.guest_email,
    subject,
    text,
    html: htmlShell('Potvrda rezervacije', body),
  });
}

async function sendAdminNotification({ booking, restaurant }) {
  const adminTo = process.env.ADMIN_EMAIL || restaurant.email;
  if (!adminTo) return { skipped: 'no_admin_email' };
  const restName = restaurant.name || process.env.RESTAURANT_NAME || 'Restoran';
  const subject = `Nova rezervacija – ${booking.guest_name}, ${booking.date} u ${booking.time}`;
  const body = `
    <p style="margin:0 0 12px 0;font-size:15px;">Nova rezervacija u <strong>${escapeHtml(restName)}</strong>:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ead9c8;border-radius:10px;padding:14px 18px;">
      ${summaryRows([
        ['Ime', booking.guest_name],
        ['Telefon', booking.guest_phone],
        ['Email', booking.guest_email || '—'],
        ['Datum', booking.date],
        ['Vrijeme', booking.time],
        ['Broj gostiju', String(booking.guests)],
        ['Napomena', booking.note || '—'],
        ['Status', booking.status || 'pending'],
      ])}
    </table>
  `;
  const text =
    `Nova rezervacija u ${restName}:\n\n` +
    `Ime: ${booking.guest_name}\nTelefon: ${booking.guest_phone}\n` +
    `Email: ${booking.guest_email || '—'}\nDatum: ${booking.date}\n` +
    `Vrijeme: ${booking.time}\nBroj gostiju: ${booking.guests}\n` +
    `Napomena: ${booking.note || '—'}`;
  return send({
    to: adminTo,
    subject,
    text,
    html: htmlShell('Nova rezervacija', body),
  });
}

async function sendBookingEmails({ booking, restaurant }) {
  try {
    await sendGuestConfirmation({ booking, restaurant });
  } catch (e) {
    console.error('[email] guest confirmation failed:', e.message);
  }
  try {
    await sendAdminNotification({ booking, restaurant });
  } catch (e) {
    console.error('[email] admin notification failed:', e.message);
  }
}

async function sendTestEmail() {
  const to = process.env.ADMIN_EMAIL;
  if (!to) return { skipped: 'no_admin_email' };
  return send({
    to,
    subject: 'Test email – restaurant booking',
    text: 'Email pipeline radi. SMTP je ispravno podešen.',
    html: htmlShell(
      'Test email',
      '<p style="margin:0;font-size:15px;">Email pipeline radi. SMTP je ispravno podešen.</p>',
    ),
  });
}

module.exports = {
  envConfigured,
  sendGuestConfirmation,
  sendAdminNotification,
  sendBookingEmails,
  sendTestEmail,
};
