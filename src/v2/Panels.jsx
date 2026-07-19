import ContactForm from "../components/ContactForm.jsx";
import { socials } from "../data/content";

function fmtSize(kb) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

// Slide-in panel when a building is clicked — the repo's "case file".
export function RepoPanel({ repo, onClose }) {
  return (
    <aside className="v2-panel" role="dialog" aria-label={`${repo.name} details`}>
      <div className="v2-panel-head">
        <h2 className="v2-panel-title">
          <span className="v2-hoverchip-dot" style={{ background: repo.color }} />
          {repo.name}
        </h2>
        <button className="v2-panel-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <div className="v2-panel-meta">
        <span>{repo.language || "no language"}</span>
        <span>est. {new Date(repo.createdAt).getFullYear()}</span>
        <span>last push {new Date(repo.pushedAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
      </div>

      <dl className="v2-panel-stats">
        <div>
          <dt>COMMITS</dt>
          <dd>{repo.commits}</dd>
        </div>
        <div>
          <dt>FILES</dt>
          <dd>{repo.files}</dd>
        </div>
        <div>
          <dt>SIZE</dt>
          <dd>{fmtSize(repo.sizeKb)}</dd>
        </div>
        <div>
          <dt>STARS</dt>
          <dd>{repo.stars}</dd>
        </div>
      </dl>

      {repo.description && <p className="v2-panel-desc">{repo.description}</p>}

      {repo.readme && (
        <div className="v2-readme">
          <p className="v2-readme-cmd">$ cat README.md</p>
          <p className="v2-readme-text">{repo.readme}</p>
        </div>
      )}

      <a className="v2-btn" href={repo.url} target="_blank" rel="noreferrer">
        VIEW ON GITHUB ↗
      </a>
    </aside>
  );
}

export function ContactPanel({ onClose }) {
  return (
    <aside className="v2-panel" role="dialog" aria-label="Contact">
      <div className="v2-panel-head">
        <h2 className="v2-panel-title">
          <span className="v2-hoverchip-dot v2-beacon-dot" />
          ROUTE A TRANSMISSION
        </h2>
        <button className="v2-panel-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>
      <p className="v2-panel-desc">
        got a project? the beacon is always on — this lands straight in my inbox.
      </p>
      <ContactForm />
      <div className="v2-socials v2-socials--panel">
        {socials.map((s) => (
          <a key={s.id} href={s.url} target="_blank" rel="noreferrer">
            {s.label}
          </a>
        ))}
      </div>
    </aside>
  );
}
