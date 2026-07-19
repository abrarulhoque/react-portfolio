import emailjs from "@emailjs/browser";
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import BootOverlay from "./components/BootOverlay";
import Hud from "./components/Hud";
import Sections from "./components/Sections";
import { emailjsConfig, sections } from "./data/content";
import { getDeviceTier } from "./utils/deviceTier";

// keep three.js out of the critical bundle — the boot log covers the load
const Scene = lazy(() => import("./three/Scene"));

const SECTION_IDS = sections.map((s) => s.id);

function App() {
  const tier = useMemo(getDeviceTier, []);
  const scrollRef = useRef(0);
  const focusSkillRef = useRef(null);
  const [activeSection, setActiveSection] = useState("home");
  const [booted, setBooted] = useState(() => {
    if (tier === "off") return true;
    const hash = window.location.hash.slice(1);
    const deepLinked = SECTION_IDS.includes(hash) && hash !== "home";
    let seen = false;
    try {
      seen = sessionStorage.getItem("abrar-booted") === "1";
    } catch {
      seen = false;
    }
    return deepLinked || seen;
  });

  useEffect(() => {
    emailjs.init({ publicKey: emailjsConfig.publicKey });
  }, []);

  // Scroll → board progress. Piecewise-linear over the real section offsets so
  // camera waypoint i is hit exactly when section i tops the viewport, even if
  // sections have uneven heights.
  useEffect(() => {
    let tops = [];
    const measure = () => {
      tops = [...document.querySelectorAll("section[data-board]")].map(
        (el) => el.offsetTop
      );
    };
    const onScroll = () => {
      if (!tops.length) return;
      const y = window.scrollY;
      const n = tops.length;
      let i = 0;
      while (i < n - 1 && y >= tops[i + 1]) i++;
      const span = (tops[i + 1] ?? tops[i] + 1) - tops[i];
      const local = Math.min(1, Math.max(0, (y - tops[i]) / span));
      scrollRef.current = Math.min(1, (i + (i < n - 1 ? local : 1)) / (n - 1));
    };
    measure();
    onScroll();
    const onResize = () => {
      measure();
      onScroll();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    // re-measure once images/fonts settle layout
    const t = setTimeout(onResize, 1200);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, []);

  // Active section tracking + shareable URLs (deep-linkable camera states)
  useEffect(() => {
    const els = [...document.querySelectorAll("section[data-board]")];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            history.replaceState(
              null,
              "",
              entry.target.id === "home"
                ? window.location.pathname
                : `#${entry.target.id}`
            );
          }
        }
      },
      { threshold: 0.4 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Deep link: land directly on the linked section, no intro replay
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (SECTION_IDS.includes(id) && id !== "home") {
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
      });
    }
  }, []);

  const onProjectClick = (id) => {
    const el = document.getElementById(`project-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    el.classList.add("project-card--flash");
    setTimeout(() => el.classList.remove("project-card--flash"), 1600);
  };

  return (
    <div className="app">
      {tier !== "off" ? (
        <Suspense fallback={null}>
          <Scene
            scrollRef={scrollRef}
            focusSkillRef={focusSkillRef}
            tier={tier}
            onProjectClick={onProjectClick}
          />
        </Suspense>
      ) : (
        <div className="schematic-bg" aria-hidden="true" />
      )}

      <Hud activeSection={activeSection} tier={tier} />

      {!booted && <BootOverlay onDone={() => setBooted(true)} />}

      <main className={`content ${booted ? "content--ready" : ""}`}>
        <Sections
          onSkillHover={(id) => {
            focusSkillRef.current = id;
          }}
          onSkillLeave={() => {
            focusSkillRef.current = null;
          }}
        />
      </main>
    </div>
  );
}

export default App;
