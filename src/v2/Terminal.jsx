import { useEffect, useRef } from "react";

// Dumb display — V2App owns the timers. Full-screen during boot,
// docks to a corner console while the city compiles, gone once built.
export default function Terminal({ lines, shown, phase }) {
  const bodyRef = useRef(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown]);

  if (phase === "city") return null;

  return (
    <div
      className={`v2-terminal ${
        phase === "boot" ? "v2-terminal--full" : "v2-terminal--dock"
      }`}
    >
      <div className="v2-term-head">
        <span className="v2-term-dot" />
        abrar@sys — build.log
      </div>
      <div className="v2-term-body" ref={bodyRef} role="status" aria-live="polite">
        {lines.slice(0, shown).map((l, i) => (
          <p key={i} className={`v2-line${l.cls ? ` v2-line--${l.cls}` : ""}`}>
            {l.text}
          </p>
        ))}
        <span className="v2-caret" aria-hidden="true" />
      </div>
    </div>
  );
}
