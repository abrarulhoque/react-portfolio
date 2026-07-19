import { ChevronDown, ExternalLink, Send } from "lucide-react";
import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { SiFiverr } from "react-icons/si";
import github from "../data/github.json";
import {
  caseStudies,
  experience,
  meta,
  projects,
  services,
  skills,
  socials,
  stats,
} from "../data/content";
import ContactForm from "./ContactForm";

const SOCIAL_ICONS = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  whatsapp: FaWhatsapp,
  fiverr: SiFiverr,
  x: FaXTwitter,
  instagram: FaInstagram,
};

function SocialRow() {
  return (
    <div className="social-row">
      {socials.map((s) => {
        const Icon = SOCIAL_ICONS[s.id];
        return (
          <a
            key={s.id}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="social-link"
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );
}

export default function Sections({ onSkillHover, onSkillLeave }) {
  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section id="home" data-board className="board-section board-section--center">
        <div className="hero-card">
          <p className="hero-kicker">// PRINTED CIRCUIT PORTFOLIO — {meta.boardRev}</p>
          <h1 className="hero-name">{meta.name}</h1>
          <p className="hero-title">{meta.title}</p>
          <p className="hero-tagline">{meta.tagline}</p>
          <div className="hero-stats">
            {stats.map((s) => (
              <span key={s.label} className="stat-chip">
                <strong>{s.value}</strong> {s.label}
              </span>
            ))}
          </div>
          <div className="hero-ctas">
            <a href="#contact" className="btn btn--primary">
              <Send size={15} /> Start a project
            </a>
            <a href="#projects" className="btn btn--ghost">
              Inspect the board
            </a>
          </div>
        </div>
        <p className="scroll-hint" aria-hidden="true">
          SCROLL TO TRAVERSE THE BOARD <ChevronDown size={14} />
        </p>
      </section>

      {/* ---------------- ABOUT ---------------- */}
      <section id="about" data-board className="board-section board-section--right">
        <div className="content-card">
          <p className="card-kicker">[ PWR ] ABOUT</p>
          <div className="about-head">
            <img
              src={meta.portrait}
              alt="Abrarul Hoque portrait"
              className="about-portrait"
              loading="lazy"
            />
            <div>
              <h2>The power source</h2>
              <p className="card-sub">Freelance web developer · Bangladesh → worldwide</p>
            </div>
          </div>
          <p>
            I'm Abrar — I build conversion-first e-commerce sites and web apps.
            Since 2022 I've shipped <strong>100+ WordPress and Shopify projects</strong>{" "}
            for clients worldwide: custom themes, WooCommerce plugins, API
            integrations, and performance work that actually moves metrics.
          </p>
          <p className="card-note">
            Everything on this board is real: the skyline ahead is my live GitHub —{" "}
            {github.repoCount} repos, {Math.round(github.totalKb / 1024)} MB of code.
          </p>
          <div className="metric-chips">
            {caseStudies.map((c) => (
              <span key={c.title} className="metric-chip" title={c.detail}>
                {c.metric} <em>· {c.title}</em>
              </span>
            ))}
          </div>
          <SocialRow />
        </div>
      </section>

      {/* ---------------- SKILLS ---------------- */}
      <section id="skills" data-board className="board-section board-section--left">
        <div className="content-card">
          <p className="card-kicker">[ SKL-GRID ] SKILLS</p>
          <h2>Chips on the board</h2>
          <p className="card-sub">
            Hover a chip — its traces light up the projects it powered.
          </p>
          <div className="skill-grid">
            {skills.map((s) => (
              <button
                key={s.id}
                type="button"
                className="skill-chip"
                style={{ "--chip-color": s.color }}
                onMouseEnter={() => onSkillHover(s.id)}
                onMouseLeave={onSkillLeave}
                onFocus={() => onSkillHover(s.id)}
                onBlur={onSkillLeave}
              >
                {s.name || s.id}
              </button>
            ))}
          </div>
          <div className="service-list">
            <p className="service-list-title">WHAT I BUILD WITH THESE</p>
            {services.map((sv) => (
              <div key={sv.id} className="service-row">
                <span className="service-bullet" style={{ background: sv.color }} />
                <div>
                  <h3>{sv.title}</h3>
                  <p>{sv.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PROJECTS ---------------- */}
      <section id="projects" data-board className="board-section board-section--bottom">
        <div className="content-card content-card--slim">
          <p className="card-kicker">[ PRJ ] SELECTED WORK</p>
          <h2>Powered modules</h2>
          <p className="card-sub">
            Modules light up as current reaches them. The skyline flanking this
            district is my live GitHub — height = code volume, color = language.
          </p>
        </div>
        <div className="projects-rail" role="list">
          {projects.map((p) => (
            <article key={p.id} id={`project-${p.id}`} className="project-card" role="listitem">
              <div className="project-thumb">
                <img src={p.image} alt={p.title} loading="lazy" />
                <span className="project-chipname">{p.chip}</span>
              </div>
              <h3>{p.title}</h3>
              <p className="project-desc">{p.description}</p>
              <div className="project-foot">
                <div className="tech-tags">
                  {p.tech.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-visit"
                  aria-label={`Visit ${p.title}`}
                >
                  <ExternalLink size={14} /> Visit
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- EXPERIENCE ---------------- */}
      <section id="experience" data-board className="board-section board-section--right">
        <div className="content-card">
          <p className="card-kicker">[ XP-BUS ] EXPERIENCE</p>
          <h2>Data on the bus</h2>
          <ol className="xp-list">
            {experience.map((xp) => (
              <li key={xp.company} className="xp-item">
                <span className="xp-period">{xp.period}</span>
                <div>
                  <h3>
                    {xp.role} <em>· {xp.company}</em>
                  </h3>
                  <p>{xp.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- CONTACT ---------------- */}
      <section id="contact" data-board className="board-section board-section--left board-section--tall">
        <div className="content-card">
          <p className="card-kicker">[ I/O ] CONTACT</p>
          <h2>Open for projects</h2>
          <p className="card-sub">
            Plug in — tell me what you're building and I'll reply within a day.
          </p>
          <ContactForm />
          <div className="contact-alt">
            <span>or reach me directly:</span>
            <SocialRow />
          </div>
        </div>

        <footer className="board-footer">
          <p>
            © 2026 {meta.name} · This board renders live data from{" "}
            <a
              href="https://github.com/abrarulhoque"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/abrarulhoque
            </a>{" "}
            · Built with three.js
          </p>
        </footer>
      </section>
    </>
  );
}
