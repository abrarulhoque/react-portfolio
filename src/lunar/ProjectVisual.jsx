import { useId } from "react";

export default function ProjectVisual({ type }) {
  const metalId = useId();
  if (type === "laserbend")
    return (
      <div className="visual visual-cad" aria-hidden="true">
        <div className="visual-topline">
          <span>Laserbend / Instant quote</span>
          <span>01—04</span>
        </div>
        <svg className="cad-part" viewBox="0 0 440 250" fill="none">
          <defs>
            <linearGradient
              id={metalId}
              x1="80"
              y1="30"
              x2="300"
              y2="220"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8c9199" />
              <stop offset=".48" stopColor="#484d56" />
              <stop offset="1" stopColor="#20242a" />
            </linearGradient>
          </defs>
          <path
            d="M91 128 221 57 349 115 219 192Z"
            fill={`url(#${metalId})`}
            stroke="#a0a7af"
          />
          <path
            d="m91 128 0 22 127 65 1-23m0 0 130-77v22L218 215"
            fill="#272b32"
            stroke="#707782"
          />
          <path d="m91 128 0-57 130-69v55" fill="#545b65" stroke="#a0a7af" />
          <ellipse
            cx="175"
            cy="130"
            rx="15"
            ry="8"
            fill="#11151a"
            stroke="#a0a7af"
          />
          <ellipse
            cx="265"
            cy="130"
            rx="15"
            ry="8"
            fill="#11151a"
            stroke="#a0a7af"
          />
          <path
            d="M63 144v40l133 70M74 178l-11 6 1-12m122 77 10 5-1-12M357 149l25 13-140 80"
            stroke="#626c77"
            strokeDasharray="3 4"
          />
          <circle cx="125" cy="80" r="7" fill="#20242a" stroke="#949da7" />
          <circle cx="190" cy="46" r="7" fill="#20242a" stroke="#949da7" />
        </svg>
        <div className="cad-spec">
          <span>
            <i /> Part geometry
          </span>
          <span>Material → Quantity → Quote</span>
        </div>
        <span className="visual-caption">Workflow illustration</span>
      </div>
    );
  if (type === "ruckaway")
    return (
      <div className="visual visual-rates" aria-hidden="true">
        <div className="visual-topline">
          <span>Ruckaway / Shipping logic</span>
          <span>02—04</span>
        </div>
        <div className="route-graphic">
          <span className="route-node">Store</span>
          <div className="route-lines">
            <span />
            <span />
          </div>
          <div className="carriers">
            <div>
              <span className="carrier-symbol">A</span>Australia Post
              <span className="rate-dot" />
            </div>
            <div>
              <span className="carrier-symbol">D</span>Direct Freight
              <span className="rate-dot" />
            </div>
          </div>
        </div>
        <div className="rate-check">
          <span className="check-ring">✓</span>
          <div>
            The right rate. Automatically.
            <span>191 scenarios checked against checkout</span>
          </div>
        </div>
        <span className="visual-caption">Workflow illustration</span>
      </div>
    );
  if (type === "dealer")
    return (
      <div className="visual visual-dealer" aria-hidden="true">
        <div className="visual-topline">
          <span>Dealer portal / Quote builder</span>
          <span>03—04</span>
        </div>
        <div className="quote-window">
          <div className="quote-toolbar">
            <span className="window-dots">•••</span>
            <span>New quote</span>
            <span>Saved ✓</span>
          </div>
          <div className="quote-interface">
            <div className="door-drawing">
              <svg viewBox="0 0 180 170" fill="none" stroke="currentColor">
                <path d="M26 139V32h128v107M34 139V40h112v99M24 141h132M34 65h112M34 90h112M34 115h112M86 126h12M22 19h134M22 15v8m134-8v8M12 32v107m-4-107h8m-8 107h8" />
                <path d="M46 48h23v10H46zm32 0h23v10H78zm32 0h23v10h-23z" />
              </svg>
              <span>Made to measure</span>
            </div>
            <div className="quote-options">
              <span>Configure your door</span>
              <div>
                Dimensions <b>Custom</b>
              </div>
              <div>
                Finish <b>Anthracite</b>
              </div>
              <div>
                Pricing <b>Dealer rate</b>
              </div>
              <span className="quote-download">Generate quote ↗</span>
            </div>
          </div>
        </div>
        <span className="visual-caption">Interface illustration</span>
      </div>
    );
  return (
    <div className="visual visual-light" aria-hidden="true">
      <div className="visual-topline">
        <span>Tom Rossau / Trade & retail</span>
        <span>04—04</span>
      </div>
      <div className="lamp-scene">
        <span className="lamp-cord" />
        <div className="lamp">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} style={{ "--rib": i }} />
          ))}
        </div>
        <span className="lamp-ground" />
      </div>
      <div className="language-label">
        <span>EN</span>
        <span>DA</span>
      </div>
      <div className="light-caption">
        A brighter buying experience.
        <span>Retail + wholesale, working together.</span>
      </div>
      <span className="visual-caption">Project illustration</span>
    </div>
  );
}
