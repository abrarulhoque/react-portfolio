# Abrar's portfolio

A space-inspired portfolio for Abrarul Hoque, an independent WordPress, WooCommerce, and Shopify developer, with an interactive Earth showing his client countries. React 19, Vite, and React Three Fiber.

## Run locally

```sh
npm install
npm run dev
```

```sh
npm run lint
npm run build
npm run preview
```

The homepage is `/`. The earlier city experiment remains available at `/v2.html` with its own original base styles.

## Editing

- `src/App.jsx`: page sections, navigation, project dialogs, motion controls, and contact links.
- `src/lunar/content.js`: curated projects, services, and frequently asked questions.
- `src/lunar/ProjectVisual.jsx`: selects each project's animated workflow illustration.
- `src/lunar/WorkflowPreview.jsx`: shared hover playback, timers, visibility cleanup, and case-study play/stop/replay controls.
- `src/lunar/{Cad,Shipping,Dealer,Trade}Workflow.jsx` and `workflows.css`: four illustrative project workflows, with explicitly marked example prices.
- `src/lunar/WorldGlobe.jsx`: pointer/touch/keyboard controls, country tooltips, searchable country dialog, and fallback.
- `src/lunar/EarthScene.jsx`: lazy-loaded Three.js globe, country textures, geographic picking, and lighting.
- `src/lunar/countrySales.js`: owner-supplied September 2026 Fiverr snapshot: 47 countries / 771 mapped sales; 773 dashboard completed orders. The two unassigned orders are not attributed to a country.
- `src/lunar/globe.css`: responsive globe and country-list styling.
- `scripts/build-globe-map.mjs`: generates local geography and the static Earth fallback from Natural Earth via world-atlas. Run `npm run build-globe` after changing country coverage; update the snapshot assertions when intentionally replacing the dataset.
- `src/index.css` and `src/App.css`: typography, tokens, responsive layout, and animation.
- `content/portfolio-content-2026-09.md`: owner-provided source material. Items marked VERIFY or NAME PENDING are not publication approvals.
- `public/images/abrar-portrait.jpg`: web copy of the owner's `new_profile.png`.
- `docs/ASSET-CREDITS.md`: geography and image attribution.
- `docs/lunar-design.md`: visual and motion decisions.

Drag the Earth with a mouse or swipe horizontally on touch screens. Hover or tap a highlighted country for sales. The country list provides searchable, keyboard-accessible data and rotates the globe to a selection. Arrow keys rotate the focused globe; Home resets it. Vertical touch gestures retain native page scrolling. Mouse-wheel zoom is intentionally absent.

Automatic rotation pauses on hover, keyboard focus, and selection. The render loop stops offscreen, in a hidden tab, when paused, and under reduced-motion preferences. The pause preference persists locally. A static geographic Earth and the country list remain available without WebGL or after context loss. Geography is served locally; the browser needs no map provider, API key, or external geographic request. Map-generation libraries are development-only dependencies.

Hover a project card to play its workflow once. Leaving resets it; holding the pointer leaves the completed state visible. Case studies provide explicit play, stop, and replay controls for touch and keyboard users. Playback respects the global pause and reduced-motion settings, stops offscreen or in a hidden tab, and cancels pending stages. These are local illustrations, with no uploads, login requests, or checkout submissions.

Fiverr's Choice and repeat-buyer recognition appear below the hero location line and link to the owner's Fiverr profile. The Choice label refers to the supplied WooCommerce gig screenshot.

Contact is through visible email and WhatsApp links. The homepage does not submit an EmailJS form. The original contact component remains available to the legacy city experiment.

## Verification

See `docs/verification-2026-09-20.md` for the interactive Earth and animated workflow checks, and `docs/verification-2026-09-14.md` for the preceding redesign.

## Hosting

Vercel project `react-portfolio` is connected to the `main` branch of `abrarulhoque/react-portfolio`. The primary domain is `www.abrarulhoque.com`; `abrarulhoque.com` redirects to it. Both use Vercel's nameservers. Local preview checks and live deployment checks are separate; a successful local build alone does not confirm publication.
