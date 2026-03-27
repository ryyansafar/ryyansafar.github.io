# 🏗 Developer Documentation

This document provides a technical deep-dive into the architecture, design systems, and integration patterns used in the Ryyan Safar Portfolio.

---

## 🛠 Tech Stack
- **Framework:** Next.js 16.2.x (App Router)
- **Deployment:** Vercel (Serverless/SSR)
- **Styling:** Tailwind CSS v4 + Vanilla CSS Modules
- **Animations:** Framer Motion + GSAP (ScrollTrigger)
- **Database:** Firebase Firestore (managed via `firebase-admin`)

---

## 📂 Project Structure

```text
├── app/
│   ├── actions/          # Next.js Server Actions (e.g., likes logic)
│   ├── design/
│   │   └── components/   # Technical primitive gallery
│   └── page.tsx          # Main Portfolio (Immersive scroll)
├── components/           # Reusable UI primitives (PillNav, LikeButton)
├── lib/                  # Backend utilities (Firebase, specialized logic)
├── public/               # Static assets & global custom JS
└── global.d.ts           # TS definitions for custom modules
```

---

## 🔥 Firebase & Likes System

The "Likes" system is a per-component tracking feature designed to show community engagement for specific technical primitives.

### Implementation Details:
1. **Database:** Firestore collection `component_likes`.
2. **Server-Side:** Initialized in `lib/firebase-admin.ts` using a Service Account.
3. **Actions:** `app/actions/like.ts` handles atomic increments via Firestore transactions.
4. **Client-Side:** `LikeButton.tsx` implements **Optimistic UI**, updating the count visually before the server confirms, ensuring a "premium" snappy feel.

### Debugging Credentials:
If you see `Database not initialized`, ensure your `.env.local` contains:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (Must include `-----BEGIN...` and `\n` characters).

---

## 🎨 Animation Guidelines

We follow a **"Motion-First"** design philosophy:
- **Scroll Storytelling:** Use GSAP ScrollTrigger for heavy 3D or layout-driven reveals.
- **Micro-interactions:** Use Framer Motion for buttons, cards, and state transitions.
- **Physics-Based:** Prefer Spring physics (`stiffness`, `damping`) over duration-based easing for a natural feel.

---

## 📄 Page Documentation

### 1. Home (`/`)
- The main landing page using a custom scroll-rig.
- High-fidelity typography hierarchy using `Clash Display` and `Barrio`.
- Contact section with "Buy Me a Coffee" and local magnetic interactions.

### 2. Components Gallery (`/design/components`)
- An interactive collection of UI primitives.
- Features real-time parameter tuning (e.g., spring physics adjustments).
- Integrated like counter for each card.

### 3. Archive/Gallery (`/archive/gallery`)
- A grid of previous design works.
- Uses `IntersectionObserver` for lazy-loading previews.

---

## 🚀 Deployment
Since we use **Server Actions**, this project must be deployed to a platform that supports Node.js runtimes (like Vercel). Static exports are **not** supported for the Likes feature.
