# ryyansafar.site

Personal portfolio for Ryyan Safar — Electronics & Communication Engineer, builder, and designer.

**Live → [ryyansafar.site](https://ryyansafar.site)**

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.2.1 (App Router, Serverless) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + custom CSS |
| Animations | GSAP 3 + ScrollTrigger, Framer Motion 12 |
| Client-side | Vanilla JS (cursor, physics canvas, Konami code, snake game) |
| Fonts | Space Grotesk, JetBrains Mono, Clash Display, Bebas Neue, Barrio |
| Analytics | Google Analytics (GA4) |
| Deployment | Vercel (Git Integration) |

---

## Project Structure

```
/
├── app/
│   ├── page.tsx               # Main portfolio landing page
│   ├── layout.tsx             # Root layout: fonts, GA, TransitionProvider
│   ├── globals.css            # Design tokens, typography, global component styles
│   ├── template.tsx           # Page transition passthrough
│   ├── design/
│   │   ├── page.tsx           # Re-exports archive/gallery — serves /design
│   │   ├── layout.tsx         # Metadata for /design
│   │   ├── components/        # /design/components — coming soon
│   │   └── wallpapers/        # /design/wallpapers — coming soon
│   ├── archive/
│   │   └── gallery/
│   │       └── page.tsx       # /design implementation (horizontal scroll gallery)
│   └── _design/               # [ARCHIVED] Previous design portfolio iteration
│
├── components/
│   ├── PillNav.tsx            # Sticky pill navigation bar
│   ├── BubbleMenu.tsx         # Mobile bubble menu overlay
│   ├── TransitionProvider.tsx # GSAP page wipe + preloader context
│   └── design/                # Components for archived _design route
│       ├── DesignNav.tsx
│       ├── DesignCursor.tsx
│       ├── FisheyeHero.tsx
│       ├── HorizontalScroll.tsx
│       └── ProjectCard.tsx
│
├── public/
│   ├── CNAME                  # Custom domain: ryyansafar.site
│   ├── script.js              # Cursor, tilt, Konami code, snake game, skills physics
│   ├── RyyanSafar_Resume.pdf  # Resume (served at /RyyanSafar_Resume.pdf)
│   ├── tinkerhublogo.png      # TinkerHub Foundation logo
│   └── assets/
│       ├── rs-monogram.png
│       ├── ryyan-safar-poster.png
│       ├── swiss-grid.png
│       ├── code-craft.png
│       └── freelance-strip.png
│
├── global.d.ts                # TypeScript: PNG module + requestIdleCallback
├── next.config.ts             # Static export, unoptimized images, dev origins
├── lib/
│   └── firebase-admin.ts      # Firebase Server-side initialization
├── app/
│   └── actions/
│       └── like.ts              # Like counter Server Action
└── .gitignore
```

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Main portfolio — projects, experience, contact |
| `/design` | Editorial web design gallery — horizontal scroll on desktop, vertical on mobile |
| `/design/components` | Component showcase — coming soon |
| `/design/wallpapers` | Wallpaper collection — coming soon |

---

## Design Systems

### Main Portfolio (`/`)

| Token | Value | Role |
|-------|-------|------|
| `--bg-color` | `#050505` | Page background |
| `--text-primary` | `#ffffff` | Body text |
| `--text-secondary` | `#888888` | Muted text |
| `--accent-color` | `#FFDD00` | Primary amber accent |
| `--accent-alt` | `#FFB800` | Secondary amber |
| Display font | Bebas Neue / Anton | Large headings |
| UI font | Space Grotesk | Body, labels, nav |
| Mono font | JetBrains Mono | Code, terminal text |

### Design Gallery (`/design`)

| Token | Value | Role |
|-------|-------|------|
| Background | `#fbf9f4` | Warm paper base |
| Text | `#1b1c19` | Near-black body |
| Gold | `#f7c533` | Stamp, highlights |
| Green | `#a8e060` | Terminal accent |
| Ember | `#c04b0c` | Warm CTA |
| Lime | `#b4ff5a` | Obsidian panel accent |
| Title font | Barrio (cursive) | Panel display titles |
| Editorial font | Epilogue 900 | Section headings |
| UI font | Space Grotesk | Labels, tags, meta |

---

## Features

| Feature | Details |
|---------|---------|
| **Preloader** | Inline `<script>` in `layout.tsx` fires before React hydration — prevents stuck states on mobile |
| **Custom cursor** | Smooth lerp follow in `script.js`, hidden on touch devices |
| **Page transitions** | GSAP 7-strip horizontal wipe via `TransitionProvider.tsx` |
| **Scroll reveals** | `IntersectionObserver` on `.reveal-up` / `.reveal-text` — no GSAP overhead |
| **Skills physics** | Matter.js canvas in `script.js` — tag bubbles with gravity and collision |
| **Card tilt** | `mousemove` → CSS `perspective` / `rotateX` / `rotateY` on project cards |
| **Design gallery** | **Technical Primitive Gallery:** A collection of highly-tuned UI components.<br>- **Persistent Likes:** Each component tracks community likes via Firestore.<br>- **Magnetic Interactions:** Every element responds to the mouse with custom physics. |
| **Konami code** | `↑↑↓↓←→←→BA` — hidden snake mini-game |
| **Lite mode** | `localStorage` flag — reduces animation overhead |
| **Mobile support** | Design gallery: portrait (vertical scroll) + landscape (compact) responsive layouts |

---

## Development

```bash
npm install
npm run dev
# → http://localhost:3000
```

**Test on a phone** (same network):

```bash
# macOS — get local IP
ipconfig getifaddr en0

# Then visit http://<your-ip>:3000 on your phone
```

The dev server allows connections from `192.168.*` and `10.*` (see `next.config.ts`).

---

## Build

```bash
npm run build
# Outputs fully static site to out/
```

Every page is exported as a plain HTML file. No Node.js server is required at runtime.

---

1. Connect GitHub repository to Vercel.
2. Add Firebase Environment Variables (see `.env.local`).
3. Vercel automatically builds and deploys on every push.

> **Note:** Static export (`output: "export"`) has been removed to support Server Actions for the Like button.

> **next.config.ts flags:**
> - `output: "export"` — enables static export mode
> - `images.unoptimized: true` — required without an image optimization server
> - `allowedDevOrigins` — allows phones on the local network to access the dev server

---

## Notes

- `app/_design/` is a fully archived prior iteration of the design portfolio. Excluded from routing by the `_` prefix. Kept for future reference — do not delete.
- `public/script.js` is loaded `afterInteractive` and handles DOM interactions that belong outside React (cursor, tilt, canvas game, Konami sequence).
- The `/design` route re-exports `app/archive/gallery/page.tsx` to separate the URL from the implementation cleanly.
- The design gallery lazy-loads all site iframes via `IntersectionObserver` with `rootMargin: '0px 100% 0px 100%'` — adjacent panels preload before the user scrolls to them.
