import { useState } from "react";
import { meta, projects, experience, socials, stats } from "../data/content";
import { buildings, totals, oldest } from "./cityData";

const TABS = ["LEGEND", "FEATURED", "ABOUT"];

// Persistent chrome for the finished city: brand bar + the dock that
// decodes the skyline. The legend is the "skills" surface — hovering a
// language lights up every building made of it.
export default function HudV2({ tier, focusLang, onFocusLang, onContact, onSelectRepo }) {
  const [tab, setTab] = useState("LEGEND");
  const [open, setOpen] = useState(true);

  const langs = Object.entries(totals.languages);

  return (
    <>
      <header className="v2-hud">
        <a className="v2-brand" href="/v2.html">
          <span className="v2-brand-dot" aria-hidden="true" />
          ABRAR.SYS
          <span className="v2-brand-rev">V2 · SELF-COMPILING</span>
        </a>
        <div className="v2-hud-right">
          <span className="v2-chip" title="Render fidelity picked for your device">
            FID:{tier.toUpperCase()}
          </span>
          <a className="v2-chip v2-chip--link" href="/" title="Back to the motherboard">
            ◂ V1 BOARD
          </a>
          <button className="v2-contact-btn" onClick={onContact}>
            CONTACT ⏵
          </button>
        </div>
      </header>

      <aside className={`v2-dock ${open ? "" : "v2-dock--closed"}`}>
        <button
          className="v2-dock-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
        >
          {open ? "▾ HIDE" : "▴ DECODE THE SKYLINE"}
        </button>

        {open && (
          <>
            <nav className="v2-tabs" aria-label="Dock sections">
              {TABS.map((t) => (
                <button
                  key={t}
                  className={`v2-tab ${tab === t ? "v2-tab--active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t}
                </button>
              ))}
            </nav>

            {tab === "LEGEND" && (
              <div className="v2-dock-body" onMouseLeave={() => onFocusLang(null)}>
                <p className="v2-dock-hint">
                  height = commits · footprint = files · color = language.
                  hover a layer, click a building.
                </p>
                <ul className="v2-legend">
                  {langs.map(([lang, count]) => {
                    const b = buildings.find((x) => x.language === lang);
                    return (
                      <li key={lang}>
                        <button
                          className={`v2-legend-row ${
                            focusLang === lang ? "v2-legend-row--hot" : ""
                          }`}
                          onMouseEnter={() => onFocusLang(lang)}
                          onFocus={() => onFocusLang(lang)}
                          onClick={() => onFocusLang(focusLang === lang ? null : lang)}
                        >
                          <span
                            className="v2-legend-dot"
                            style={{ background: b?.color || "#3a4a46" }}
                          />
                          <span className="v2-legend-name">{lang}</span>
                          <span className="v2-legend-count">×{count}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <p className="v2-dock-total">
                  {totals.repoCount} modules · {totals.commits.toLocaleString()} commits ·{" "}
                  {totals.files.toLocaleString()} files
                </p>
              </div>
            )}

            {tab === "FEATURED" && (
              <div className="v2-dock-body">
                <p className="v2-dock-hint">
                  client work lives off-github — the shipped stuff:
                </p>
                <ul className="v2-featured">
                  {projects.map((p) => (
                    <li key={p.id} className="v2-featured-card">
                      <a href={p.link} target="_blank" rel="noreferrer">
                        <strong>{p.title}</strong>
                        <span className="v2-featured-desc">{p.description}</span>
                        <span className="v2-featured-tech">
                          {p.tech.join(" · ")} ↗
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tab === "ABOUT" && (
              <div className="v2-dock-body">
                <p className="v2-about-name">
                  {meta.name} — {meta.title}
                </p>
                <p className="v2-dock-hint">{meta.tagline}</p>
                <p className="v2-dock-hint">
                  the gold-ringed building at the city center is{" "}
                  <button className="v2-inline-link" onClick={() => onSelectRepo(oldest)}>
                    {oldest.name}
                  </button>{" "}
                  — my first repo, {totals.firstYear}. everything else grew outward
                  from there.
                </p>
                <ul className="v2-stats">
                  {stats.map((s) => (
                    <li key={s.label}>
                      <strong>{s.value}</strong> {s.label}
                    </li>
                  ))}
                </ul>
                <ul className="v2-xp">
                  {experience.map((e) => (
                    <li key={e.company}>
                      <strong>{e.company}</strong> — {e.role}{" "}
                      <span className="v2-xp-period">{e.period}</span>
                    </li>
                  ))}
                </ul>
                <div className="v2-socials">
                  {socials.map((s) => (
                    <a key={s.id} href={s.url} target="_blank" rel="noreferrer">
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </aside>
    </>
  );
}
