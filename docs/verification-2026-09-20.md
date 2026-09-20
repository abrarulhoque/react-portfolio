# Interactive Earth and project workflow verification

20 September 2026. Pre-deployment production build served at `http://127.0.0.1:4177/`.

## Delivered

- Replaced the hero moon with a shaded Earth. The portfolio typography, palette, content flow, and legacy `/v2.html` entry remain in place.
- Country fills and ray-picked tooltips use actual Natural Earth geography. All 47 owner-supplied countries are present, with exactly 771 mapped sales.
- Searchable native dialog lists every country and count. Selecting a country centers it and adds a small surface marker, including countries that are difficult to target manually. Bangladesh is labeled as the home base.
- Dashboard proof uses 773 **completed orders**, separately from the map's 771 sales. No country is assigned the unexplained two-order difference. This data is a supplied snapshot, not a live Fiverr integration.
- Mouse drag, horizontal touch drag, arrow keys, Home reset, pause/resume, reduced motion, and static fallback. Vertical touch movement scrolls the page.
- Map assets are local and reproducible with `npm run build-globe`. Map-generation packages are development-only. The globe reuses the existing lazily loaded Three.js runtime.

## Checks

- `npm run lint`, `npm run build`, and `git diff --check` passed. Vite retains its warning about the existing shared Three.js chunk size.
- Build-time geographic coverage validation: all 47 ISO numeric IDs exist in the 241-feature atlas; unique country records and 771-sales sum match the supplied table.
- Production Chromium browser: modal has 47 rows totaling 771. Escape closes it and restores focus to its trigger.
- Selecting United States, Bangladesh, Vietnam, and Trinidad and Tobago rotates to the correct geography. Moving the pointer to the resulting globe center picks the matching country and sales.
- Real mouse input changes the globe view, clears a pinned country on drag, and releases pointer capture after mouseup.
- Screenshot comparisons: paused globe remains unchanged; arrow-key rotation and automatic rotation change its rendered view; Home/reset works.
- Responsive geometry checks at 1920, 1440, 1280, 1100, 1024, 1000, 820, 768, 600, 390, and 320 pixels: no page-level horizontal overflow; controls remain inside the viewport; stacked layouts have no hero-copy/globe overlap.
- CDP touch emulation at 390 × 844: horizontal drag changes the rendered globe; vertical swipe increases native page scroll.
- Emulated reduced motion disables automatic animation while country selection remains functional.
- Actual `WEBGL_lose_context` loss reveals the static Earth and leaves all 47 country records accessible. Initial-load WebGL denial also uses the fallback without mounting a Canvas; ordinary reload restores the interactive globe.
- Country search returns Bangladesh with its three sales and home-base label. A nonmatching search shows an explicit empty state.
- Axe 4.12.1: globe region has zero violations and zero incomplete checks. Country dialog has zero violations; the automated contrast check is inconclusive for some native-dialog text, so colors were checked against the solid dialog background separately.
- No page runtime errors observed. The existing Three.js clock deprecation warning is non-fatal.

## Animated project workflows

Completed and visually checked sequentially:

1. Laserbend: drag a CAD file into the drop zone, inspect geometry and material options, display an example quote, proceed through checkout, and confirm the order.
2. Ruckaway: split a 30 kg cart into two 15 kg parcels, compare two carriers, choose a rate, and carry that selection into checkout.
3. Dealer portal: resize a garage door, change its finish, apply an example dealer price, create a PDF quote, and hand the order to production as XML.
4. Tom Rossau: change the retail language, sign in as a retailer, display an example trade price, complete wholesale checkout, and show email confirmation.

All illustrations identify themselves as demos. Amounts are examples, not published client pricing. CAD files, credentials, and checkout controls are visual-only; no real requests or transactions occur.

- Production Chromium: each card starts on mouse hover; leaving resets it and cancels timers. Only the hovered card plays. No nested buttons.
- Card, illustration, text, and illustrative action bounds checked against their actual section containers at 320, 360, 375, 390, 414, 440, 480, 600, 601, 768, 820, 1024, 1100, and 1440 pixels. Every row has equal outer gutters.
- Fixed project-card clipping caused by the illustration's 320px minimum height transferring through its aspect ratio into an oversized minimum width. Zero-minimum grid tracks and an explicit 100% illustration width keep cards within the section. The earlier page-level overflow check missed this because the portfolio wrapper clips overflow; checks now compare child and parent bounds directly.
- All stages in every case study checked at 320 and 390 pixels, with touch emulation. No horizontal dialog scrolling or clipped actions. Explicit width prevents the illustration's minimum height and aspect ratio from widening the dialog.
- Manual play, stop, replay, Escape, and focus restoration to the originating card passed.
- Keyboard Enter opens a card and starts/stops its preview. Dialog playback is manual: moving over the Play button does not start the timeline before a click.
- Global pause cancels in-flight stages, and no delayed stages restart. Reduced motion leaves static illustrations and disables playback.
- All new animation code uses the existing React runtime, CSS transitions, and short local timers; no new runtime animation dependency.

## Domain diagnosis before publication

- `vercel domains inspect abrarulhoque.com`: purchased through Vercel, expires August 2027, current nameservers match intended Vercel nameservers, and both root and `www` belong to `react-portfolio`.
- System resolver, Cloudflare, Google, and authoritative Vercel DNS return addresses. Vercel-managed alias records are present; HTTPS certificates cover root and wildcard names.
- HTTP redirects to HTTPS; HTTPS root redirects to `https://www.abrarulhoque.com/`; final response is HTTP 200.
- The preceding moon portfolio initially rendered in both a clean Chromium session and the owner's existing Chrome tab. Direct navigation in the owner's Chrome then reproduced `ERR_CONNECTION_TIMED_OUT`, before the document loaded.
- Requests pinned to the domain's resolved edge addresses produced different results: several `216.150.*` addresses served HTTP 200 while others timed out or refused connections. This identifies an address-dependent connectivity issue from the current network, not a React rendering failure. The exact cause still needs confirmation; no DNS changes were made during these checks.
- Deeper Chrome DNS diagnostics and read-only firewall inspection were blocked by browser policy and automatic SelfControl protection review. No protective settings were changed or bypassed.

## Initial publication

- Commit `d700f75` was pushed to `main` and Vercel reported the production deployment Ready: `https://react-portfolio-px7dnhtof-abrarulhoques-projects.vercel.app`.
- Vercel attached the root domain, `www`, and the existing `react-portfolio-kappa-eosin-94.vercel.app` alias to that deployment.
- On `www.abrarulhoque.com`, the HTML, JavaScript, stylesheet, and geographic JSON were available. Downloaded entry assets and geography matched the local production build byte for byte. Browser DOM contained the globe, Fiverr recognition, and all four workflow previews.
- A subsequent small correction restricts hover playback to project cards so the dialog Play button remains under explicit user control.

## Limits

Feature checks used local Chromium, including emulated touch and reduced motion. Physical devices and Safari/Firefox are not verified. Geographic borders are inherited from the source dataset. The map reflects the supplied September 2026 sales snapshot. This document records the pre-deployment checks; publication requires separate live verification.
