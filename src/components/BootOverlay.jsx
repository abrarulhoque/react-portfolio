import { useEffect, useMemo, useState } from "react";
import github from "../data/github.json";
import { meta } from "../data/content";

// The loading screen IS the intro: a POST-style boot log of real data.
// Always skippable — Enter/Esc/Space or the button.
export default function BootOverlay({ onDone }) {
  const lines = useMemo(() => {
    const langs = Object.keys(github.languages);
    const mb = Math.round(github.totalKb / 1024);
    return [
      `ABRAR.SYS BIOS ${meta.boardRev} — POWER-ON SELF-TEST`,
      `> mounting github://${github.user} .......... OK`,
      `> repos detected ........................ ${github.repoCount}`,
      `> languages linked ...... ${langs.slice(0, 3).join(" · ")} +${langs.length - 3}`,
      `> codebase indexed ................... ${mb} MB`,
      `> power rail ................ ONLINE since 2022`,
      `> lighthouse budget ..................... 92+`,
      `> compiling board ${meta.boardRev} ............ READY`,
    ];
  }, []);

  const [shown, setShown] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (leaving) return;
    if (shown >= lines.length) {
      const t = setTimeout(finish, 450);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 250 : 270);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, leaving]);

  function finish() {
    setLeaving(true);
    try {
      sessionStorage.setItem("abrar-booted", "1");
    } catch {
      /* private mode */
    }
    setTimeout(onDone, 420);
  }

  useEffect(() => {
    const onKey = (e) => {
      if (["Enter", "Escape", " "].includes(e.key)) finish();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`boot-overlay ${leaving ? "boot-overlay--leaving" : ""}`}>
      <div className="boot-terminal" role="status" aria-live="polite">
        {lines.slice(0, shown).map((l, i) => (
          <p key={i} className={`boot-line ${i === 0 ? "boot-line--title" : ""}`}>
            {l}
          </p>
        ))}
        {shown < lines.length && <span className="boot-caret" />}
        <div className="boot-progress">
          <span
            className="boot-progress-fill"
            style={{ width: `${(shown / lines.length) * 100}%` }}
          />
        </div>
      </div>
      <button className="boot-skip" onClick={finish}>
        SKIP BOOT ⏎
      </button>
    </div>
  );
}
