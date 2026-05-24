# Margherita Sarajevo

Zvanični web restorana — Vite + React + TypeScript + Tailwind + shadcn/ui, sa automatskim sistemom rezervacija (Bun backend + SSE).

## Struktura

```
src/                React frontend (Vite)
  pages/            Stranice: Index, Menu, Reserve, ReservationConfirmed, ManageReservation, Admin, Host
  components/       UI komponente
  config/           Konfiguracija restorana (radno vrijeme, stolovi, pravila)
  lib/reservations  Booking engine (storage, availability, types)
  i18n/             Bosanski + engleski + sigurni formater datuma
server/             Bun HTTP server sa JSON file persistence + Server-Sent Events
data/               Reservation JSON (auto-kreirano; gitignored)
```

## Pokretanje lokalno

```bash
bun install
bun run dev:all      # pokreće API (:3001) + Vite (:8080) zajedno
```

Ili pojedinačno:

```bash
bun run server       # samo API
bun run dev          # samo Vite
```

Otvorite **http://localhost:8080** za kupce, **/host** za osoblje, **/admin** za pregled.

## URL-ovi

| Putanja | Za koga | Šta |
|---|---|---|
| `/` | Kupci | Početna stranica |
| `/menu` | Kupci | Cijeli meni |
| `/reserve` | Kupci | Rezervacija stola (multi-step) |
| `/reservation/:id` | Kupci | Potvrda nakon rezervacije |
| `/manage/:token` | Kupci | One-click otkazivanje |
| `/host` | Osoblje | Tablet uživo · tlocrt + alarm na novu rezervaciju |
| `/admin` | Šefica | Pregled, statistika, izvozi |

## Konfiguracija restorana

Sve postavke u **[src/config/restaurant.ts](src/config/restaurant.ts)**:
- Radno vrijeme po danu (`HOURS`)
- Lista stolova sa kapacitetom (`TABLES`)
- Pravila rezervacije (`RULES`) — slot interval, vrijeme držanja stola, no-show grace period, prag depozita
- Kontakt info (`RESTAURANT`)

## Booking engine — kako radi

- Bun server čuva rezervacije u `data/reservations.json`
- Klijenti se konektuju na `/api/events` (SSE) i dobijaju snapshot + svaku promjenu u realnom vremenu
- Pri POST-u nove rezervacije, server pronalazi najmanji slobodni stol koji odgovara veličini grupe
- Automatski oznacava no-show 20 min nakon termina (`runAutoNoShowSweep` svake minute)
- Bez čekanja, bez ručnog poziva — osoblje samo gleda tablet

## Publish workflow (produkcija)

### Opcija A — frontend na Lovable, backend na Railway

1. **Push na GitHub**
   ```bash
   git add .
   git commit -m "Production ready"
   git push
   ```

2. **Deploy backend na Railway**
   - railway.app → New Project → Deploy from GitHub repo
   - Auto-detektuje [Dockerfile](Dockerfile)
   - Dodajte volume na `/app/data` (Settings → Volumes) da rezervacije prežive restart
   - Skopirajte javni URL, npr. `https://margherita-api.up.railway.app`

3. **Update Lovable s API URL-om**
   - U Lovable projektu → Settings → Environment variables → dodajte:
     ```
     VITE_API_BASE=https://margherita-api.up.railway.app/api
     ```
   - Push frontend opet (ili kliknite "Rebuild" u Lovable)
   - Pritisnite **Publish**

### Opcija B — sve na Railway (jedan repo, dva servisa)

1. Frontend servis: Build Command `bun run build`, Start Command serviraj `dist/` kroz nginx ili `bun run preview`
2. API servis: koristi [Dockerfile](Dockerfile)
3. Frontend env: `VITE_API_BASE=/api` + proxy preko gateway-a, ili apsolutni URL API servisa

### Opcija C — sve na Render / Fly.io
Isti koraci. Dockerfile radi svuda.

## Email + SMS u produkciji

Trenutno se obavještenja simuliraju (vidljiva na `/reservation/:id` ekranu + u `Outbox` na `/admin`). Za pravo slanje:

1. **Email** — kreirajte račun na [resend.com](https://resend.com) (besplatno do 3,000/mjesec), uzmite API ključ
2. **SMS** — za BiH preporučujem [Infobip](https://www.infobip.com) ili [Twilio](https://www.twilio.com)
3. Replace `push(...)` pozive u [src/lib/notify.ts](src/lib/notify.ts) sa pozivima ka Resend/Twilio API-ju. Po želji premjestite logiku na server (preporuka) da se API ključ ne otkrije u browseru.

## Sigurnost — prije publish-a

- [ ] Stavite `/admin` i `/host` iza neke forme zaštite (basic auth, magic link, ili WebAuthn). Trenutno su javno dostupni — radi demoa.
- [ ] Generišite produkcijski sigurni `og-image.jpg` i postavite u `public/`
- [ ] Provjerite favicon u `public/`

## Razvoj — korisni komandi

```bash
bun run lint         # ESLint
bun run test         # Vitest
bun run build        # produkcijski build (statički u dist/)
bun run preview      # serviraj produkcijski build lokalno
```

## Tehnologija

- **Frontend**: Vite, React 18, TypeScript, Tailwind, shadcn/ui (Radix), lucide-react, react-router-dom
- **Backend**: Bun (HTTP server + SSE), file-based JSON persistence
- **Internationalizacija**: vlastiti BS + EN sistem (`src/i18n/`) sa ručno definisanim datumima (locale-data-bezbjedan)

---

© Margherita Sarajevo
