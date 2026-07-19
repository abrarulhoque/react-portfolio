// Merges the base repo list (github.json) with the v2 deep-fetch
// (github-v2.json) and lays every repo out on a golden-angle spiral —
// oldest repo at the center, the city grows outward chronologically.
import github from "../data/github.json";
import githubV2 from "../data/github-v2.json";
import { languageColors } from "../data/content";

const FALLBACK_COLOR = "#3a4a46";
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const SPACING = 3.4;

const extra = new Map(githubV2.repos.map((r) => [r.name, r]));

export const buildings = github.repos
  .slice()
  .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
  .map((r, i) => {
    const x = extra.get(r.name) ?? {};
    const commits = x.commits ?? Math.max(1, Math.round(r.sizeKb / 50));
    const files = x.files ?? 8;
    const radius = SPACING * Math.sqrt(i);
    const angle = i * GOLDEN;
    return {
      ...r,
      commits,
      files,
      topLevel: x.topLevel ?? null,
      readme: x.readme ?? null,
      // height = commit history, footprint = file-tree breadth, color = language
      height: Math.min(8, 0.8 + Math.log2(1 + commits) * 0.6),
      footprint: Math.min(2.7, Math.max(0.9, 0.9 + Math.log2(1 + files) * 0.16)),
      color: languageColors[r.language] || FALLBACK_COLOR,
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      order: i,
    };
  });

export const cityRadius = SPACING * Math.sqrt(buildings.length);
export const beaconPos = [
  Math.cos(-0.9) * (cityRadius + 8),
  0,
  Math.sin(-0.9) * (cityRadius + 8),
];

export const oldest = buildings[0];

export const totals = {
  repoCount: buildings.length,
  commits: githubV2.totalCommits,
  files: githubV2.totalFiles,
  firstYear: new Date(github.firstRepoAt).getFullYear(),
  languages: github.languages,
};
