// The build log IS the loading screen. Every repo line that prints
// triggers that building's rise in the 3D scene (V2App wires the two).
import { buildings, totals, oldest } from "./cityData";

const bar = (commits) => "▮".repeat(Math.min(8, Math.max(1, Math.ceil(Math.log2(2 + commits)))));

export function makeBuildScript() {
  const langs = Object.entries(totals.languages);
  return [
    { text: "abrar@sys:~$ ./compile --portfolio --target=v2", cls: "cmd", ms: 500 },
    { text: "> fetching github://abrarulhoque ............. OK", ms: 340 },
    { text: `> ${totals.repoCount} repositories · ${langs.length} languages resolved`, ms: 300 },
    { text: `> ${totals.commits.toLocaleString()} commits indexed since ${totals.firstYear}`, ms: 300 },
    { text: `> top layers: ${langs.slice(0, 3).map(([l, n]) => `${l} ${n}`).join(" · ")}`, ms: 300 },
    { text: "> allocating city grid ....................... OK", ms: 420, marker: "grid" },
    ...buildings.map((b, i) => ({
      text: `[${String(i + 1).padStart(2, "0")}/${totals.repoCount}] ${b.name.slice(0, 26).padEnd(27)}${(b.language || "—").padEnd(11)}${String(b.commits).padStart(4)} ${bar(b.commits)}`,
      ms: 85,
      repo: i,
    })),
    { text: "> routing contact beacon ..................... ON", ms: 380 },
    { text: `> anchoring ABOUT → oldest module (${oldest.name}, ${totals.firstYear})`, ms: 380 },
    {
      text: `✓ build complete — ${totals.repoCount} modules · 0 errors · ${totals.commits.toLocaleString()} commits linked`,
      cls: "ok",
      ms: 600,
      marker: "done",
    },
  ];
}
