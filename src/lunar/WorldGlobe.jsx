import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, MoveHorizontal, RotateCcw, Search, X } from "lucide-react";
import { countrySales, mappedSales } from "./countrySales";

const EarthScene = lazy(() => import("./EarthScene"));
const radians = Math.PI / 180;

function webGLUnavailable() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");
    if (!context) return true;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return false;
  } catch {
    return true;
  }
}

class GlobeBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function WorldGlobe({ paused }) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(webGLUnavailable);
  const [active, setActive] = useState(true);
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [listOpen, setListOpen] = useState(false);
  const viewport = useRef();
  const tooltip = useRef();
  const dialog = useRef();
  const controls = useRef({
    x: 22 * radians, y: -50 * radians, velocity: 0,
    dragging: false, hovering: false, focused: false, moved: false, target: null,
  });
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => setFailed(true), []);

  useEffect(() => {
    let visible = true;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(viewport.current);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (!listOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [listOpen]);

  const onHover = useCallback((country, event) => {
    setHovered(country);
    if (country && event && tooltip.current) {
      const rect = viewport.current.getBoundingClientRect();
      const x = Math.max(10, Math.min(rect.width - 200, event.clientX - rect.left + 18));
      const y = Math.max(10, Math.min(rect.height - 76, event.clientY - rect.top - 72));
      tooltip.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  }, []);

  function closeList() {
    dialog.current.close();
    setListOpen(false);
  }

  function focusCountry(country) {
    setSelected(country);
    setHovered(null);
    const state = controls.current;
    const targetY = (-90 - country.longitude) * radians;
    state.target = {
      x: country.latitude * radians,
      y: state.y + Math.atan2(Math.sin(targetY - state.y), Math.cos(targetY - state.y)),
    };
    state.velocity = 0;
    state.invalidate?.();
    closeList();
  }

  function reset() {
    setSelected(null);
    setHovered(null);
    const state = controls.current;
    state.target = {
      x: 22 * radians,
      y: state.y + Math.atan2(Math.sin(-50 * radians - state.y), Math.cos(-50 * radians - state.y)),
    };
    state.velocity = 0;
    state.invalidate?.();
  }

  function startDrag(event) {
    if (!ready || failed || (event.pointerType === "mouse" && event.button !== 0)) return;
    const state = controls.current;
    state.pointerId = event.pointerId;
    state.startX = state.lastX = event.clientX;
    state.startY = state.lastY = event.clientY;
    state.down = true;
    state.moved = false;
    state.target = null;
    state.velocity = 0;
  }

  function drag(event) {
    const state = controls.current;
    if (!state.down || event.pointerId !== state.pointerId) return;
    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;
    if (Math.hypot(event.clientX - state.startX, event.clientY - state.startY) > 5) {
      state.dragging = state.moved = true;
      viewport.current.setPointerCapture(event.pointerId);
      viewport.current.dataset.dragging = "true";
      setHovered(null);
      setSelected(null);
      state.y += dx * 0.006;
      state.x = Math.max(-1.35, Math.min(1.35, state.x + dy * 0.006));
      state.velocity = paused ? 0 : dx * 0.001;
      state.invalidate?.();
    }
    state.lastX = event.clientX;
    state.lastY = event.clientY;
  }

  function endDrag(event) {
    const state = controls.current;
    if (event.pointerId !== state.pointerId) return;
    state.down = state.dragging = false;
    viewport.current.dataset.dragging = "false";
    if (viewport.current.hasPointerCapture(event.pointerId)) viewport.current.releasePointerCapture(event.pointerId);
  }

  function keyRotate(event) {
    const moves = { ArrowLeft: [0, -0.18], ArrowRight: [0, 0.18], ArrowUp: [-0.14, 0], ArrowDown: [0.14, 0] };
    if (event.key === "Home") { event.preventDefault(); reset(); return; }
    if (event.key === "Escape") { setSelected(null); setHovered(null); return; }
    if (!moves[event.key] || failed || !ready) return;
    event.preventDefault();
    const state = controls.current;
    state.target = null;
    state.x = Math.max(-1.35, Math.min(1.35, state.x + moves[event.key][0]));
    state.y += moves[event.key][1];
    state.velocity = 0;
    setHovered(null);
    setSelected(null);
    state.invalidate?.();
  }

  const filtered = countrySales.filter((country) => country.name.toLowerCase().includes(search.trim().toLowerCase()));
  return (
    <section className={`globe-stage ${ready && !failed ? "is-ready" : ""}`} aria-label="Where my clients are">
      <div className="globe-heading">
        <span className="status-dot" /> Good work travels.
      </div>
      <div className="globe-orbit" aria-hidden="true" />
      <div
        className="globe-viewport"
        ref={viewport}
        role="group"
        tabIndex={0}
        aria-label="Interactive globe of client countries"
        aria-describedby="globe-instructions"
        onPointerDown={startDrag}
        onPointerMove={drag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={(event) => { if (event.target === viewport.current) endDrag(event); }}
        onPointerEnter={() => { controls.current.hovering = true; }}
        onPointerLeave={() => {
          const state = controls.current;
          state.hovering = false;
          if (!state.dragging) state.down = false;
          setHovered(null);
        }}
        onFocus={() => { controls.current.focused = true; }}
        onBlur={() => { controls.current.focused = false; }}
        onKeyDown={keyRotate}
      >
        <img className="earth-fallback" src="/images/earth-fallback.svg" alt="Earth with client countries highlighted" width="500" height="500" />
        {!failed && (
          <div className="earth-canvas" aria-hidden="true">
            <GlobeBoundary onFailure={onFailure}>
              <Suspense fallback={null}>
                <EarthScene
                  controls={controls} active={active && !listOpen} paused={paused}
                  selectedId={(hovered || selected)?.id}
                  pinnedCountry={selected}
                  onHover={onHover} onSelect={setSelected}
                  onReady={onReady} onFailure={onFailure}
                />
              </Suspense>
            </GlobeBoundary>
          </div>
        )}
        <div ref={tooltip} className={`globe-tooltip ${hovered ? "is-visible" : ""}`} aria-hidden="true">
          <strong>{hovered?.name}</strong>
          <span>{hovered?.sales} {hovered?.sales === 1 ? "sale" : "sales"}{hovered?.id === "050" ? " · Home base" : ""}</span>
        </div>
      </div>
      <div className="globe-footer">
        <div className="globe-readout" aria-live="polite" aria-atomic="true">
          {selected ? <><span>{selected.name}{selected.id === "050" ? " · Home base" : ""}</span><strong>{selected.sales} {selected.sales === 1 ? "sale" : "sales"}</strong></> :
            <><span>Clients in <strong>{countrySales.length} countries</strong></span><span>{mappedSales} sales around the world</span></>}
        </div>
        <div className="globe-toolbar">
          <span className="globe-hint" id="globe-instructions">
            <MoveHorizontal size={15} aria-hidden="true" />
            {failed ? "Explore the country list" : ready ? "Drag to explore" : "Loading globe…"}
            <span className="sr-only">. Hover or tap a country for sales. Use arrow keys to rotate and Home to reset. On touch screens, swipe horizontally to rotate; swipe vertically to scroll. The country list contains all sales data.</span>
          </span>
          <button className="globe-reset" onClick={reset} aria-label="Reset globe" title="Reset globe" disabled={!ready || failed}><RotateCcw size={14} /></button>
          <button className="globe-list-button" onClick={() => { setSearch(""); setListOpen(true); dialog.current.showModal(); }} aria-haspopup="dialog">
            View countries <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
      <dialog ref={dialog} className="country-dialog" aria-labelledby="country-list-title" onClose={() => setListOpen(false)} onClick={(event) => { if (event.target === dialog.current) closeList(); }}>
        <div className="country-dialog-inner">
          <header className="country-dialog-header">
            <div><h2 id="country-list-title">A little closer to everywhere.</h2><p>{countrySales.length} countries · {mappedSales} sales on Fiverr</p></div>
            <button className="icon-button" onClick={closeList} aria-label="Close country list"><X size={18} /></button>
          </header>
          <label className="country-search"><Search size={17} /><span className="sr-only">Search countries</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a country" /></label>
          <div className="country-list-heading"><span>Country</span><span>Sales</span></div>
          <ul className="country-list">
            {filtered.map((country) => <li key={country.id}>
              <button onClick={() => focusCountry(country)} aria-label={`${country.name}, ${country.sales} ${country.sales === 1 ? "sale" : "sales"}. Show on globe`}>
                <span className="country-name">{country.name}{country.id === "050" && <small>Home base</small>}</span>
                <span className="country-sales-bar" aria-hidden="true"><i style={{ width: `${Math.max(2, (country.sales / 458) * 100)}%` }} /></span>
                <span className="country-sales-number">{country.sales}</span><ArrowUpRight size={13} />
              </button>
            </li>)}
          </ul>
          {filtered.length === 0 && <p className="country-empty" role="status">No countries match “{search}”.</p>}
          <footer className="country-source">Country totals from my Fiverr sales map, September 2026.</footer>
        </div>
      </dialog>
    </section>
  );
}
