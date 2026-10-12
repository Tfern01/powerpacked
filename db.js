/**
 * Database layer for Powerpacked.
 * SQLite via better-sqlite3. All queries are parameterized.
 */
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'powerpacked.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  member_number TEXT NOT NULL UNIQUE,
  profile_pic TEXT,
  bio TEXT DEFAULT '',
  is_admin INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS vehicles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  make TEXT DEFAULT '',
  model TEXT DEFAULT '',
  year TEXT DEFAULT '',
  photo TEXT,
  is_primary INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  location TEXT DEFAULT '',
  event_date TEXT NOT NULL,
  event_time TEXT DEFAULT '',
  image TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price_cents INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

const getMeta = db.prepare('SELECT value FROM meta WHERE key = ?');
const setMeta = db.prepare(
  'INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
);

if (!getMeta.get('member_seq')) {
  setMeta.run('member_seq', '0');
}

/** Assign the next sequential member number (PWR-001, PWR-002, ...) atomically. */
const nextMemberNumber = db.transaction(() => {
  const row = getMeta.get('member_seq');
  const seq = parseInt(row.value, 10) + 1;
  setMeta.run('member_seq', String(seq));
  return 'PWR-' + String(seq).padStart(3, '0');
});

/** Seed the site-owner admin account on first run and record credentials in ADMIN.md. */
function seedAdmin() {
  const existing = db.prepare('SELECT id FROM users WHERE is_admin = 1 LIMIT 1').get();
  if (existing) return;

  const password = crypto.randomBytes(12).toString('hex'); // 24 chars
  const passwordHash = bcrypt.hashSync(password, 10);
  const memberNumber = nextMemberNumber();
  db.prepare(
    `INSERT INTO users (username, email, password_hash, member_number, bio, is_admin)
     VALUES ('admin', 'admin@powerpacked.local', ?, ?, 'Site owner', 1)`
  ).run(passwordHash, memberNumber);

  const adminDoc = `# Powerpacked — Admin Access

The site-owner admin account is seeded automatically on first run.

- **Admin panel:** /admin (sign in first via /login)
- **Username:** \`admin\`
- **Password:** \`${password}\`

Keep this file private. Change the password after your first login
(Account page), and delete or move this file before sharing the project.
`;
  fs.writeFileSync(path.join(__dirname, 'ADMIN.md'), adminDoc);
  console.log('Seeded admin account. Credentials written to ADMIN.md');
}

seedAdmin();

module.exports = { db, nextMemberNumber };
