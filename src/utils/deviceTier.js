// Honest fidelity negotiation: probe once, tell the visitor which tier they got.
// 'high'  — desktop with headroom: bloom, 1.75x dpr
// 'lite'  — mobile / low-power: no post-processing, capped dpr
// 'off'   — no WebGL or prefers-reduced-motion: static schematic fallback
export function getDeviceTier() {
  if (typeof window === "undefined") return "lite";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";
  let webgl = false;
  try {
    const c = document.createElement("canvas");
    webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    webgl = false;
  }
  if (!webgl) return "off";
  const mem = navigator.deviceMemory || 8;
  const cores = navigator.hardwareConcurrency || 8;
  const mobile = /Android|iPhone|iPad|Mobi/i.test(navigator.userAgent);
  if (mem <= 4 || cores <= 4 || mobile) return "lite";
  return "high";
}
