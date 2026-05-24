// Idempotent seed: one restaurant, one admin user, eight sample bookings.
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

function isoDateOffset(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

const RESTAURANT = {
  name: process.env.RESTAURANT_NAME || 'Restoran Stari Grad',
  phone: process.env.RESTAURANT_PHONE || '+387 33 555 000',
  email: process.env.ADMIN_EMAIL || 'owner@demo.ba',
  address: 'Baščaršija 12, 71000 Sarajevo',
  opening_time: '12:00',
  closing_time: '23:00',
  slot_interval: 30,
  max_per_slot: 3,
};

const ADMIN = {
  email: 'admin@demo.ba',
  password: 'admin123',
};

function upsertRestaurant() {
  const existing = db.prepare('SELECT id FROM restaurants WHERE id = 1').get();
  if (existing) {
    db.prepare(
      `UPDATE restaurants
       SET name = ?, phone = ?, email = ?, address = ?,
           opening_time = ?, closing_time = ?, slot_interval = ?, max_per_slot = ?
       WHERE id = 1`,
    ).run(
      RESTAURANT.name,
      RESTAURANT.phone,
      RESTAURANT.email,
      RESTAURANT.address,
      RESTAURANT.opening_time,
      RESTAURANT.closing_time,
      RESTAURANT.slot_interval,
      RESTAURANT.max_per_slot,
    );
    return 1;
  }
  const info = db
    .prepare(
      `INSERT INTO restaurants
       (id, name, phone, email, address, opening_time, closing_time, slot_interval, max_per_slot)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      RESTAURANT.name,
      RESTAURANT.phone,
      RESTAURANT.email,
      RESTAURANT.address,
      RESTAURANT.opening_time,
      RESTAURANT.closing_time,
      RESTAURANT.slot_interval,
      RESTAURANT.max_per_slot,
    );
  return info.lastInsertRowid;
}

function upsertAdmin(restaurantId) {
  const existing = db
    .prepare('SELECT id FROM users WHERE email = ?')
    .get(ADMIN.email);
  const hash = bcrypt.hashSync(ADMIN.password, 10);
  if (existing) {
    db.prepare('UPDATE users SET password_hash = ?, restaurant_id = ? WHERE id = ?').run(
      hash,
      restaurantId,
      existing.id,
    );
    return existing.id;
  }
  const info = db
    .prepare(
      'INSERT INTO users (restaurant_id, email, password_hash) VALUES (?, ?, ?)',
    )
    .run(restaurantId, ADMIN.email, hash);
  return info.lastInsertRowid;
}

const SAMPLES = [
  // today
  { d: 0, time: '12:30', name: 'Amina Hadžić',           phone: '+387 61 234 567', email: 'amina@example.com',  guests: 2, status: 'confirmed', note: null },
  { d: 0, time: '13:00', name: 'Marko Petrović',         phone: '+387 62 345 678', email: 'marko@example.com',  guests: 4, status: 'confirmed', note: 'Sastanak — molimo tiši stol' },
  { d: 0, time: '19:00', name: 'Sara Ibrahimović',       phone: '+387 63 456 789', email: 'sara@example.com',   guests: 2, status: 'pending',   note: 'Godišnjica — može li svijeća?' },
  { d: 0, time: '20:00', name: 'Luca Romano',            phone: '+39 333 1234567', email: 'luca@example.it',    guests: 2, status: 'no_show',   note: 'Vegetarian' },

  // tomorrow
  { d: 1, time: '13:00', name: 'Nina Kovač',             phone: '+387 61 111 222', email: 'nina@example.com',   guests: 2, status: 'confirmed', note: null },
  { d: 1, time: '19:00', name: 'Tim Buildit',            phone: '+387 62 999 111', email: 'team@example.com',   guests: 8, status: 'confirmed', note: 'Tim večera — račun na firmu' },
  { d: 1, time: '20:30', name: 'James Wilson',           phone: '+44 7700 900123', email: 'james@example.com',  guests: 4, status: 'pending',   note: null },

  // yesterday
  { d: -1, time: '21:00', name: 'Anketni Test',          phone: '+387 61 000 002', email: 'test@example.com',   guests: 2, status: 'cancelled', note: 'Otkazao 2h ranije' },
];

function seedBookings(restaurantId) {
  // Idempotent: wipe and re-insert seed rows for the restaurant.
  db.prepare('DELETE FROM bookings WHERE restaurant_id = ?').run(restaurantId);
  const ins = db.prepare(
    `INSERT INTO bookings
     (restaurant_id, guest_name, guest_email, guest_phone, date, time, guests, note, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  let n = 0;
  for (const s of SAMPLES) {
    ins.run(
      restaurantId,
      s.name,
      s.email,
      s.phone,
      isoDateOffset(s.d),
      s.time,
      s.guests,
      s.note,
      s.status,
    );
    n++;
  }
  return n;
}

function main() {
  const restId = upsertRestaurant();
  const adminId = upsertAdmin(restId);
  const bookingCount = seedBookings(restId);
  console.log(`Seed OK.`);
  console.log(`  Restaurant id=${restId}  name="${RESTAURANT.name}"`);
  console.log(`  Admin       id=${adminId}  email=${ADMIN.email}  password=${ADMIN.password}`);
  console.log(`  Bookings    inserted=${bookingCount}`);
}

if (require.main === module) main();

module.exports = { main };
