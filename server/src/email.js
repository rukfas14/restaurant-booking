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

// SANDBOX MODE
// Resend's sandbox sender (onboarding@resend.dev) can only deliver to
// addresses verified on your Resend account. Until a real domain is
// verified, route EVERY outgoing email to RESEND_TEST_EMAIL so they
// actually reach the inbox during the demo phase.
const SANDBOX_RECIPIENT =
  process.env.RESEND_TEST_EMAIL || 'rukfas14@icloud.com';

function sandboxRecipient(_intendedRecipient) {
  // _intendedRecipient is the address we'd send to in production.
  // For now everything goes to the sandbox inbox. Returned as a single
  // string so we always send one copy per send.
  return SANDBOX_RECIPIENT;
}

function envConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function logEnvSummary() {
  console.log('[email] Resend env summary:', {
    api_key_set: Boolean(process.env.RESEND_API_KEY),
    from: DEFAULT_FROM,
    sandbox_recipient: SANDBOX_RECIPIENT,
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

function receivedHtml(booking, restaurant) {
  // Sent immediately after the guest submits. Status is still pending —
  // copy reflects that the booking is awaiting staff confirmation.
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#2b1d16">
      <h2 style="color:#8B3A2A;margin:0 0 6px 0">Hvala, ${booking.guest_name}!</h2>
      <p style="margin:0 0 16px 0;color:#5e4636">
        Vaša rezervacija je primljena i čeka potvrdu osoblja.
      </p>
      <div style="background:#fdf3ea;border:1px solid #ead9c8;padding:18px 22px;border-radius:10px;margin:0 0 20px 0">
        <p style="margin:6px 0"><strong>Datum:</strong> ${booking.date}</p>
        <p style="margin:6px 0"><strong>Vrijeme:</strong> ${booking.time}</p>
        <p style="margin:6px 0"><strong>Broj gostiju:</strong> ${booking.guests}</p>
      </div>
      <p style="margin:0 0 16px 0;color:#5e4636">
        Dobit ćete email potvrdu čim osoblje potvrdi vašu rezervaciju.
      </p>
      <p style="margin:0;color:#8B3A2A;font-weight:600">
        ${restaurant.name || 'Restoran'} tim
      </p>
    </div>
  `;
}

function confirmedHtml(booking, restaurant) {
  // Sent when staff flips the booking to "confirmed" in the dashboard.
  // Green accent — celebratory.
  const phone = restaurant.phone || process.env.RESTAURANT_PHONE || '';
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1e3a23">
      <h2 style="color:#2e7d32;margin:0 0 6px 0">Odlično, ${booking.guest_name}!</h2>
      <p style="margin:0 0 16px 0;color:#3b5a44">
        Vaša rezervacija je potvrđena. ✓
      </p>
      <div style="background:#eaf6ec;border:1px solid #c4e3c9;padding:18px 22px;border-radius:10px;margin:0 0 20px 0">
        <p style="margin:6px 0"><strong>Datum:</strong> ${booking.date}</p>
        <p style="margin:6px 0"><strong>Vrijeme:</strong> ${booking.time}</p>
        <p style="margin:6px 0"><strong>Broj gostiju:</strong> ${booking.guests}</p>
      </div>
      <p style="margin:0 0 8px 0;color:#3b5a44">Radujemo se vašem dolasku!</p>
      ${
        phone
          ? `<p style="margin:0 0 16px 0;color:#3b5a44">Za pitanja: <a href="tel:${phone}" style="color:#2e7d32;text-decoration:none;font-weight:600">${phone}</a></p>`
          : ''
      }
      <p style="margin:0;color:#2e7d32;font-weight:600">
        ${restaurant.name || 'Restoran'} tim
      </p>
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
  // Kept for backwards compatibility (was called by the legacy POST /api/bookings
  // path). The new flow uses sendBookingReceivedEmail instead.
  if (!booking.guest_email) {
    console.log('[email] guest has no email — skipping confirmation');
    return { skipped: 'no_email' };
  }
  try {
    return await _send({
      to: sandboxRecipient(booking.guest_email),
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
      to: sandboxRecipient(adminTo),
      subject: `Nova rezervacija – ${booking.guest_name}, ${booking.date} u ${booking.time}`,
      html: adminHtml(booking, restaurant),
      label: 'admin notification',
    });
  } catch (e) {
    logFail('admin notification', e);
    throw e;
  }
}

// --- New flows -----------------------------------------------------------

// Sent immediately after POST /api/bookings: "we got it, awaiting confirmation".
async function sendBookingReceivedEmail({ booking, restaurant }) {
  try {
    return await _send({
      to: sandboxRecipient(booking.guest_email),
      subject: `Rezervacija primljena – ${restaurant.name || 'Restoran'}`,
      html: receivedHtml(booking, restaurant),
      label: 'booking received',
    });
  } catch (e) {
    logFail('booking received', e);
    throw e;
  }
}

// Sent from PATCH /api/bookings/:id when status transitions to 'confirmed'.
async function sendBookingConfirmedEmail({ booking, restaurant }) {
  try {
    return await _send({
      to: sandboxRecipient(booking.guest_email),
      subject: `Rezervacija potvrđena ✓ – ${restaurant.name || 'Restoran'}`,
      html: confirmedHtml(booking, restaurant),
      label: 'booking confirmed',
    });
  } catch (e) {
    logFail('booking confirmed', e);
    throw e;
  }
}

// Fire-and-forget wrapper used by POST /api/bookings. Never throws.
// Sends the "received" email to the guest + a "Nova rezervacija" to admin.
async function sendBookingEmails({ booking, restaurant }) {
  try { await sendBookingReceivedEmail({ booking, restaurant }); } catch (_) {}
  try { await sendAdminNotification({ booking, restaurant }); } catch (_) {}
}

// Throws on failure so /api/test-email can return rich diagnostics.
async function sendTestEmail() {
  if (!envConfigured()) {
    const e = new Error('RESEND_API_KEY not set');
    e.code = 'NO_API_KEY';
    throw e;
  }
  return _send({
    to: sandboxRecipient(process.env.ADMIN_EMAIL),
    subject: 'Test email – Booking sistem radi!',
    html: '<h2>Test email uspješno poslan!</h2><p>Booking sistem je ispravno konfigurisan.</p>',
    label: 'test email',
  });
}

module.exports = {
  envConfigured,
  logEnvSummary,
  sandboxRecipient,
  sendGuestConfirmation,
  sendAdminNotification,
  sendBookingReceivedEmail,
  sendBookingConfirmedEmail,
  sendBookingEmails,
  sendTestEmail,
};
