// Email sending via Resend (https://resend.com).
// Replaces the old Nodemailer/Gmail SMTP path — Railway blocks outbound SMTP,
// so an HTTPS-based provider is required in production.
//
// Public surface preserved so callers in index.js don't need to change:
//   envConfigured()                              -> bool
//   logEnvSummary()                              -> side-effect log
//   sendGuestConfirmation({ booking, restaurant })
//   sendAdminNotification({ booking, restaurant })
//   sendBookingEmails({ booking, restaurant })   -> never throws
//   sendTestEmail()                              -> resend response | throws

const { Resend } = require('resend');

let _client = null;
function client() {
  if (_client) return _client;
  if (!process.env.RESEND_API_KEY) return null;
  _client = new Resend(process.env.RESEND_API_KEY);
  return _client;
}

const DEFAULT_FROM = process.env.RESEND_FROM || 'Booking <onboarding@resend.dev>';

function envConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function logEnvSummary() {
  console.log('[email] Resend env summary:', {
    api_key_set: Boolean(process.env.RESEND_API_KEY),
    from: DEFAULT_FROM,
    admin: process.env.ADMIN_EMAIL || null,
    restaurant_name: process.env.RESTAURANT_NAME || null,
  });
}

function logFail(label, e) {
  // Resend returns { error: { message, name, statusCode } } on .send() errors.
  // Network/SDK errors throw with a plain message. Log both shapes.
  console.error(`[email] ${label} FAILED`, {
    message: e?.message || e?.error?.message || String(e),
    name: e?.name || e?.error?.name,
    statusCode: e?.statusCode || e?.error?.statusCode,
  });
}

async function _send({ to, subject, html, label }) {
  const c = client();
  if (!c) {
    console.log(`[email] RESEND_API_KEY not set — skipping ${label} to ${to}`);
    return { skipped: true };
  }
  console.log(`[email] -> ${to}  subject="${subject}"  from="${DEFAULT_FROM}"`);
  // resend.emails.send returns { data, error } — it does NOT throw on API errors.
  const { data, error } = await c.emails.send({
    from: DEFAULT_FROM,
    to,
    subject,
    html,
  });
  if (error) {
    const e = new Error(error.message || 'resend_error');
    e.statusCode = error.statusCode;
    e.name = error.name;
    throw e;
  }
  console.log(`[email] OK   id=${data?.id}`);
  return data;
}

// ----- Templates ----------------------------------------------------------

function guestHtml(booking, restaurant) {
  return `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
      <h2 style="color:#8B3A2A">Hvala na rezervaciji, ${booking.guest_name}!</h2>
      <div style="background:#f9f5f0;padding:20px;border-radius:8px;margin:20px 0">
        <p><strong>Datum:</strong> ${booking.date}</p>
        <p><strong>Vrijeme:</strong> ${booking.time}</p>
        <p><strong>Broj gostiju:</strong> ${booking.guests}</p>
        <p><strong>Ime:</strong> ${booking.guest_name}</p>
      </div>
      <p>Ako trebate otkazati, kontaktirajte nas na ${restaurant.phone || ''}</p>
      <p style="color:#8B3A2A"><strong>${restaurant.name || ''}</strong></p>
    </div>
  `;
}

function adminHtml(booking, _restaurant) {
  return `
    <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
      <h2 style="color:#8B3A2A">Nova rezervacija</h2>
      <div style="background:#f9f5f0;padding:20px;border-radius:8px">
        <p><strong>Gost:</strong> ${booking.guest_name}</p>
        <p><strong>Telefon:</strong> ${booking.guest_phone}</p>
        <p><strong>Email:</strong> ${booking.guest_email || '—'}</p>
        <p><strong>Datum:</strong> ${booking.date}</p>
        <p><strong>Vrijeme:</strong> ${booking.time}</p>
        <p><strong>Gostiju:</strong> ${booking.guests}</p>
        <p><strong>Napomena:</strong> ${booking.note || '—'}</p>
      </div>
    </div>
  `;
}

// ----- Per-recipient sends -----------------------------------------------

async function sendGuestConfirmation({ booking, restaurant }) {
  if (!booking.guest_email) {
    console.log('[email] guest has no email — skipping confirmation');
    return { skipped: 'no_email' };
  }
  try {
    return await _send({
      to: booking.guest_email,
      subject: `Potvrda rezervacije – ${restaurant.name || 'Restoran'}`,
      html: guestHtml(booking, restaurant),
      label: 'guest confirmation',
    });
  } catch (e) {
    logFail('guest confirmation', e);
    throw e;
  }
}

async function sendAdminNotification({ booking, restaurant }) {
  const adminTo = process.env.ADMIN_EMAIL || restaurant.email;
  if (!adminTo) {
    console.log('[email] no ADMIN_EMAIL — skipping admin notification');
    return { skipped: 'no_admin_email' };
  }
  try {
    return await _send({
      to: adminTo,
      subject: `Nova rezervacija – ${booking.guest_name}, ${booking.date} u ${booking.time}`,
      html: adminHtml(booking, restaurant),
      label: 'admin notification',
    });
  } catch (e) {
    logFail('admin notification', e);
    throw e;
  }
}

// Fire-and-forget wrapper: never throws, only logs.
async function sendBookingEmails({ booking, restaurant }) {
  try { await sendGuestConfirmation({ booking, restaurant }); } catch (_) {}
  try { await sendAdminNotification({ booking, restaurant }); } catch (_) {}
}

// Throws on failure so /api/test-email can return rich diagnostics.
async function sendTestEmail() {
  if (!envConfigured()) {
    const e = new Error('RESEND_API_KEY not set');
    e.code = 'NO_API_KEY';
    throw e;
  }
  const adminTo = process.env.ADMIN_EMAIL;
  if (!adminTo) {
    const e = new Error('ADMIN_EMAIL not set');
    e.code = 'NO_ADMIN_EMAIL';
    throw e;
  }
  return _send({
    to: adminTo,
    subject: 'Test email – Booking sistem radi!',
    html: '<h2>Test email uspješno poslan!</h2><p>Booking sistem je ispravno konfigurisan.</p>',
    label: 'test email',
  });
}

module.exports = {
  envConfigured,
  logEnvSummary,
  sendGuestConfirmation,
  sendAdminNotification,
  sendBookingEmails,
  sendTestEmail,
};
