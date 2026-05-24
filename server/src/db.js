// SQLite setup + schema. Synchronous via better-sqlite3.
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'booking.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS restaurants (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    name            TEXT NOT NULL,
    phone           TEXT,
    email           TEXT,
    address         TEXT,
    opening_time    TEXT NOT NULL DEFAULT '12:00',
    closing_time    TEXT NOT NULL DEFAULT '23:00',
    slot_interval   INTEGER NOT NULL DEFAULT 30,
    max_per_slot    INTEGER NOT NULL DEFAULT 3
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id   INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    guest_name      TEXT NOT NULL,
    guest_email     TEXT,
    guest_phone     TEXT NOT NULL,
    date            TEXT NOT NULL,            -- YYYY-MM-DD
    time            TEXT NOT NULL,            -- HH:MM
    guests          INTEGER NOT NULL,
    note            TEXT,
    status          TEXT NOT NULL DEFAULT 'pending',
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_bookings_restaurant_date
    ON bookings(restaurant_id, date);

  CREATE TABLE IF NOT EXISTS users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id   INTEGER NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    email           TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL
  );
`);

module.exports = db;
