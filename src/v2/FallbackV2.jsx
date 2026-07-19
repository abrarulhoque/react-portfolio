import ContactForm from "../components/ContactForm.jsx";
import { meta, projects, experience, socials } from "../data/content";
import { buildings, totals } from "./cityData";

// No WebGL / prefers-reduced-motion: the same story, told flat.
// The build log renders complete and the skyline becomes a bar chart —
// identical data, zero motion.
export default function FallbackV2({ script }) {
  const maxCommits = Math.max(...buildings.map((b) => b.commits));

  return (
    <div className="v2-fallback">
      <header className="v2-hud v2-hud--static">
        <span className="v2-brand">
          <span className="v2-brand-dot" aria-hidden="true" />
          ABRAR.SYS <span className="v2-brand-rev">V2 · SELF-COMPILING</span>
        </span>
        <a className="v2-chip v2-chip--link" href="/">
          ◂ V1 BOARD
        </a>
      </header>

      <main className="v2-fallback-main">
        <section className="v2-terminal v2-terminal--static" aria-label="Build log">
          <div className="v2-term-head">
            <span className="v2-term-dot" />
            abrar@sys — build.log
          </div>
          <div className="v2-term-body">
            {script.map((l, i) => (
              <p key={i} className={`v2-line${l.cls ? ` v2-line--${l.cls}` : ""}`}>
                {l.text}
              </p>
            ))}
          </div>
        </section>

        <section aria-label="Repository skyline as data">
          <h2 className="v2-fallback-h">THE SKYLINE, FLAT</h2>
          <p className="v2-dock-hint">
            bar length = commits · color = language · {totals.repoCount} repos,{" "}
            {totals.commits.toLocaleString()} commits since {totals.firstYear}
          </p>
          <ul className="v2-bars">
            {buildings
              .slice()
              .sort((a, b) => b.commits - a.commits)
              .map((b) => (
                <li key={b.name}>
                  <a href={b.url} target="_blank" rel="noreferrer" className="v2-bar-row">
                    <span className="v2-bar-name">{b.name}</span>
                    <span className="v2-bar-track">
                      <span
                        className="v2-bar-fill"
                        style={{
                          width: `${Math.max(2, (b.commits / maxCommits) * 100)}%`,
                          background: b.color,
                        }}
                      />
                    </span>
                    <span className="v2-bar-n">{b.commits}</span>
                  </a>
                </li>
              ))}
          </ul>
        </section>

        <section aria-label="Featured work">
          <h2 className="v2-fallback-h">FEATURED — SHIPPED FOR CLIENTS</h2>
          <ul className="v2-featured">
            {projects.map((p) => (
              <li key={p.id} className="v2-featured-card">
                <a href={p.link} target="_blank" rel="noreferrer">
                  <strong>{p.title}</strong>
                  <span className="v2-featured-desc">{p.description}</span>
                  <span className="v2-featured-tech">{p.tech.join(" · ")} ↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="About">
          <h2 className="v2-fallback-h">ABOUT</h2>
          <p className="v2-about-name">
            {meta.name} — {meta.title}
          </p>
          <p className="v2-dock-hint">{meta.tagline}</p>
          <ul className="v2-xp">
            {experience.map((e) => (
              <li key={e.company}>
                <strong>{e.company}</strong> — {e.role}{" "}
                <span className="v2-xp-period">{e.period}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Contact">
          <h2 className="v2-fallback-h">ROUTE A TRANSMISSION</h2>
          <ContactForm />
          <div className="v2-socials">
            {socials.map((s) => (
              <a key={s.id} href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
