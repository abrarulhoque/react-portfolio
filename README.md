# Abrar's portfolio

A lunar portfolio for Abrarul Hoque, an independent WordPress, WooCommerce, and Shopify developer. React 19, Vite, and React Three Fiber.

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
- `src/lunar/ProjectVisual.jsx`: project-specific schematic illustrations, explicitly labeled as illustrations.
- `src/lunar/MoonScene.jsx`: lazy-loaded lunar surface, orbital paths, satellite, and stars.
- `src/index.css` and `src/App.css`: typography, tokens, responsive layout, and animation.
- `content/portfolio-content-2026-09.md`: owner-provided source material. Items marked VERIFY or NAME PENDING are not publication approvals.
- `public/images/abrar-portrait.jpg`: web copy of the owner's `new_profile.png`.
- `docs/ASSET-CREDITS.md`: NASA moon texture attribution.
- `docs/lunar-design.md`: visual and motion decisions.

The moon responds subtly to pointer movement and desktop scrolling. Its render loop stops offscreen, in a hidden tab, when paused, and under reduced-motion preferences. The pause preference persists locally. A CSS sphere remains behind the WebGL scene so content and imagery survive a rendering failure.

Contact is through visible email and WhatsApp links. The homepage does not submit an EmailJS form. The original contact component remains available to the legacy city experiment.

## Verification

See `docs/verification-2026-09-14.md` for the redesign checks. This implementation is local; deployment and live-site verification are separate steps.
