# Restaurant Booking System

End-to-end booking platform built around an embeddable widget.

Three apps in one repo:

| Folder | Stack | Port (dev) | Purpose |
|---|---|---|---|
| `server/` | Node.js · Express · SQLite · Nodemailer | `4000` | REST API + serves `widget.js` + Gmail SMTP confirmations |
| `client/` | React · Vite · Tailwind | `5173` | Owner/staff dashboard (login, bookings, status changes) |
| `website/` | React · Vite · TypeScript · Tailwind · shadcn | `8080` | Margherita Sarajevo restaurant website with embedded booking widget |

The widget loads with one `<script>` tag and opens a modal. It calls the same `server/` REST API the dashboard uses, so reservations made from the website show up in the dashboard in real time.

---

## Quick start (local dev)

Requirements: **Bun** (`curl -fsSL https://bun.sh/install | bash`) or Node 18+.

```bash
# 1. Install dependencies for all three apps
bun run install:all      # or: cd server && bun i && cd ../client && bun i && cd ../website && bun i

# 2. Copy the server env template and edit
cp server/.env.example server/.env

# 3. Seed the DB the first time
cd server && bun run src/seed.js && cd ..

# 4. Run everything (server :4000, dashboard :5173, website :8080)
bun run start:all
```

Open:
- **Customer website**: http://localhost:8080
- **Staff dashboard**: http://localhost:5173
- **Booking API**: http://localhost:4000/api/health

The widget is loaded into `website/index.html` and currently points at the placeholder `BOOKING_API_URL`. For local dev, change it to `http://localhost:4000` (see "Wiring the widget" below).

---

## Wiring the widget

`website/index.html` ends with:

```html
<script
  async
  src="BOOKING_API_URL/widget/widget.js"
  data-restaurant-id="1"
></script>
```

Replace `BOOKING_API_URL` with the API origin:

- **Local dev**: `http://localhost:4000`
- **Production**: the public URL of your deployed Railway server, e.g. `https://margherita-api.up.railway.app`

The script auto-creates a button (hidden via CSS so it doesn't double up) and exposes `window.RestaurantBooking.open()`. The website's "Rezerviši sto" buttons in the navbar and homepage CTA call this directly — no extra wiring needed.

---

## Environment variables (`server/.env`)

```env
PORT=4000
JWT_SECRET=change-me-in-production
DB_PATH=./data/booking.db
CLIENT_ORIGIN=*        # tighten in production to your website + dashboard origins

# Gmail SMTP (leave blank to skip emails in dev)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-account@gmail.com
SMTP_PASS=your-gmail-app-password
SMTP_FROM="Margherita Sarajevo <your-account@gmail.com>"

ADMIN_EMAIL=owner@margheritasarajevo.ba
RESTAURANT_NAME=Margherita Sarajevo
RESTAURANT_PHONE=+387 62 001 144
```

SMTP_PASS must be a **Gmail App Password** (not your regular Gmail password). Generate one at: https://myaccount.google.com/apppasswords

---

## Deployment

### 1) `server/` → Railway

1. railway.app → **New Project → Deploy from GitHub repo** → select this repo
2. **Root directory**: `server`
3. **Start command**: `node src/index.js`
4. Add a **Volume** mounted at `/app/server/data` so SQLite survives restarts
5. Add the env vars from the list above (Settings → Variables)
6. Deploy. Note the public URL — e.g. `https://margherita-api.up.railway.app`

### 2) `website/` → Vercel (or Netlify)

1. vercel.com → **New Project → Import** → select this repo
2. **Root directory**: `website`
3. **Build command**: `bun run build` (Vercel auto-detects Vite)
4. **Output directory**: `dist`
5. Deploy
6. Open `website/index.html` locally and replace `BOOKING_API_URL` with the Railway URL from step 1, commit, push — Vercel re-deploys automatically

### 3) `client/` (dashboard) → Vercel

1. vercel.com → **New Project → Import** → same repo
2. **Root directory**: `client`
3. **Build command**: `bun run build`
4. **Output directory**: `dist`
5. Env var: `VITE_API_URL=https://margherita-api.up.railway.app`
6. Deploy

### After deployment — tighten CORS

In Railway, set `CLIENT_ORIGIN` to a comma-separated list of your website + dashboard origins, e.g. `https://margheritasarajevo.ba,https://margherita-dashboard.vercel.app`.

---

## API endpoints (subset used by the widget)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/restaurants/:id` | Restaurant info (name, hours, slot minutes) |
| `GET` | `/api/restaurants/:id/slots?date=YYYY-MM-DD` | Available time slots for a date |
| `POST` | `/api/bookings` | Create a booking |
| `GET` | `/api/health` | Health check (used by Railway) |

The dashboard adds authenticated endpoints (`POST /api/login`, `GET /api/bookings`, `PATCH /api/bookings/:id`).

---

## Notes about the Margherita website

- Originally a Lovable project; the old custom localStorage reservation system was removed and replaced with the booking widget
- Bilingual (Bosnian + English) via `src/i18n/translations.ts` and `src/i18n/LanguageContext.tsx`
- shadcn/ui components and Tailwind theme tokens were kept untouched
- All "Rezerviši sto" call-sites (navbar desktop, navbar mobile, homepage CTA, footer quick-link) call `openBookingWidget()` from `src/lib/booking.ts`

---

© Margherita Sarajevo
