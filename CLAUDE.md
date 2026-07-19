# Portfolio — Abrar (abrarulhoque.com)

React 19 + Vite portfolio, redesigned (Jul 2026) as a 3D "motherboard" experience with three.js / @react-three/fiber. Concept: the site is a PCB — visitor scrolls and the camera glides over districts (hero → about/PWR → skills breadboard → project modules + GitHub repo skyline → XP bus → gold edge connector = contact).

## Architecture

- **Scroll owns the camera.** Native page scroll → piecewise-linear progress over `section[data-board]` offsets (`App.jsx`) → damped CatmullRom curve sampling (`three/CameraRig.jsx`). No WASD/orbit. Waypoints + all board coordinates live in `three/layout.js` (single source of truth).
- **DOM is the truth.** All real content is semantic HTML in `components/Sections.jsx`, styled as glass cards over the fixed canvas. Content data centralized in `data/content.js` (projects, skills incl. skill→project mapping, services, experience, EmailJS ids, socials).
- **Real GitHub data.** `npm run fetch-data` (scripts/fetch-github.mjs) → `src/data/github.json` (committed; builds never hit the API). Repo skyline height = log(sizeKb), color = language. Boot log stats come from this file too. Re-run occasionally to refresh the skyline.
- **Boot overlay** (`components/BootOverlay.jsx`) is the loading screen: POST-style log of real stats. Skippable (Enter/Esc/button); skipped automatically on deep links (#section), repeat session visits, and reduced-motion.
- **Device tiers** (`utils/deviceTier.js`): high = bloom + 1.75 dpr; lite (mobile/low-power) = no post-processing; off (no WebGL / reduced-motion) = CSS schematic fallback, content fully readable. Tier shown in HUD as FID:HIGH chip.
- **Interactions:** hover skill chip (DOM or 3D) → `focusSkillRef` (plain ref, no React state churn) → that skill's traces + linked project modules glow. Click 3D module → scrolls its DOM card into view. EXPRESS button = fast ride to #contact.
- Scene is lazy-loaded (`lazy(() => import("./three/Scene"))`) so three.js (~307KB gz) stays off the critical path.

## Gotchas

- Trace ribbons are custom BufferGeometry with uv.x = path distance; pulse shader marches on that. 45° chamfered corners like real PCB routing (`three/Traces.jsx`).
- drei `<Text>` needs the bundled TTF (`assets/fonts/JetBrainsMono-Bold.ttf`) — troika can't read woff2.
- `#home` must never count as a deep link (would skip boot forever since IntersectionObserver used to write it; now home clears the hash instead).
- Old 2D site was replaced entirely (commit `57e3c02` is the last 2D version).
- EmailJS: publicKey 1D8ANMO5otmU-UCd8, service_vkc229v, template_iy3g2n1.
- Design tokens in `index.css` — use vars, never hardcode colors.

## V2 experiment — the self-compiling portfolio (/v2.html)

Second concept living alongside v1 as a separate Vite MPA entry (`v2.html` → `src/v2/`). v1 untouched except a `V2β` chip in the HUD linking over.

- **Concept:** the site compiles itself on load. A terminal streams a real build log (repo names, commits, languages) and each printed line snaps that repo's building up in a 3D skyline. Height = commits (log₂), footprint = file count (log₂), color = language. Oldest repo (`portfolio`, 2022) sits at the center of a golden-angle spiral with a gold ABOUT ring; city grows outward chronologically.
- **Data:** `npm run fetch-data-v2` (needs `GITHUB_TOKEN=$(gh auth token)` — ~160 API calls) → `src/data/github-v2.json` (commits, files, README excerpts per repo). Merged with github.json in `src/v2/cityData.js` (also owns spiral layout + beacon position).
- **Phases** (`V2App.jsx`): boot (full-screen terminal) → compile (terminal docks, buildings rise per log line, camera descends) → city (OrbitControls auto-orbit, HUD + legend dock). Skip button/Enter/Esc always available; repeat session visits skip automatically (`abrar-v2-built` in sessionStorage).
- **Interactions:** legend hover → language focus (others dim); click building → camera dives + repo panel (stats, README excerpt, GitHub link); teal CONTACT beacon → EmailJS form (reuses v1 ContactForm, styles duplicated in v2.css); dock tabs LEGEND/FEATURED/ABOUT. tier 'off' → FallbackV2 (flat log + commit bar chart).
- **Hard-won gotchas:** (1) anything that suspends (drei `<Text>` fonts) MUST be inside a `<Suspense>` *inside* the Canvas — otherwise suspension unmounts the Canvas, kills the WebGL context, and the EffectComposer crashes with "Cannot read properties of null (reading 'alpha')". (2) `InstancedMesh` caches `boundingSphere` from pre-animation matrices and then every raycast misses — preset `body.boundingSphere` covering the city (Buildings.jsx). (3) skip/repeat visits enter city phase with the camera still at boot height — Rig jump-cuts to the overview when `camera.y > 32`.

## Workflow

- `git pull` before changes, push after (repo rule). Commits under abrarulhoque, no AI credit.
- Browser testing: agent-browser skill.
