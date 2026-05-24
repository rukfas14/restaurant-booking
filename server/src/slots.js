// Time-slot availability logic.
const db = require('./db');

function toMin(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function fromMin(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function getRestaurant(id) {
  return db
    .prepare(
      'SELECT id, name, opening_time, closing_time, slot_interval, max_per_slot FROM restaurants WHERE id = ?',
    )
    .get(Number(id));
}

function countAtSlot(restaurantId, date, time) {
  const row = db
    .prepare(
      `SELECT COUNT(*) AS n FROM bookings
       WHERE restaurant_id = ? AND date = ? AND time = ?
         AND status NOT IN ('cancelled', 'no_show')`,
    )
    .get(restaurantId, date, time);
  return row ? row.n : 0;
}

// Returns array of { time } for slots that still have room. null if restaurant not found.
function getAvailableSlots(restaurantId, date) {
  const r = getRestaurant(restaurantId);
  if (!r) return null;

  const open = toMin(r.opening_time);
  const close = toMin(r.closing_time);
  const step = r.slot_interval > 0 ? r.slot_interval : 30;
  const last = close - step;

  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);
  const nowMin = today.getHours() * 60 + today.getMinutes();

  const out = [];
  for (let m = open; m <= last; m += step) {
    if (date === todayISO && m <= nowMin) continue;
    const time = fromMin(m);
    const n = countAtSlot(restaurantId, date, time);
    if (n < r.max_per_slot) out.push({ time });
  }
  return out;
}

// canBook returns { ok: bool, reason?: string }
function canBook(restaurantId, date, time) {
  const r = getRestaurant(restaurantId);
  if (!r) return { ok: false, reason: 'restaurant_not_found' };

  // time must be a valid slot inside opening hours
  const t = toMin(time);
  const open = toMin(r.opening_time);
  const close = toMin(r.closing_time);
  if (t < open || t > close - r.slot_interval) {
    return { ok: false, reason: 'outside_hours' };
  }
  if ((t - open) % r.slot_interval !== 0) {
    return { ok: false, reason: 'invalid_slot' };
  }
  const n = countAtSlot(restaurantId, date, time);
  if (n >= r.max_per_slot) return { ok: false, reason: 'slot_full' };
  return { ok: true };
}

module.exports = { getAvailableSlots, canBook, getRestaurant };
