import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import "./workflows.css";

export default function WorkflowPreview({
  name,
  theme,
  stages,
  paused,
  controls = false,
  children,
}) {
  const root = useRef(null);
  const mode = useRef(null);
  const [playback, setPlayback] = useState({ playing: false, run: 0 });
  const [step, setStep] = useState(0);
  const stop = useCallback(() => {
    mode.current = null;
    setPlayback((previous) => ({ ...previous, playing: false }));
    setStep(0);
  }, []);
  const start = useCallback(
    (origin) => {
      if (paused) return;
      mode.current = origin;
      setStep(0);
      setPlayback((previous) => ({ playing: true, run: previous.run + 1 }));
    },
    [paused],
  );

  useEffect(() => {
    if (paused) stop();
  }, [paused, stop]);

  useEffect(() => {
    if (!playback.playing || paused) return;
    const timers = stages
      .slice(1)
      .map(([at], index) => window.setTimeout(() => setStep(index + 1), at));
    return () => timers.forEach(window.clearTimeout);
  }, [playback, paused, stages]);

  useEffect(() => {
    const node = root.current;
    const trigger = node.closest(".project-button") || node;
    const enter = (event) => {
      if (
        event.pointerType === "mouse" &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        mode.current !== "manual"
      )
        start("hover");
    };
    const leave = () => {
      if (mode.current === "hover") stop();
    };
    const visibility = () => {
      if (document.hidden) stop();
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) stop();
    });
    observer.observe(node);
    trigger.addEventListener("pointerenter", enter);
    trigger.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      trigger.removeEventListener("pointerenter", enter);
      trigger.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [start, stop]);

  const playing = playback.playing && !paused;
  const currentStep = paused ? 0 : step;
  const finished = currentStep === stages.length - 1;
  const label = paused
    ? "Motion paused"
    : playing && !finished
      ? "Stop preview"
      : finished
        ? "Replay workflow"
        : "Play workflow";
  return (
    <div
      ref={root}
      className={`project-workflow workflow-${theme} ${playing ? "is-playing" : ""}`}
      data-step={currentStep}
      data-run={playback.run}
    >
      <div className="workflow-art" aria-hidden="true">
        <div className="workflow-topline">
          <span>{name}</span>
          <span className="workflow-example">Illustrative demo</span>
        </div>
        <div className="workflow-stage">{children(currentStep)}</div>
        <div className="workflow-footer">
          <div className="workflow-steps">
            {stages
              .filter(([, , label]) => label)
              .map(([at, , label]) => (
                <span
                  key={label}
                  className={stages[currentStep][0] >= at ? "is-current" : ""}
                >
                  {label}
                </span>
              ))}
          </div>
          <span className="workflow-status">
            {paused ? (
              "Motion paused"
            ) : playing ? (
              stages[currentStep][1]
            ) : controls ? (
              "Play the workflow"
            ) : (
              <>
                <span className="workflow-hover-hint">Hover to play</span>
                <span className="workflow-touch-hint">Open to preview</span>
              </>
            )}
          </span>
        </div>
      </div>
      {controls && (
        <button
          className="workflow-play"
          onClick={() => (playing && !finished ? stop() : start("manual"))}
          disabled={paused}
          aria-label={`${label}: ${name}`}
        >
          {playing && !finished ? (
            <Pause size={13} />
          ) : finished ? (
            <RotateCcw size={13} />
          ) : (
            <Play size={13} />
          )}{" "}
          {label}
        </button>
      )}
    </div>
  );
}
