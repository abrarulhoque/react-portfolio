# Lunar redesign verification

Checked locally on September 14, 2026, using Chromium through agent-browser.

## Build and code

- `npm run lint`: passed across the repository.
- `npm run build`: passed for the homepage and legacy city entry.
- `git diff --check`: passed.
- Vite reports its standard large-chunk warning for the lazy-loaded Three.js / React Three Fiber bundle (about 241 KB gzip). The homepage's own JavaScript is about 9.5 KB gzip, plus shared React runtime; content does not wait for the scene.
- Existing source photo preserved. Delivery JPEG is approximately 248 KB; lunar texture approximately 448 KB.

## Browser checks

- Desktop 1440 × 1000, tablet 768 × 1024, mobile 390 × 844, and narrow 320px layout: no page-level horizontal overflow.
- Desktop and full mobile screenshots inspected. Refined the dealer-portal and pendant-light illustrations after checking mobile layout.
- Supplied portrait loads in both hero avatar and about section.
- Internal section links target existing IDs; direct `#services` navigation lands on the services section.
- Mobile menu opens and closes, including Escape; navigation reports its expanded state.
- Service disclosure opens and exposes its content.
- All four case-study dialogs open in the production preview with focus inside the dialog. Escape restores focus to the project button and restores page scrolling.
- Email and WhatsApp links point to the contact details in the source pack. No messages were sent; external inbox delivery was not tested.
- Pause persists after reload. Desktop screenshots taken one second apart while paused were byte-identical.
- Reduced-motion preference sets the page to paused, disables the motion button, and yields zero running DOM animations.
- Forced `WEBGL_lose_context` removes the canvas and leaves the textured fallback moon and readable content in place.
- Main text color contrast calculations against the background: body 8.19:1; primary 17.26:1; secondary labels 6.65:1. This is not a full accessibility certification.
- No browser runtime errors during the normal development and production-preview flows.

## Content and scope

The source pack supplies the project facts and historical aggregate counts. Pending client identities remain anonymous on the homepage. Review counts and uncertain employment / education claims are omitted. Illustrations are labeled; they are not presented as client screenshots.

The homepage is local and has not been deployed. Physical mobile devices and cross-browser Safari/Firefox behavior were not tested. The older `/v2.html` experiment remains separate with its original base stylesheet and historical content.
