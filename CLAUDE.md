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

## Workflow

- `git pull` before changes, push after (repo rule). Commits under abrarulhoque, no AI credit.
- Browser testing: agent-browser skill.
