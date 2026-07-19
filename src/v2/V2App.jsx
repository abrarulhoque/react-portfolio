import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { getDeviceTier } from "../utils/deviceTier";
import { buildings } from "./cityData";
import { makeBuildScript } from "./buildScript";
import Terminal from "./Terminal.jsx";
import HudV2 from "./HudV2.jsx";
import { RepoPanel, ContactPanel } from "./Panels.jsx";
import FallbackV2 from "./FallbackV2.jsx";

// three.js stays off the critical path — the terminal starts typing
// immediately while the scene chunk loads behind it.
const CityScene = lazy(() => import("./three/CityScene.jsx"));

export default function V2App() {
  const tier = useMemo(getDeviceTier, []);
  const script = useMemo(makeBuildScript, []);

  // second visit in the same tab? straight to the finished city
  const alreadyBuilt = useMemo(() => {
    try {
      return sessionStorage.getItem("abrar-v2-built") === "1";
    } catch {
      return false;
    }
  }, []);

  const [phase, setPhase] = useState(alreadyBuilt ? "city" : "boot"); // boot | compile | city
  const [shown, setShown] = useState(alreadyBuilt ? script.length : 0);
  const builtRef = useRef(alreadyBuilt ? buildings.length : 0); // read per-frame by the scene

  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [focusLang, setFocusLang] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    if (tier === "off" || phase === "city" || shown >= script.length) return;
    const line = script[shown];
    const t = setTimeout(() => {
      if (line.repo != null) builtRef.current = line.repo + 1;
      if (line.marker === "grid") setPhase("compile");
      setShown((s) => s + 1);
      if (line.marker === "done") {
        markBuilt();
        setTimeout(() => setPhase("city"), 700);
      }
    }, line.ms);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, phase, tier]);

  function markBuilt() {
    try {
      sessionStorage.setItem("abrar-v2-built", "1");
    } catch {
      /* private mode */
    }
  }

  function skip() {
    builtRef.current = buildings.length;
    setShown(script.length);
    setPhase("city");
    markBuilt();
  }

  useEffect(() => {
    if (phase === "city") return;
    const onKey = (e) => {
      if (["Enter", "Escape", " "].includes(e.key)) skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Esc closes panels once the city is live
  useEffect(() => {
    if (phase !== "city") return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setSelected(null);
        setContactOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  if (tier === "off") return <FallbackV2 script={script} />;

  return (
    <div className="v2-root">
      <Suspense fallback={null}>
        <CityScene
          tier={tier}
          phase={phase}
          builtRef={builtRef}
          focusLang={focusLang}
          selected={selected}
          onSelect={(b) => {
            setSelected(b);
            setContactOpen(false);
          }}
          onHover={setHovered}
          onContact={() => {
            setContactOpen(true);
            setSelected(null);
          }}
        />
      </Suspense>

      <Terminal lines={script} shown={shown} phase={phase} />

      {phase !== "city" && (
        <button className="v2-skip" onClick={skip}>
          SKIP BUILD ▸▸
        </button>
      )}

      {phase === "city" && (
        <HudV2
          tier={tier}
          focusLang={focusLang}
          onFocusLang={setFocusLang}
          onContact={() => {
            setContactOpen(true);
            setSelected(null);
          }}
          onSelectRepo={(b) => {
            setSelected(b);
            setContactOpen(false);
          }}
        />
      )}

      {phase === "city" && hovered && !selected && (
        <div className="v2-hoverchip" aria-hidden="true">
          <span className="v2-hoverchip-dot" style={{ background: hovered.color }} />
          {hovered.name} · {hovered.language || "—"} · {hovered.commits} commits ·{" "}
          {hovered.files} files
        </div>
      )}

      {selected && <RepoPanel repo={selected} onClose={() => setSelected(null)} />}
      {contactOpen && <ContactPanel onClose={() => setContactOpen(false)} />}
    </div>
  );
}
