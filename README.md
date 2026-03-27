# ryyansafar.site

Personal portfolio and component showcase for Ryyan Safar — Electronics & Communication Engineer.

**Live → [ryyansafar.site](https://ryyansafar.site)**

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Routes & Pages](#routes--pages)
- [Design Systems](#design-systems)
- [Key Features](#key-features)
- [Components](#components)
- [Backend — Firebase](#backend--firebase)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.1 (App Router, Server Actions) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + custom CSS |
| Animations | GSAP 3 + ScrollTrigger, Framer Motion 12 |
| Physics | Matter.js (skills canvas), custom spring physics (cursor) |
| Database | Firebase Firestore (via firebase-admin, server-side only) |
| Fonts | Space Grotesk · JetBrains Mono · Clash Display · Bebas Neue · Barrio · Epilogue |
| Analytics | Google Analytics GA4 (`G-Q20DD4YFJJ`) |
| Deployment | Vercel (Git integration, auto-deploy on push) |
| Domain | ryyansafar.site (via `public/CNAME`) |

---

## Project Structure

```
/
├── app/
│   ├── layout.tsx                    # Root layout — fonts, GA4, TransitionProvider, cursor:none
│   ├── globals.css                   # Design tokens, typography, global styles
│   ├── template.tsx                  # Page transition passthrough (required by TransitionProvider)
│   ├── page.tsx                      # / — Main portfolio landing page
│   │
│   ├── design/
│   │   ├── layout.tsx                # Metadata for all /design/* routes
│   │   ├── page.tsx                  # /design — re-exports archive/gallery/page.tsx
│   │   ├── components/
│   │   │   ├── page.tsx              # /design/components — metadata + mounts ComponentsClient
│   │   │   ├── ComponentsClient.tsx  # All interactive components page logic (client component)
│   │   │   └── CopyCmd.tsx           # Copy-command utility (kept for reference)
│   │   └── wallpapers/
│   │       └── page.tsx              # /design/wallpapers — coming soon placeholder
│   │
│   ├── archive/
│   │   └── gallery/
│   │       └── page.tsx              # The actual /design implementation — 1200+ lines
│   │
│   ├── _design/                      # [ARCHIVED] previous design portfolio — routing disabled by _
│   │
│   ├── api/
│   │   └── diag/
│   │       └── route.ts              # GET /api/diag — Firebase health check endpoint
│   │
│   └── actions/
│       └── like.ts                   # Server Actions: getLikes() / toggleLike() via Firestore
│
├── components/
│   ├── PillNav.tsx                   # Sticky pill navbar (main portfolio)
│   ├── BubbleMenu.tsx                # Mobile radial bubble menu overlay
│   ├── LikeButton.tsx                # Firebase-backed like button with Framer Motion animations
│   ├── TransitionProvider.tsx        # GSAP 7-strip horizontal wipe + preloader context
│   └── design/                       # Components used only by archived _design route
│       ├── DesignNav.tsx
│       ├── DesignCursor.tsx
│       ├── FisheyeHero.tsx
│       ├── HorizontalScroll.tsx
│       ├── PowerOn.tsx
│       └── ProjectCard.tsx
│
├── components/ui/
│   └── spring-cursor.tsx             # Standalone React spring cursor (shadcn-style registry)
│
├── lib/
│   ├── firebase-admin.ts             # Firebase Admin SDK init — tries 3 credential methods
│   └── utils.ts                      # cn() utility (clsx + tailwind-merge)
│
├── public/
│   ├── script.js                     # Cursor physics, card tilt, Konami code, snake game, Matter.js
│   ├── CNAME                         # Custom domain: ryyansafar.site
│   ├── RyyanSafar_Resume.pdf         # Resume download
│   ├── caffeine-quote.svg            # SVG asset
│   ├── tinkerhublogo.png             # TinkerHub Foundation logo
│   ├── assets/                       # Images: monogram, poster, grid, project previews
│   └── registry/
│       ├── index.json                # ryyan-ui CLI registry index
│       └── cursor-spring.json        # cursor-spring component registry entry
│
├── global.d.ts                       # TypeScript: PNG module declaration + requestIdleCallback
├── next.config.ts                    # allowedDevOrigins for local network dev
└── .gitignore
```

---

## Routes & Pages

### `/` — Main Portfolio

**File:** `app/page.tsx`

The primary landing page. Dark editorial aesthetic (`#050505` background, amber `#FFDD00` accents).

**Sections:**

| Section | What it does |
|---|---|
| Hero | Glitch typography, scramble text animation on `RYYAN SAFAR`, CTA buttons (Projects + Resume download) |
| About | Bio, background, what I build |
| Work | Experience timeline — DRDO, TinkerHub Foundation, freelance |
| Projects | 3D perspective-tilt cards with tag chips, live demo and GitHub links |
| Skills | Matter.js physics canvas — skill tags fall and collide with gravity |
| Ideathon | Hackathon and ideathon achievements |
| Contact | Email copy button, social links, Razorpay support link |

**Navigation:** Two systems run in parallel:
- `PillNav` — sticky pill bar at the top, scroll-aware active state (desktop)
- `BubbleMenu` — radial overlay menu that opens on logo tap (mobile)

---

### `/design` — Web Design Gallery

**File:** `app/archive/gallery/page.tsx` (re-exported by `app/design/page.tsx`)

Editorial horizontal-scroll gallery showcasing 6 web projects. Single self-contained file (~1200 lines).

**Layout:**
- **Desktop:** 700vw horizontal track, snap-scroll between panels, custom spring-physics `GalleryCursor`
- **Mobile portrait:** Vertical stack, panels full-width, iframes at fixed height
- **Mobile landscape:** Compact vertical layout (`@media (max-height: 500px) and (orientation: landscape)`)

**Panels:**

| # | Project | Notes |
|---|---|---|
| 0 | Intro / Landing | Swiss-grid editorial poster, DESIGN title, nav chips |
| 1 | RYYAN_SAFAR.SITE | This portfolio — live iframe |
| 2 | HELP_ME_SURVIVE_COLLEGE | Student resource site — live iframe |
| 3 | TEAMAPT.IN | Team management tool — live iframe |
| 4 | WALLPAPERS_GALLERY | Wallpaper collection — live iframe |
| 5 | SMOKE_RYYANSAFAR_SITE | Experimental smoke effect site — live iframe |
| 6 | TINKERSPACE_3D_QUEUE | 3D queue visualiser for TinkerSpace — live iframe, no panel counter |

Panels 1–6 show a `01/06`–`06/06` counter. Panel 6 (Tinkerspace) has a footer instead.

**Performance:** `LiveIframe` uses `IntersectionObserver` with `rootMargin: '0px 100% 0px 100%'` — iframes only load when the adjacent panel is within one screen-width of the viewport.

**Navigation chips (intro panel):** `← MAIN` · `COMPONENTS` · `WALLPAPERS ↗`

**GalleryCursor:** Independent spring-physics SVG cursor (dark fill on light background). Hides the global `#custom-cursor` on mount and restores it on unmount. Has its own motion blur + hover blur spring.

---

### `/design/components` — Component Showcase

**Files:** `app/design/components/page.tsx` + `ComponentsClient.tsx`

Interactive component library page in the style of React Bits / shadcn.

**Architecture:**
- `page.tsx` — server component, exports `metadata`, mounts `<ComponentsClient />`
- `ComponentsClient.tsx` — entire interactive experience (`'use client'`, ~700 lines)

**Component cards (`ComponentCard`):**

Each card shows:
- CSS keyframe animated preview box (simulates cursor moving, hovering, clicking — no interaction required)
- Component name, version badge, description, tag chips
- `→ try it live` — opens a full-screen modal popup
- `GitHub ↗` — links to [Ryyan-components](https://github.com/ryyansafar/Ryyan-components)
- `LikeButton` — persistent community like count via Firebase

**Demo modal (`DemoModal`):**

Full-screen fixed overlay with backdrop blur. Animates in with `scale(0.96) translateY(18px)` → `scale(1) translateY(0)` using `cubic-bezier(0.34,1.28,0.64,1)`. Close with ✕ button, backdrop click, or Escape key. Contains:

- `CursorDemoBox` — interactive dark arena where the spring cursor runs live. Hides global cursor while active. Has "hover me", "click me" and "link.tsx" targets inside.
- Parameter sliders (live — reads from `physicsRef` without re-renders)
- `DocTabs` — Installation / Usage / Examples tabs with framework switchers

**DocTabs:**

| Tab | Contents |
|---|---|
| Installation | Terminal block (`npx ryyan-ui add cursor-spring`) + copy implementation button |
| Usage | `[HTML]` `[Next.js]` `[React / Vite]` switcher buttons + code block |
| Examples | `[Basic HTML]` `[Next.js App]` `[Custom Physics]` switcher buttons + code block |

**Parameters:**

| Slider | Range | Default | Effect |
|---|---|---|---|
| `POS_STIFF` | 30–600 | 240 | How quickly cursor follows mouse |
| `POS_DAMP` | 5–60 | 27 | Bounce amount (lower = more bounce) |
| `SCL_STIFF` | 50–800 | 330 | Click/hover snap speed |
| `SCL_DAMP` | 5–80 | 30 | Snap smoothness |
| `HOVER_BLUR` | 0–3 | 1.2 | Blur glow on buttons/links |

**Currently available:** `cursor-spring` v1.0.0

---

### `/design/wallpapers` — Wallpapers

**File:** `app/design/wallpapers/page.tsx`

Coming soon placeholder page. Uses inline SVG cursor (no spring cursor dependency). Desktop & phone wallpapers planned.

---

### `/api/diag` — Firebase Diagnostic

**File:** `app/api/diag/route.ts`

Internal health check. Returns JSON showing Firebase init status. Use after deployment to verify credentials are working.

```json
{
  "timestamp": "2026-03-27T16:56:40.773Z",
  "env": { "hasServiceAccountJson": true },
  "firebase": { "initialized": true, "readSuccess": true, "docCount": 1 }
}
```

---

## Design Systems

### Main Portfolio (`/`)

| Token | Value | Role |
|---|---|---|
| `--bg-color` | `#050505` | Page background |
| `--text-primary` | `#ffffff` | Body text |
| `--text-secondary` | `rgba(255,255,255,0.5)` | Muted text |
| `--accent-color` | `#FFDD00` | Primary amber accent |
| `--accent-alt` | `#FFB800` | Secondary amber |
| `--card-bg` | `rgba(255,255,255,0.03)` | Card surface |
| `--card-border` | `rgba(255,255,255,0.08)` | Card border |
| Display font | Bebas Neue / Anton | Hero headings |
| UI font | Space Grotesk | Body, nav, labels |
| Mono font | JetBrains Mono | Code, tags, terminal |

### Design Gallery & Components (`/design/*`)

| Token | Value | Role |
|---|---|---|
| Background | `#fbf9f4` | Warm paper base |
| Text | `#1b1c19` | Near-black body |
| Gold | `#f7c533` | Stamp, highlights |
| Green | `#a8e060` | Terminal, success |
| Ember | `#c04b0c` | Warm CTA |
| Lime | `#b4ff5a` | Obsidian panel accent |
| Title font | Barrio (cursive) | Gallery panel display titles |
| Editorial font | Epilogue 900 | Page headings |
| UI font | Space Grotesk | Labels, tags, nav |
| Mono font | JetBrains Mono | Code blocks |

---

## Key Features

### Spring-Physics Cursor

Two independent instances:

1. **Global cursor** (`public/script.js`) — runs on all pages. `z-index: 10001`. White arrow SVG with dark shadow, motion blur, hover scale (1.3×), click scale (0.65×), hover blur glow spring.
2. **Gallery cursor** (`GalleryCursor` in `archive/gallery/page.tsx`) — same physics, dark-on-light color scheme. Hides global cursor on mount, restores on unmount. `z-index: 9999`.

**Physics formula:** `F = k*(target - pos) - d*vel`, stepped with `dt = min(elapsed/1000, 0.033)` to cap at 30fps equivalent.

**Motion blur:** SVG `feGaussianBlur` filter. `stdDeviation` = `|cos(angle)| * speed * 0.005` (x) and `|sin(angle)| * speed * 0.005` (y) — directional, capped at 2.8.

**Hover blur:** Separate spring that activates when `mouseover` hits an `a` or `button`. Springs to `HB_MAX = 1.2`, back to `0` on `mouseout`. Added to motion blur.

**Double-cursor prevention:** `cursor: none !important` is injected as an inline `<style>` directly in `<head>` in `layout.tsx` — applies before any external CSS or JS loads, covering `html, body, body *`.

### Page Transitions

`TransitionProvider` wraps all pages. `navigateTo(href)` triggers a 7-strip GSAP horizontal wipe before Next.js router changes the route.

### Preloader

Synchronous inline `<script>` in `layout.tsx` drives a progress bar before React hydrates. Prevents the "stuck at 0%" bug on mobile caused by React event timing.

### Skills Physics Canvas

`initSkillsPhysics()` in `public/script.js` creates a Matter.js world. Skill tags are rectangular bodies with `restitution` and `friction`. They fall and stack on load. Re-initialised on back-navigation via `window.initSkillsPhysics`.

### Konami Code → Snake Game

`↑ ↑ ↓ ↓ ← → ← → B A` (within 2 seconds between keys) triggers an explosion effect and opens a snake mini-game modal. Canvas game in `public/script.js`.

### Likes (Firebase Firestore)

Client component `LikeButton` calls `getLikes()` / `toggleLike()` server actions. Optimistic UI with Framer Motion animations (heart pulse, +1/-1 float). Persists per-device state in `localStorage`. Firestore path: `component_likes/{componentId}.count`.

---

## Components

### `PillNav`

Sticky pill navigation bar. Props: `logo` (JSX), `logoAlt`, `items[]` (`label`, `href`, optional `ariaLabel`), `activeHref`. Items can include JSX labels (used for the Razorpay/coffee icon).

### `BubbleMenu`

Mobile radial overlay menu. Opens on logo tap. Items spring in with rotation. Configurable `bgColor` and `textColor` per item on hover.

### `LikeButton`

`componentId: string` prop. Renders heart icon + count. Framer Motion: scale spring on click, floating +1/-1 indicator during pending state. Rolls back on server error.

### `TransitionProvider`

Provides `navigateTo(href: string)` via React context. Use `useTransition()` hook inside any client component to trigger the wipe before routing.

---

## Backend — Firebase

### Architecture

All Firebase code is **server-side only** — never in the client bundle.

```
lib/firebase-admin.ts     ← SDK init, credential resolution
app/actions/like.ts       ← getLikes(componentId), toggleLike(componentId, increment)
```

### Credential Resolution (in order)

1. **`FIREBASE_SERVICE_ACCOUNT_JSON`** ← use this on Vercel
   Entire service account JSON pasted as one env var string. No newline escaping issues.

2. **Split env vars** (`FIREBASE_PROJECT_ID` + `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY`)
   Tries 3 private key formats automatically to handle Vercel's newline serialization quirks.

3. **Local JSON file** (dev only)
   Auto-detects `rybo-components-firebase-adminsdk-*.json` in the project root.

---

## Environment Variables

### Production (Vercel)

| Variable | Value |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Full contents of your Firebase service account JSON file |

### Local development

Place the service account JSON file in the project root — it's gitignored and auto-detected:
```
rybo-components-firebase-adminsdk-*.json
```

Or add to `.env.local`:
```env
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
```

### Vercel setup steps

1. Vercel Dashboard → Project → **Settings → Environment Variables**
2. Add `FIREBASE_SERVICE_ACCOUNT_JSON` → paste the full JSON
3. Check Production + Preview
4. Redeploy → verify at `/api/diag`

---

## Development

```bash
npm install
npm run dev       # → http://localhost:3000
```

**Test on a phone (same network):**
```bash
ipconfig getifaddr en0    # get your local IP
# visit http://<ip>:3000 on your phone
```

`next.config.ts` whitelists `192.168.*` and `10.*` as allowed dev origins.

---

## Deployment

Vercel is connected to `github.com/ryyansafar/ryyansafar.github.io`. Every push to `master` triggers an automatic production deployment.

```bash
git add .
git commit -m "feat: ..."
git push origin master
# Vercel auto-builds and deploys
```

**Notes:**
- `output: 'export'` is removed — Server Actions (Firebase likes) require a Node.js runtime, which Vercel provides automatically.
- `public/script.js` loads `afterInteractive` — all DOM-dependent code (cursor, Matter.js, snake game) lives here, outside React's tree.
- `app/_design/` is an archived prior design iteration. `_` prefix disables routing. Do not delete.
- `/design` is served by `app/archive/gallery/page.tsx`, re-exported via `app/design/page.tsx` to keep the URL clean.
- Service account JSON files are gitignored — never commit them.

---

## Related

- **Component registry:** [github.com/ryyansafar/Ryyan-components](https://github.com/ryyansafar/Ryyan-components)
- **Live site:** [ryyansafar.site](https://ryyansafar.site)
- **Components page:** [ryyansafar.site/design/components](https://ryyansafar.site/design/components)
