require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const db = require('./db');
const { requireAuth, loginHandler } = require('./auth');
const { getAvailableSlots, canBook, getRestaurant } = require('./slots');
const {
  sendBookingEmails,
  sendTestEmail,
  envConfigured,
  logEnvSummary,
} = require('./email');

// --- bootstrap: auto-seed on first boot ---
// On a fresh deploy (e.g. Railway with a brand-new volume) the DB is empty.
// Seed it once so the widget and dashboard have data without a manual step.
try {
  const restCount = db.prepare('SELECT COUNT(*) AS n FROM restaurants').get().n;
  if (restCount === 0) {
    console.log('[bootstrap] DB is empty — running initial seed…');
    require('./seed').main();
  }
} catch (e) {
  console.error('[bootstrap] auto-seed failed:', e.message);
}

const app = express();

// --- CORS ---
//
// CLIENT_ORIGIN env can be a comma-separated allowlist, "*", or unset.
//   - Unset / "*"  →  allow ALL origins (public booking widget should embed anywhere)
//   - Otherwise    →  strict allowlist + localhost dev origins
const rawClientOrigin = String(process.env.CLIENT_ORIGIN || '').trim();
const allowAll = rawClientOrigin === '' || rawClientOrigin === '*';
const allowList = new Set(
  [
    ...rawClientOrigin.split(',').map((s) => s.trim()).filter(Boolean).filter((s) => s !== '*'),
    'http://localhost:8080',
    'http://localhost:5173',
  ],
);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // curl, same-origin, server-to-server
      if (allowAll) return cb(null, true);
      if (allowList.has(origin)) return cb(null, true);
      return cb(new Error(`CORS: origin not allowed: ${origin}`));
    },
  }),
);
app.use(express.json());

const VALID_STATUSES = ['pending', 'confirmed', 'cancelled', 'no_show'];

// --- health ---------------------------------------------------------------
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// --- auth -----------------------------------------------------------------
app.post('/api/auth/login', loginHandler);

// --- public: restaurant info + slots --------------------------------------
app.get('/api/restaurants/:id', (req, res) => {
  const id = Number(req.params.id);
  const r = db
    .prepare(
      `SELECT id, name, phone, email, address,
              opening_time, opening_time AS open_time,
              closing_time, closing_time AS close_time,
              slot_interval, slot_interval AS slot_minutes,
              max_per_slot
       FROM restaurants WHERE id = ?`,
    )
    .get(id);
  if (!r) return res.status(404).json({ error: 'not_found' });
  res.json(r);
});

app.get('/api/restaurants/:id/slots', (req, res) => {
  const id = Number(req.params.id);
  const date = String(req.query.date || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'invalid_date' });
  }
  const slots = getAvailableSlots(id, date);
  if (slots === null) return res.status(404).json({ error: 'not_found' });
  res.json({ date, slots });
});

