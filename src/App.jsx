import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Plus,
  X,
  Pause,
  Play,
  Menu,
  Check,
  Copy,
  Github,
  Linkedin,
  BadgeCheck,
  Repeat2,
} from "lucide-react";
import { projects, services, faqs } from "./lunar/content";
import ProjectVisual from "./lunar/ProjectVisual";
import WorldGlobe from "./lunar/WorldGlobe";
import { completedOrders, countrySales } from "./lunar/countrySales";
import "./App.css";
import "./lunar/globe.css";

const email = "abrar@builtbyabrar.com";
function useMotionPreference() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  return reduced;
}
export default function App() {
  const reduced = useMotionPreference();
  const [paused, setPaused] = useState(() => {
    try {
      return localStorage.getItem("abrar-motion-paused") === "true";
    } catch {
      return false;
    }
  });
  const [menu, setMenu] = useState(false);
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [active, setActive] = useState("home");
  const dialog = useRef(null);
  const copyTimer = useRef(null);
  const still = reduced || paused;
  useEffect(() => {
    try {
      localStorage.setItem("abrar-motion-paused", String(paused));
    } catch {
      /* Storage may be disabled. */
    }
  }, [paused]);
  useEffect(() => {
    document.documentElement.dataset.motion = still ? "paused" : "running";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (!still)
            entry.target.animate(
              [
                { opacity: 0.25, transform: "translateY(24px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              {
                duration: 600,
                delay: Number(entry.target.dataset.delay || 0),
                easing: "cubic-bezier(.16,1,.3,1)",
              },
            );
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el));
    if (still)
      document.getAnimations().forEach((animation) => {
        if (animation.effect?.getTiming().iterations !== Infinity)
          animation.finish();
      });
    return () => observer.disconnect();
  }, [still]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((el) => observer.observe(el));
    const target = document.getElementById(location.hash.slice(1));
    if (target)
      requestAnimationFrame(() =>
        target.scrollIntoView({ behavior: "instant" }),
      );
    return () => {
      observer.disconnect();
      clearTimeout(copyTimer.current);
    };
  }, []);
  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === "Escape") setMenu(false);
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);
  useEffect(() => {
    if (selected) {
      dialog.current.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [selected]);
  function closeProject() {
    dialog.current.close();
    setSelected(null);
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setCopyError(false);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(true);
    }
  }
  return (
    <div className="portfolio">
      <a className="skip-link" href="#work">
        Skip to work
      </a>
      <header className="header">
        <a href="#home" className="wordmark" aria-label="Abrar, home">
          <span className="brand-moon" />
          abrar<span className="wordmark-dot">.</span>
        </a>
        <nav
          className={menu ? "navigation is-open" : "navigation"}
          id="main-navigation"
          aria-label="Main navigation"
        >
          {[
            ["work", "Work"],
            ["services", "Services"],
            ["about", "About"],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              onClick={() => setMenu(false)}
            >
              {label}
            </a>
          ))}
          <a
            className="nav-contact"
            href="#contact"
            onClick={() => setMenu(false)}
          >
            Let’s talk <ArrowUpRight size={15} />
          </a>
        </nav>
        <button
          className="menu-toggle icon-button"
          onClick={() => setMenu(!menu)}
          aria-expanded={menu}
          aria-controls="main-navigation"
          aria-label={menu ? "Close menu" : "Open menu"}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <main>
        <section
          className="hero section-shell"
          id="home"
          aria-labelledby="hero-title"
        >
          <div className="hero-copy">
            <div className="intro hero-enter">
              <img
                src="/images/abrar-portrait.jpg"
                alt=""
                width="44"
                height="44"
              />
              <span>
                Hey, I’m Abrar{" "}
                <span className="intro-role">Independent web developer</span>
              </span>
            </div>
            <h1 id="hero-title" className="hero-enter">
              Your store almost
              <br className="desktop-break" /> does what you need.
              <br />
              <em>I build the rest.</em>
            </h1>
            <p className="hero-description hero-enter">
              Custom development for WordPress, WooCommerce, and Shopify. The
              shipping rules, quote tools, and integrations that don’t come out
              of the box.
            </p>
            <div className="hero-actions hero-enter">
              <a className="button button-primary" href="#contact">
                Tell me what you need <ArrowUpRight size={17} />
              </a>
              <a className="text-link" href="#work">
                Explore my work <ArrowDown size={15} />
              </a>
            </div>
            <div className="hero-note hero-enter">
              <span className="status-dot" /> Based in Bangladesh. Building
              worldwide.
            </div>
            <a
              className="hero-reputation hero-enter"
              href="https://www.fiverr.com/abrar_h_"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View my Fiverr profile: Fiverr’s Choice for WooCommerce and repeat buyers"
            >
              <span
                className="fiverr-choice"
                title="Fiverr’s Choice on my WooCommerce gig"
              >
                <BadgeCheck size={15} aria-hidden="true" />
                Fiverr’s Choice
              </span>
              <span className="repeat-buyers">
                <Repeat2 size={15} aria-hidden="true" />
                Repeat buyers on Fiverr
              </span>
            </a>
          </div>
          <WorldGlobe paused={still} />
          <div className="hero-bottom">
            <a href="#work" className="scroll-cue">
              <span className="scroll-line" /> Scroll to explore{" "}
              <ArrowDown size={13} />
            </a>
            <button
              className="motion-toggle"
              onClick={() => setPaused(!paused)}
              disabled={reduced}
              aria-pressed={still}
              aria-label={
                reduced
                  ? "Reduced motion enabled"
                  : paused
                    ? "Resume animation"
                    : "Pause animation"
              }
            >
              {still ? <Play size={12} /> : <Pause size={12} />}
              {reduced
                ? "Reduced motion"
                : paused
                  ? "Motion paused"
                  : "Motion on"}
            </button>
          </div>
        </section>
        <div className="proof-strip section-shell" data-reveal>
          <div>
            <strong>{completedOrders}</strong>
            <span>Completed orders</span>
          </div>
          <div>
            <strong>
              4<span>+</span>
            </strong>
            <span>Years of freelance work</span>
          </div>
          <div>
            <strong>{countrySales.length}</strong>
            <span>Countries worked with</span>
          </div>
          <p>
            Small fixes. Complex builds.
            <br />
            <span>Long-term working relationships.</span>
          </p>
        </div>
        <section
          className="work section-shell section-pad"
          id="work"
          aria-labelledby="work-title"
        >
          <div className="section-heading" data-reveal>
            <div>
              <span className="section-index">01 / Selected work</span>
              <h2 id="work-title">
                Real problems.
                <br />
                <span className="muted">Working solutions.</span>
              </h2>
            </div>
            <p>
              A few things I’ve built for people
              <br className="desktop-break" /> whose businesses needed more.
            </p>
          </div>
          <div className="project-grid">
            {projects.map((project, i) => (
              <article
                className={`project project-${project.id}`}
                key={project.id}
                data-reveal
                data-delay={(i % 2) * 80}
              >
                <button
                  className="project-button"
                  onClick={() => setSelected(project)}
                  aria-label={`Read case study: ${project.title}`}
                >
                  <div className="project-art">
                    <ProjectVisual type={project.id} paused={still || Boolean(selected)} />
                    <span className="project-open">
                      <ArrowUpRight size={21} />
                    </span>
                  </div>
                  <div className="project-meta">
                    <span>{project.client}</span>
                    <span>{project.platform}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <span className="project-read">
                    View case study <ArrowRight size={14} />
                  </span>
                </button>
              </article>
            ))}
          </div>
          <div className="work-footnote" data-reveal>
            <span>Different businesses. The same attention to detail.</span>
            <a
              className="text-link"
              href="https://github.com/abrarulhoque"
              target="_blank"
              rel="noreferrer"
            >
              More on GitHub <ArrowUpRight size={15} />
            </a>
          </div>
        </section>
        <section
          className="services section-shell section-pad"
          id="services"
          aria-labelledby="services-title"
        >
          <div className="services-intro" data-reveal>
            <span className="section-index">02 / What I can help with</span>
            <h2 id="services-title">
              When the plugin
              <br />
              almost does it.
            </h2>
            <p>
              That last part is usually where I come in. A specific problem, a
              clear scope, and something that works in your actual store.
            </p>
            <a className="text-link" href="#contact">
              Let’s figure it out <ArrowUpRight size={16} />
            </a>
            <div className="service-orbit" aria-hidden="true">
              <span />
              <i />
              <b />
            </div>
          </div>
          <div className="service-list">
            {services.map((service, i) => (
              <details key={service.title} data-reveal>
                <summary>
                  <span className="service-number">0{i + 1}</span>
                  <span>{service.title}</span>
                  <Plus size={19} className="disclosure-icon" />
                </summary>
                <div className="service-content">
                  <p>{service.description}</p>
                  <span>{service.deliverable}</span>
                </div>
              </details>
            ))}
          </div>
        </section>
        <section
          className="about section-shell section-pad"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="portrait-wrap" data-reveal>
            <img
              src="/images/abrar-portrait.jpg"
              width="1254"
              height="1254"
              alt="Abrarul Hoque wearing a black overshirt"
              loading="lazy"
            />
            <div className="portrait-caption">
              <span>Abrarul Hoque</span>
              <span>23.81° N / 90.41° E</span>
            </div>
            <span className="portrait-cross cross-top" aria-hidden="true">
              +
            </span>
            <span className="portrait-cross cross-bottom" aria-hidden="true">
              +
            </span>
          </div>
          <div className="about-copy" data-reveal>
            <span className="section-index">
              03 / The person behind the work
            </span>
            <h2 id="about-title">
              One person.
              <br />
              <em>All the way through.</em>
            </h2>
            <p>
              I’m Abrar, a self-taught developer from Bangladesh. I started with
              small store fixes in 2021. Hundreds of projects later, I’m still
              drawn to the same thing: figuring out the part that isn’t working.
            </p>
            <p>
              You talk to me. I scope it, build it, test it in the real customer
              flow, and leave notes your team can use.
            </p>
            <p>
              Off the clock, I build tools for myself. Android apps, little
              automations, and occasionally a globe in a browser.
            </p>
            <div className="about-socials">
              <a
                href="https://github.com/abrarulhoque"
                target="_blank"
                rel="noreferrer"
              >
                <Github size={16} /> GitHub <ArrowUpRight size={13} />
              </a>
              <a
                href="https://www.linkedin.com/in/abrarulhoque/"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin size={16} /> LinkedIn <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </section>
        <section
          className="testimonial section-shell"
          aria-label="Client testimonial"
          data-reveal
        >
          <span className="quote-mark" aria-hidden="true">
            “
          </span>
          <blockquote>
            Abrar has a deep understanding
            <br className="desktop-break" /> of the specific work.
          </blockquote>
          <div className="quote-attribution">
            <span className="client-initial">O</span>
            <div>
              Oliver<span>Tom Rossau · Denmark</span>
            </div>
          </div>
        </section>
        <section
          className="process section-shell section-pad"
          aria-labelledby="process-title"
        >
          <div className="section-heading" data-reveal>
            <div>
              <span className="section-index">04 / How we work</span>
              <h2 id="process-title">Clear from the start.</h2>
            </div>
            <p>
              No technical brief needed.
              <br />
              Just tell me what should happen.
            </p>
          </div>
          <div className="process-grid">
            {[
              [
                "Send me the problem.",
                "The store URL, what should happen, and what happens now. Tell me if it’s live or staging.",
              ],
              [
                "Agree on the scope.",
                "I look at the actual setup. You get a fixed price, clear boundaries, and the checks before work begins.",
              ],
              [
                "Get the work. And the checks.",
                "I test the customer flow and hand over what changed, what passed, and how to maintain it.",
              ],
            ].map(([title, description], i) => (
              <div key={title} data-reveal data-delay={i * 80}>
                <span className="process-number">
                  0{i + 1}
                  <span />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
          <div className="faq-list" data-reveal>
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <Plus size={17} className="disclosure-icon" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>
        <section
          className="contact section-shell"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="contact-orbit" aria-hidden="true" />
          <div className="contact-content" data-reveal>
            <span className="section-index">Have something in mind?</span>
            <h2 id="contact-title">
              Let’s bring it
              <br />
              <em>Down to earth.</em>
            </h2>
            <p>
              Send the URL and tell me what you need.
              <br />
              I’ll reply with the smallest sensible next step.
            </p>
            <div className="contact-actions">
              <a className="email-link" href={`mailto:${email}`}>
                {email}
                <ArrowUpRight />
              </a>
              <button
                className="icon-button copy-button"
                onClick={copyEmail}
                aria-label={copied ? "Email copied" : "Copy email address"}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            <span className="copy-status" role="status">
              {copied
                ? "Email copied"
                : copyError
                  ? `Copy unavailable. Email me at ${email}`
                  : "\u00a0"}
            </span>
            <a
              className="text-link whatsapp"
              href="https://wa.me/8801865801291"
              target="_blank"
              rel="noreferrer"
            >
              Prefer WhatsApp? <ArrowUpRight size={14} />
            </a>
          </div>
        </section>
      </main>
      <footer className="footer section-shell" data-reveal>
        <a href="#home" className="wordmark">
          <span className="brand-moon" />
          abrar.
        </a>
        <span>© {new Date().getFullYear()} Abrarul Hoque</span>
        <span>Built with care. A little curiosity, too.</span>
        <a className="back-top" href="#home">
          Back to top <ArrowUpRight size={15} />
        </a>
      </footer>
      <dialog
        ref={dialog}
        className="case-dialog"
        aria-labelledby="case-title"
        onCancel={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === dialog.current) closeProject();
        }}
      >
        {selected && (
          <div className="case-body">
            <button
              className="icon-button case-close"
              onClick={closeProject}
              aria-label="Close case study"
            >
              <X />
            </button>
            <span className="section-index">
              {selected.client} / {selected.platform}
            </span>
            <h2 id="case-title">{selected.title}</h2>
            <div className="case-visual">
              <ProjectVisual type={selected.id} paused={still} controls />
            </div>
            <h3>The problem</h3>
            <p>{selected.problem}</p>
            <h3>What I built</h3>
            <p>{selected.solution}</p>
            <h3>The result</h3>
            <p>{selected.result}</p>
            <div className="case-stack">
              {selected.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <a
              className="button button-primary"
              href="#contact"
              onClick={closeProject}
            >
              Have a similar problem? <ArrowUpRight size={16} />
            </a>
          </div>
        )}
      </dialog>
    </div>
  );
}
