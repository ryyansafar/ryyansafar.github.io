# Ryyan Safar — Portfolio

A fast, animated portfolio featuring projects, experience, skills, and a performant hero with particles and an SVG wave.

Live site: https://ryyansafar.github.io/

## Features
- Animated hero: SVG wave and lightweight particle background
- Smooth navigation with active section highlighting
- Skills with animated progress bars (driven by CSS variable `--bar-width`)
- Major Projects, Education, Experience, Volunteering, Certifications, Contact
- Custom cursor, subtle 3D tilt on cards (gentle in Full mode; off in Lite)
- Tip pill and Back-to-top button always available
- Full/Lite performance toggle with persistence

## Performance modes
- Full (default on desktop): animations on (throttled for smoothness)
- Lite: animations and heavy effects disabled

Toggle via the button in the navbar. The current choice is saved in `localStorage` under the key `perfMode` and applied on reload. You can also force the choice by clearing localStorage from DevTools.

## Quick start (local)
1. Clone or download this repository
2. Open `index.html` in your browser
3. For best results, use a local web server if you load external assets frequently:
   - Python 3: `python3 -m http.server 8000`
   - Node: `npx serve .`

## Deploy to GitHub Pages
1. Push to the `main` branch
2. In GitHub → Settings → Pages → Build and deployment: select `GitHub Actions` or `Deploy from a branch` (`main`/`root`)
3. Your site will be available at `https://<username>.github.io/`

## File structure
- `index.html` — Markup for sections, nav, tip pill, and buttons
- `style.css` — Styles, CSS variables, responsive rules
- `script.js` — Animations, particles, tilt, counters, and performance toggle
- `Ryyan_Safar_Resume-24.pdf` — Resume (linked from the hero)

## Customization
- Colors: update CSS variables at the top of `style.css` (e.g., `--primary`, `--accent`)
- Skills: edit labels in `index.html` and set their values via `data-width` (JS sets `--bar-width`)
- Project cards: add/remove items under the Projects section in `index.html`
- Tilt intensity: adjust in `script.js` where `intensity` is computed for `.proj-item`

## Troubleshooting
- Lite/Full button does nothing
  - Hard refresh (Cmd/Ctrl+Shift+R); cache-busted assets are referenced via `?v=` query
  - Check DevTools → Application → Local Storage → `perfMode` (should be `lite` or `full`)
- Skill bars don’t animate
  - Scroll the About section into view once (IntersectionObserver triggers the animation)
  - Ensure `script.js` is loaded and there are no console errors
- Particles not visible
  - Lite mode disables heavy visuals; switch to Full

## License
MIT — feel free to adapt with credit.
# Ryyan Safar Portfolio Website

A super fancy and unique personal portfolio website for Ryyan Safar, a third-year Electronics and Communication Engineering student at RSET, IEEE volunteer, and Tinkerhub campus ambassador.

## Features
- Modern, responsive design
- Hero section with unique visuals
- About, Experience, Volunteering, and Contact sections
- Easy to customize with your own details
+ Downloadable resume button and in-page resume section

## Deploying to GitHub Pages
1. Fork or clone this repository.
2. Push your code to a GitHub repository named `<your-username>.github.io`.
3. Go to your repository settings on GitHub.
4. Under **Pages**, set the source branch to `main` (or `master`) and the root directory (`/`).
5. Your site will be live at `https://<your-username>.github.io/`.

## Adding Your Resume
- Replace `resume.pdf` in the project folder with your own PDF resume.
- The 'Download Resume' button in the hero section will automatically link to your file.

---

Feel free to customize the content and styles to make it truly yours! 