// --- public: create booking ----------------------------------------------
// Widget posts { restaurant_id, name, phone, email, guests, date, time, note }.
// DB stores guest_name / guest_email / guest_phone.
app.post('/api/bookings', (req, res) => {
  const body = req.body || {};
  const restaurant_id = Number(body.restaurant_id);
  const guest_name = String(body.name || body.guest_name || '').trim();
  const guest_phone = String(body.phone || body.guest_phone || '').trim();
  const guest_email_raw = body.email || body.guest_email;
  const guest_email = guest_email_raw
    ? String(guest_email_raw).trim().toLowerCase()
    : null;
  const date = String(body.date || '');
  const time = String(body.time || '');
  const guests = Number(body.guests);
  const note = body.note ? String(body.note).trim() : null;

  if (!restaurant_id || !guest_name || !guest_phone || !date || !time || !guests) {
    return res.status(400).json({ error: 'missing_fields' });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    return res.status(400).json({ error: 'invalid_format' });
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > 10) {
    return res.status(400).json({ error: 'invalid_guests' });
  }
  if (guest_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest_email)) {
    return res.status(400).json({ error: 'invalid_email' });
  }

  const check = canBook(restaurant_id, date, time);
  if (!check.ok) return res.status(409).json({ error: check.reason });

  const info = db
    .prepare(
      `INSERT INTO bookings
       (restaurant_id, guest_name, guest_email, guest_phone, date, time, guests, note, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    )
    .run(restaurant_id, guest_name, guest_email, guest_phone, date, time, guests, note);

  const booking = db
    .prepare('SELECT * FROM bookings WHERE id = ?')
    .get(info.lastInsertRowid);
  const restaurant = getRestaurant(restaurant_id);

  // Fire-and-forget — never block the response on SMTP.
  Promise.resolve()
    .then(() => sendBookingEmails({ booking, restaurant }))
    .catch((e) => console.error('[email] send error:', e.message));

  res.status(201).json(booking);
});

// --- authed: list + update bookings ---------------------------------------
app.get('/api/bookings', requireAuth, (req, res) => {
  const restaurantId = req.user.restaurant_id;
  const status = req.query.status;
  let rows;
  if (status && VALID_STATUSES.includes(String(status))) {
    rows = db
      .prepare(
        `SELECT * FROM bookings
         WHERE restaurant_id = ? AND status = ?
         ORDER BY date DESC, time DESC`,
      )
      .all(restaurantId, status);
  } else {
    rows = db
      .prepare(
        `SELECT * FROM bookings
         WHERE restaurant_id = ?
         ORDER BY date DESC, time DESC`,
      )
      .all(restaurantId);
  }
  res.json(rows);
});

app.patch('/api/bookings/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const body = req.body || {};
  const existing = db
    .prepare('SELECT * FROM bookings WHERE id = ? AND restaurant_id = ?')
    .get(id, req.user.restaurant_id);
  if (!existing) return res.status(404).json({ error: 'not_found' });

  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(String(body.status))) {
      return res.status(400).json({ error: 'invalid_status' });
    }
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(
      String(body.status),
      id,
    );
  }
  if (body.note !== undefined) {
    db.prepare('UPDATE bookings SET note = ? WHERE id = ?').run(
      body.note ? String(body.note) : null,
      id,
    );
  }
  res.json(db.prepare('SELECT * FROM bookings WHERE id = ?').get(id));
});

// --- public: SMTP test ----------------------------------------------------
// Public so it can be hit from a browser / curl on Railway to diagnose
// "emails not arriving" without needing a JWT. Returns full diagnostic info
// (env presence + nodemailer error code/command/response if it fails).
async function handleTestEmail(_req, res) {
  const diagnostics = {
    smtp_configured: envConfigured(),
    env: {
      SMTP_HOST: process.env.SMTP_HOST || null,
      SMTP_PORT: process.env.SMTP_PORT || null,
      SMTP_USER: process.env.SMTP_USER || null,
      SMTP_PASS_set: Boolean(process.env.SMTP_PASS),
      SMTP_FROM: process.env.SMTP_FROM || null,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || null,
    },
  };
  try {
    const r = await sendTestEmail();
    return res.json({ ok: true, ...diagnostics, result: r });
  } catch (e) {
    console.error('[email:test] FAILED', {
      message: e.message,
      code: e.code,
      command: e.command,
      response: e.response,
      responseCode: e.responseCode,
    });
    return res.status(500).json({
      ok: false,
      ...diagnostics,
      error: {
        message: e.message,
        code: e.code,
        command: e.command,
        response: e.response,
        responseCode: e.responseCode,
      },
    });
  }
}
app.get('/api/test-email', handleTestEmail);
app.post('/api/test-email', handleTestEmail);

// --- static: widget + demo ------------------------------------------------
// These live inside server/ so the server is self-contained for deploy
// (Railway uses server/ as its Root Directory).
const serverRoot = path.join(__dirname, '..');
app.use('/widget', express.static(path.join(serverRoot, 'widget')));
app.use('/demo', express.static(path.join(serverRoot, 'demo')));

// --- error handler --------------------------------------------------------
app.use((err, _req, res, _next) => {
  console.error('[error]', err.message);
  if (err.message && err.message.startsWith('CORS:')) {
    return res.status(403).json({ error: 'cors_blocked' });
  }
  res.status(500).json({ error: 'internal_error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Booking API on http://0.0.0.0:${PORT}`);
  console.log(`  SMTP configured: ${envConfigured() ? 'yes' : 'no (falling back to console)'}`);
  logEnvSummary();
});
