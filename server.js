/**
 * Powerpacked — car club web app.
 * Node.js + Express + SQLite. Server-rendered with EJS.
 *
 * Run:  npm install && npm start
 * Env:  PORT (default 3000), SESSION_SECRET, DB_PATH
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const session = require('express-session');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const { db, nextMemberNumber } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------------- uploads ---------------- */
const uploadDir = path.join(__dirname, 'public', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
    cb(null, Date.now() + '-' + crypto.randomBytes(6).toString('hex') + (ext || '.jpg'));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|gif|webp)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only image uploads are allowed (jpg, png, gif, webp).'));
  },
});

/* ---------------- app setup ---------------- */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));

/* ---------------- preview lock (site-wide password gate) ---------------- */
// Set PREVIEW_PASSWORD env var to lock the whole site behind a password.
// Leave it unset for normal open access (local development).
const PREVIEW_PASSWORD = process.env.PREVIEW_PASSWORD || '';
const previewToken = (pw) => crypto.createHash('sha256').update('pp-preview:' + pw).digest('hex');
const getCookie = (req, name) => {
  const m = ('; ' + (req.headers.cookie || '')).match(new RegExp(';\\s*' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : '';
};

app.use((req, res, next) => {
  if (!PREVIEW_PASSWORD) return next();
  if (req.path === '/preview-lock') return next();
  if (getCookie(req, 'pp_preview') === previewToken(PREVIEW_PASSWORD)) return next();
  res.redirect('/preview-lock?next=' + encodeURIComponent(req.originalUrl));
});

app.get('/preview-lock', (req, res) => {
  const err = req.query.error
    ? '<p style="color:#c0392b;font-weight:600">Wrong password, try again.</p>'
    : '';
  const next = String(req.query.next || '/');
  res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Powerpacked — Private Preview</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#141210;color:#f3ead8;font-family:Georgia,serif}
.card{background:#1e1a16;border:1px solid #3a332b;border-radius:12px;padding:2.5rem 2rem;max-width:380px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.badge{display:inline-block;border:2px solid #c8402a;border-radius:50%;width:74px;height:74px;line-height:70px;font-size:1.6rem;font-weight:700;color:#c8402a;margin-bottom:1rem}
h1{font-size:1.4rem;margin:.4rem 0 .2rem;letter-spacing:.06em}
p.sub{color:#b9ac93;font-size:.9rem;margin:0 0 1.4rem}
input{width:100%;box-sizing:border-box;padding:.8rem;font-size:1rem;border-radius:8px;border:1px solid #3a332b;background:#141210;color:#f3ead8;margin-bottom:1rem}
button{width:100%;padding:.85rem;font-size:1.05rem;font-weight:700;letter-spacing:.08em;border:none;border-radius:8px;background:#c8402a;color:#fff;cursor:pointer}
button:hover{background:#a93222}</style></head><body>
<div class="card"><div class="badge">PP</div><h1>PRIVATE PREVIEW</h1>
<p class="sub">Powerpacked is still in the garage.<br>Enter the preview password to take a look.</p>
${err}<form method="post" action="/preview-lock">
<input type="hidden" name="next" value="${next.replace(/"/g, '&quot;')}">
<input type="password" name="password" placeholder="Preview password" autofocus required>
<button type="submit">UNLOCK</button></form></div></body></html>`);
});

app.post('/preview-lock', (req, res) => {
  const next = String(req.body.next || '/');
  const dest = next.startsWith('/') ? next : '/';
  if (PREVIEW_PASSWORD && req.body.password === PREVIEW_PASSWORD) {
    res.setHeader(
      'Set-Cookie',
      `pp_preview=${previewToken(PREVIEW_PASSWORD)}; Path=/; HttpOnly; Max-Age=2592000; SameSite=Lax`
    );
    return res.redirect(dest);
  }
  res.redirect('/preview-lock?error=1&next=' + encodeURIComponent(dest));
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'powerpacked-dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
);

// Current user available in every view.
app.use((req, res, next) => {
  res.locals.currentUser = null;
  if (req.session.userId) {
    res.locals.currentUser =
      db.prepare('SELECT id, username, member_number, profile_pic, is_admin FROM users WHERE id = ?').get(req.session.userId) || null;
    if (!res.locals.currentUser) delete req.session.userId;
  }
  next();
});

const requireLogin = (req, res, next) => {
  if (!req.session.userId) return res.redirect('/login?next=' + encodeURIComponent(req.originalUrl));
  next();
};
const requireAdmin = (req, res, next) => {
  const u = res.locals.currentUser;
  if (!u || !u.is_admin) return res.status(403).render('403', { title: 'Not allowed' });
  next();
};

const esc = (s) => String(s ?? '');
const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

/* ---------------- public pages ---------------- */

app.get('/', (req, res) => {
  const upcoming = db
    .prepare(`SELECT * FROM events WHERE date(event_date) >= date('now') ORDER BY event_date ASC, event_time ASC LIMIT 3`)
    .all();
  const corner = db
    .prepare(`
      SELECT u.username, u.member_number,
             COALESCE(
               (SELECT v.photo FROM vehicles v WHERE v.user_id = u.id AND v.is_primary = 1 AND v.photo IS NOT NULL LIMIT 1),
               u.profile_pic
             ) AS photo,
             COALESCE(
               (SELECT v.name FROM vehicles v WHERE v.user_id = u.id AND v.is_primary = 1 LIMIT 1),
               ''
             ) AS ride_name
      FROM users u
      WHERE u.is_admin = 0
        AND (u.profile_pic IS NOT NULL
             OR EXISTS (SELECT 1 FROM vehicles v WHERE v.user_id = u.id AND v.photo IS NOT NULL))
      ORDER BY u.created_at DESC
      LIMIT 8`)
    .all();
  res.render('index', { title: 'Powerpacked — Driven by Difference', upcoming, corner });
});

app.get('/events', (req, res) => {
  const upcoming = db
    .prepare(`SELECT * FROM events WHERE date(event_date) >= date('now') ORDER BY event_date ASC, event_time ASC`)
    .all();
  const past = db
    .prepare(`SELECT * FROM events WHERE date(event_date) < date('now') ORDER BY event_date DESC LIMIT 12`)
    .all();
  res.render('events', { title: 'Events — Powerpacked', upcoming, past });
});

app.get('/gallery', (req, res) => {
  const members = db
    .prepare(`
      SELECT u.id, u.username, u.member_number, u.profile_pic,
             (SELECT v.photo FROM vehicles v WHERE v.user_id = u.id AND v.is_primary = 1 AND v.photo IS NOT NULL LIMIT 1) AS primary_photo,
             (SELECT v.name  FROM vehicles v WHERE v.user_id = u.id AND v.is_primary = 1 LIMIT 1) AS ride_name
      FROM users u
      WHERE u.is_admin = 0
      ORDER BY u.created_at DESC`)
    .all()
    .map((m) => ({ ...m, display_photo: m.primary_photo || m.profile_pic }));
  res.render('gallery', { title: 'Members Corner — Powerpacked', members });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About — Powerpacked' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact — Powerpacked', sent: false, error: null, values: {} });
});

app.post('/contact', (req, res) => {
  const name = (req.body.name || '').trim().slice(0, 80);
  const email = (req.body.email || '').trim().slice(0, 120);
  const subject = (req.body.subject || '').trim().slice(0, 120);
  const message = (req.body.message || '').trim().slice(0, 2000);
  const values = { name, email, subject, message };
  if (!name) return res.render('contact', { title: 'Contact — Powerpacked', sent: false, error: 'Please tell us your name.', values });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return res.render('contact', { title: 'Contact — Powerpacked', sent: false, error: 'Please enter a valid email address.', values });
  if (!message) return res.render('contact', { title: 'Contact — Powerpacked', sent: false, error: 'Please write a message.', values });
  db.prepare('INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)').run(name, email, subject, message);
  res.render('contact', { title: 'Contact — Powerpacked', sent: true, error: null, values: {} });
});

app.get('/shop', (req, res) => {
  const products = db.prepare('SELECT * FROM products WHERE active = 1 ORDER BY created_at DESC').all();
  res.render('shop', { title: 'Shop — Powerpacked', products });
});

app.get('/shop/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ? AND active = 1').get(req.params.id);
  if (!product) return res.status(404).render('404', { title: 'Not found' });
  res.render('product', { title: product.name + ' — Powerpacked', product });
});

app.get('/search', (req, res) => {
  const q = (req.query.q || '').trim();
  let members = [], rides = [], events = [];
  if (q) {
    const like = `%${q}%`;
    members = db
      .prepare(`SELECT username, member_number, profile_pic FROM users
                WHERE is_admin = 0 AND (username LIKE ? ESCAPE '\\' OR member_number LIKE ? ESCAPE '\\')
                ORDER BY username LIMIT 20`)
      .all(like, like);
    rides = db
      .prepare(`SELECT v.name, v.make, v.model, v.year, v.photo, u.username
                FROM vehicles v JOIN users u ON u.id = v.user_id
                WHERE v.name LIKE ? ESCAPE '\\' OR v.make LIKE ? ESCAPE '\\' OR v.model LIKE ? ESCAPE '\\'
                ORDER BY v.created_at DESC LIMIT 20`)
      .all(like, like, like);
    events = db
      .prepare(`SELECT id, title, location, event_date FROM events
                WHERE title LIKE ? ESCAPE '\\' OR description LIKE ? ESCAPE '\\' OR location LIKE ? ESCAPE '\\'
                ORDER BY event_date DESC LIMIT 20`)
      .all(like, like, like);
  }
  res.render('search', { title: 'Search — Powerpacked', q, members, rides, events });
});

/* ---------------- auth ---------------- */

app.get('/signup', (req, res) => {
  if (req.session.userId) return res.redirect('/account');
  res.render('signup', { title: 'Join — Powerpacked', error: null, values: {} });
});

app.post('/signup', (req, res) => {
  const username = (req.body.username || '').trim();
  const email = (req.body.email || '').trim().toLowerCase();
  const password = req.body.password || '';
  const values = { username, email };
  let error = null;

  if (!USERNAME_RE.test(username)) error = 'Username must be 3–20 characters: letters, numbers, underscores.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) error = 'Please enter a valid email address.';
  else if (password.length < 8) error = 'Password must be at least 8 characters.';
  else if (db.prepare('SELECT id FROM users WHERE username = ?').get(username)) error = 'That username is taken.';
  else if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) error = 'An account with that email already exists.';

  if (error) return res.render('signup', { title: 'Join — Powerpacked', error, values });

  const passwordHash = bcrypt.hashSync(password, 10);
  const memberNumber = nextMemberNumber();
  const info = db
    .prepare('INSERT INTO users (username, email, password_hash, member_number) VALUES (?, ?, ?, ?)')
    .run(username, email, passwordHash, memberNumber);
  req.session.userId = info.lastInsertRowid;
  res.redirect('/account?welcome=1');
});

app.get('/login', (req, res) => {
  if (req.session.userId) return res.redirect('/account');
  res.render('login', { title: 'Log in — Powerpacked', error: null, next: req.query.next || '' });
});

app.post('/login', (req, res) => {
  const login = (req.body.login || '').trim().toLowerCase();
  const password = req.body.password || '';
  const next = req.body.next || '';
  const user = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(login, login);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.render('login', { title: 'Log in — Powerpacked', error: 'Invalid username/email or password.', next });
  }
  req.session.userId = user.id;
  res.redirect(next.startsWith('/') && !next.startsWith('//') ? next : user.is_admin ? '/admin' : '/account');
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

/* ---------------- member profile ---------------- */

app.get('/member/:username', (req, res) => {
  const user = db
    .prepare('SELECT id, username, member_number, profile_pic, bio, created_at FROM users WHERE username = ? AND is_admin = 0')
    .get(req.params.username);
  if (!user) return res.status(404).render('404', { title: 'Not found' });
  const vehicles = db.prepare('SELECT * FROM vehicles WHERE user_id = ? ORDER BY is_primary DESC, created_at DESC').all(user.id);
  res.render('member', { title: user.username + ' — Powerpacked', member: user, vehicles });
});

/* ---------------- account ---------------- */

app.get('/account', requireLogin, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
  const vehicles = db.prepare('SELECT * FROM vehicles WHERE user_id = ? ORDER BY is_primary DESC, created_at DESC').all(user.id);
  res.render('account', {
    title: 'My Account — Powerpacked',
    user, vehicles,
    welcome: req.query.welcome === '1',
    error: req.query.error || null, notice: req.query.notice || null,
  });
});

app.post('/account', requireLogin, upload.single('avatar'), (req, res) => {
  const bio = (req.body.bio || '').slice(0, 500);
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
  let profilePic = user.profile_pic;
  if (req.file) {
    if (profilePic) fs.unlink(path.join(uploadDir, path.basename(profilePic)), () => {});
    profilePic = '/uploads/' + req.file.filename;
  }
  let newPasswordHash = user.password_hash;
  if (req.body.new_password) {
    if (req.body.new_password.length < 8) {
      const vehicles = db.prepare('SELECT * FROM vehicles WHERE user_id = ? ORDER BY is_primary DESC').all(user.id);
      return res.render('account', { title: 'My Account — Powerpacked', user, vehicles, welcome: false, error: 'New password must be at least 8 characters.', notice: null });
    }
    newPasswordHash = bcrypt.hashSync(req.body.new_password, 10);
  }
  db.prepare('UPDATE users SET bio = ?, profile_pic = ?, password_hash = ? WHERE id = ?')
    .run(bio, profilePic, newPasswordHash, user.id);
  res.redirect('/account?notice=' + encodeURIComponent('Profile updated.'));
});

app.post('/account/vehicles', requireLogin, upload.single('photo'), (req, res) => {
  const name = (req.body.name || '').trim();
  if (!name) return res.redirect('/account?notice=' + encodeURIComponent('Give your ride a name.'));
  const make = (req.body.make || '').trim().slice(0, 60);
  const model = (req.body.model || '').trim().slice(0, 60);
  const year = (req.body.year || '').trim().slice(0, 10);
  const photo = req.file ? '/uploads/' + req.file.filename : null;
  const hasPrimary = db.prepare('SELECT id FROM vehicles WHERE user_id = ? AND is_primary = 1').get(req.session.userId);
  db.prepare('INSERT INTO vehicles (user_id, name, make, model, year, photo, is_primary) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(req.session.userId, name.slice(0, 80), make, model, year, photo, hasPrimary ? 0 : 1);
  res.redirect('/account?notice=' + encodeURIComponent('Ride added to your garage.'));
});

app.get('/account/vehicles/:id/edit', requireLogin, (req, res) => {
  const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ? AND user_id = ?').get(req.params.id, req.session.userId);
  if (!vehicle) return res.status(404).render('404', { title: 'Not found' });
  res.render('vehicle-form', { title: 'Edit Ride — Powerpacked', vehicle, error: req.query.error || null });
});

app.post('/account/vehicles/:id/edit', requireLogin, upload.single('photo'), (req, res) => {
  const vehicle = db.prepare('SELECT * FROM vehicles WHERE id = ? AND user_id = ?').get(req.params.id, req.session.userId);
  if (!vehicle) return res.status(404).render('404', { title: 'Not found' });
  const name = (req.body.name || '').trim();
  if (!name) return res.render('vehicle-form', { title: 'Edit Ride — Powerpacked', vehicle: { ...vehicle, ...req.body }, error: 'Give your ride a name.' });
  let photo = vehicle.photo;
  if (req.file) {
    if (vehicle.photo) fs.unlink(path.join(uploadDir, path.basename(vehicle.photo)), () => {});
    photo = '/uploads/' + req.file.filename;
  }
  db.prepare('UPDATE vehicles SET name = ?, make = ?, model = ?, year = ?, photo = ? WHERE id = ?')
    .run(name.slice(0, 80), (req.body.make || '').trim().slice(0, 60), (req.body.model || '').trim().slice(0, 60),
      (req.body.year || '').trim().slice(0, 10), photo, vehicle.id);
  res.redirect('/account?notice=' + encodeURIComponent('Ride updated.'));
});

app.post('/account/vehicles/:id/primary', requireLogin, (req, res) => {  const v = db.prepare('SELECT id FROM vehicles WHERE id = ? AND user_id = ?').get(req.params.id, req.session.userId);
  if (!v) return res.status(404).render('404', { title: 'Not found' });
  const tx = db.transaction(() => {
    db.prepare('UPDATE vehicles SET is_primary = 0 WHERE user_id = ?').run(req.session.userId);
    db.prepare('UPDATE vehicles SET is_primary = 1 WHERE id = ?').run(v.id);
  });
  tx();
  res.redirect('/account?notice=' + encodeURIComponent('Primary photo updated — it now represents you in Members Corner.'));
});

app.post('/account/vehicles/:id/delete', requireLogin, (req, res) => {
  const v = db.prepare('SELECT * FROM vehicles WHERE id = ? AND user_id = ?').get(req.params.id, req.session.userId);
  if (!v) return res.status(404).render('404', { title: 'Not found' });
  if (v.photo) fs.unlink(path.join(uploadDir, path.basename(v.photo)), () => {});
  db.prepare('DELETE FROM vehicles WHERE id = ?').run(v.id);
  res.redirect('/account?notice=' + encodeURIComponent('Ride removed.'));
});

/* ---------------- admin ---------------- */

app.get('/admin', requireAdmin, (req, res) => {
  const stats = {
    members: db.prepare('SELECT COUNT(*) c FROM users WHERE is_admin = 0').get().c,
    rides: db.prepare('SELECT COUNT(*) c FROM vehicles').get().c,
    upcomingEvents: db.prepare(`SELECT COUNT(*) c FROM events WHERE date(event_date) >= date('now')`).get().c,
    products: db.prepare('SELECT COUNT(*) c FROM products WHERE active = 1').get().c,
    unreadMessages: db.prepare('SELECT COUNT(*) c FROM contact_messages WHERE read = 0').get().c,
  };
  res.render('admin', { title: 'Admin — Powerpacked', stats });
});

const validateEvent = (b) => {
  if (!(b.title || '').trim()) return 'Title is required.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.event_date || '')) return 'Date must be YYYY-MM-DD.';
  return null;
};

app.get('/admin/events', requireAdmin, (req, res) => {
  const events = db.prepare('SELECT * FROM events ORDER BY event_date DESC').all();
  res.render('admin-events', { title: 'Manage Events — Powerpacked', events });
});

app.get('/admin/messages', requireAdmin, (req, res) => {
  const messages = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
  res.render('admin-messages', { title: 'Contact Messages — Powerpacked', messages });
});
app.post('/admin/messages/:id/read', requireAdmin, (req, res) => {
  db.prepare('UPDATE contact_messages SET read = 1 WHERE id = ?').run(req.params.id);
  res.redirect('/admin/messages');
});
app.post('/admin/messages/:id/delete', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
  res.redirect('/admin/messages');
});
app.get('/admin/events/new', requireAdmin, (req, res) =>
  res.render('admin-event-form', { title: 'New Event — Powerpacked', error: req.query.error || null, event: {}, formAction: '/admin/events' }));
app.post('/admin/events', requireAdmin, upload.single('image'), (req, res) => {
  const err = validateEvent(req.body);
  if (err) return res.render('admin-event-form', { title: 'New Event — Powerpacked', error: err, event: req.body, formAction: '/admin/events' });
  db.prepare('INSERT INTO events (title, description, location, event_date, event_time, image) VALUES (?, ?, ?, ?, ?, ?)')
    .run(req.body.title.trim().slice(0, 120), (req.body.description || '').slice(0, 2000),
      (req.body.location || '').trim().slice(0, 160), req.body.event_date,
      (req.body.event_time || '').slice(0, 20), req.file ? '/uploads/' + req.file.filename : null);
  res.redirect('/admin/events');
});
app.get('/admin/events/:id/edit', requireAdmin, (req, res) => {
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!event) return res.status(404).render('404', { title: 'Not found' });
  res.render('admin-event-form', { title: 'Edit Event — Powerpacked', error: req.query.error || null, event, formAction: '/admin/events/' + event.id });
});
app.post('/admin/events/:id', requireAdmin, upload.single('image'), (req, res) => {
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (!event) return res.status(404).render('404', { title: 'Not found' });
  const err = validateEvent(req.body);
  if (err) return res.render('admin-event-form', { title: 'Edit Event — Powerpacked', error: err, event: { ...event, ...req.body }, formAction: '/admin/events/' + event.id });
  let image = event.image;
  if (req.file) {
    if (image) fs.unlink(path.join(uploadDir, path.basename(image)), () => {});
    image = '/uploads/' + req.file.filename;
  }
  db.prepare('UPDATE events SET title = ?, description = ?, location = ?, event_date = ?, event_time = ?, image = ? WHERE id = ?')
    .run(req.body.title.trim().slice(0, 120), (req.body.description || '').slice(0, 2000),
      (req.body.location || '').trim().slice(0, 160), req.body.event_date,
      (req.body.event_time || '').slice(0, 20), image, event.id);
  res.redirect('/admin/events');
});
app.post('/admin/events/:id/delete', requireAdmin, (req, res) => {
  const event = db.prepare('SELECT * FROM events WHERE id = ?').get(req.params.id);
  if (event) {
    if (event.image) fs.unlink(path.join(uploadDir, path.basename(event.image)), () => {});
    db.prepare('DELETE FROM events WHERE id = ?').run(event.id);
  }
  res.redirect('/admin/events');
});

app.get('/admin/products', requireAdmin, (req, res) => {
  const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
  res.render('admin-products', { title: 'Manage Products — Powerpacked', products });
});
app.get('/admin/products/new', requireAdmin, (req, res) =>
  res.render('admin-product-form', { title: 'New Product — Powerpacked', error: req.query.error || null, product: { active: 1 }, formAction: '/admin/products' }));
app.post('/admin/products', requireAdmin, upload.single('image'), (req, res) => {
  if (!(req.body.name || '').trim()) {
    return res.render('admin-product-form', { title: 'New Product — Powerpacked', error: 'Name is required.', product: req.body, formAction: '/admin/products' });
  }
  const priceCents = Math.max(0, Math.round(parseFloat(req.body.price || '0') * 100) || 0);
  db.prepare('INSERT INTO products (name, description, price_cents, image, active) VALUES (?, ?, ?, ?, ?)')
    .run(req.body.name.trim().slice(0, 120), (req.body.description || '').slice(0, 2000), priceCents,
      req.file ? '/uploads/' + req.file.filename : null, req.body.active ? 1 : 0);
  res.redirect('/admin/products');
});
app.get('/admin/products/:id/edit', requireAdmin, (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).render('404', { title: 'Not found' });
  res.render('admin-product-form', { title: 'Edit Product — Powerpacked', error: req.query.error || null, product, formAction: '/admin/products/' + product.id });
});
app.post('/admin/products/:id', requireAdmin, upload.single('image'), (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).render('404', { title: 'Not found' });
  if (!(req.body.name || '').trim()) {
    return res.render('admin-product-form', { title: 'Edit Product — Powerpacked', error: 'Name is required.', product: { ...product, ...req.body }, formAction: '/admin/products/' + product.id });
  }
  const priceCents = Math.max(0, Math.round(parseFloat(req.body.price || '0') * 100) || 0);
  let image = product.image;
  if (req.file) {
    if (image) fs.unlink(path.join(uploadDir, path.basename(image)), () => {});
    image = '/uploads/' + req.file.filename;
  }
  db.prepare('UPDATE products SET name = ?, description = ?, price_cents = ?, image = ?, active = ? WHERE id = ?')
    .run(req.body.name.trim().slice(0, 120), (req.body.description || '').slice(0, 2000), priceCents, image,
      req.body.active ? 1 : 0, product.id);
  res.redirect('/admin/products');
});
app.post('/admin/products/:id/delete', requireAdmin, (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (product) {
    if (product.image) fs.unlink(path.join(uploadDir, path.basename(product.image)), () => {});
    db.prepare('DELETE FROM products WHERE id = ?').run(product.id);
  }
  res.redirect('/admin/products');
});

/* ---------------- errors ---------------- */
app.use((req, res) => res.status(404).render('404', { title: 'Not found' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const isUploadError = err instanceof multer.MulterError || /Only image uploads/.test(err.message || '');
  if (isUploadError) {
    const back = (req.get('Referer') || '/account').split('?')[0];
    const msg = err.code === 'LIMIT_FILE_SIZE'
      ? 'That photo is too large — please keep uploads under 15MB.'
      : (err.message || 'Upload failed. Please try a jpg, png, gif, or webp image.');
    return res.redirect(back + '?error=' + encodeURIComponent(msg));
  }
  console.error(err);
  res.status(500).render('500', { title: 'Something broke', message: err.message });
});

app.listen(PORT, () => console.log(`Powerpacked running at http://localhost:${PORT}`));
