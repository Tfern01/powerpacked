# Powerpacked — Car Club Website

**Driven by Difference.** *Unity without Uniformity.*

The official website for the Powerpacked car club (pwrpckd.com): a central hub
uniting every subsect of car culture — muscle, exotic, truck, motorcycle,
side-by-side, EV — into one community.

## What it does

- **Landing page** — hero with the "Driven by Difference" tagline, the club
  mission, upcoming-events preview, an auto-rotating Members Corner carousel,
  and a big **Join Now!** call to action.
- **Events** — calendar page for meets, cruises, and shows (empty state until
  events are added via the admin panel).
- **Members** — signup/login with bcrypt-hashed passwords and cookie sessions.
  Every member gets an auto-assigned member number (`PWR-001`, `PWR-002`, …),
  a profile page, a profile picture, and a garage where they can add vehicle
  photos and pick one primary photo.
- **Members Corner** — gallery wall of every member's chosen primary photo;
  clicking a photo opens that member's profile.
- **Shop** — full storefront structure; shows an attractive "coming soon"
  empty state until products are added.
- **Search** — header search across members, rides, and events.
- **Admin panel** (`/admin`) — add/edit/delete events and shop products.

Design: clean and modern with a retro twist inspired by vintage *Car Craft*
magazines — bold condensed typography (Bebas Neue), cream/off-black/hot-rod-red
palette, badge motifs. The logo is a placeholder SVG badge until the real one
arrives.

## How to run

Requires Node.js 18+.

```bash
npm install
npm start
```

Then open http://localhost:3000.

Environment variables (all optional):

| Variable         | Default              | Purpose                        |
|------------------|----------------------|--------------------------------|
| `PORT`           | `3000`               | HTTP port                      |
| `SESSION_SECRET` | dev-only fallback    | Session cookie signing secret  |
| `DB_PATH`        | `./powerpacked.db`   | SQLite database file location  |

On first run the app creates the SQLite database, seeds the site-owner admin
account, and writes the admin credentials to `ADMIN.md` (keep that file
private; change the password after first login).

## Project structure

```
powerpacked/
├── server.js            # Express app, all routes
├── db.js                # SQLite schema, member-number sequencer, admin seed
├── views/               # EJS templates (pages + header/footer partials)
├── public/
│   ├── css/style.css    # Full site design
│   ├── js/main.js       # Nav, search toggle, carousel
│   ├── images/          # Hero + placeholder imagery
│   └── uploads/         # Member/event/product uploads (created at runtime)
├── ADMIN.md             # Admin credentials (generated on first run)
└── README.md
```

## Notes

- Uploads accept jpg/png/gif/webp up to 5 MB and are stored in
  `public/uploads/`.
- All database queries are parameterized; passwords are hashed with bcrypt.
- For production deployment (Render/Railway/Fly), set `SESSION_SECRET` and
  persist the SQLite file via a volume, or swap `db.js` for Postgres.
