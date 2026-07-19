import { sections } from "../data/content";

// Persistent chrome: brand, section nav, fidelity confession, express lane.
export default function Hud({ activeSection, tier }) {
  return (
    <>
      <header className="hud">
        <a href="#home" className="hud-brand">
          <span className="hud-dot" aria-hidden="true" />
          ABRAR.SYS
          <span className="hud-rev">REV 2.0</span>
        </a>

        <nav className="hud-nav" aria-label="Sections">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={activeSection === s.id ? "active" : ""}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="hud-right">
          <span className="hud-tier" title="Render fidelity picked for your device">
            FID:{tier.toUpperCase()}
          </span>
          <a
            href="/v2.html"
            className="hud-tier"
            title="Experiment: the self-compiling portfolio"
          >
            V2β
          </a>
          <a href="#contact" className="hud-express">
            EXPRESS <span aria-hidden="true">⏵</span>
          </a>
        </div>
      </header>

      <nav className="dotnav" aria-label="Section shortcuts">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`dotnav-dot ${activeSection === s.id ? "active" : ""}`}
            aria-label={s.label}
          >
            <span className="dotnav-label">{s.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
