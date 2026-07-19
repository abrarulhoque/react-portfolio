// Fetches public repo metadata for the motherboard scene.
// Run manually when you want the skyline to refresh: npm run fetch-data
// Output is committed so CI builds never hit the GitHub API.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const USER = "abrarulhoque";
const OUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/data/github.json"
);

const res = await fetch(
  `https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`,
  { headers: { Accept: "application/vnd.github+json" } }
);
if (!res.ok) {
  console.error(`GitHub API ${res.status}: ${await res.text()}`);
  process.exit(1);
}
const repos = await res.json();

const kept = repos
  .filter((r) => !r.fork || r.stargazers_count > 0)
  .map((r) => ({
    name: r.name,
    language: r.language,
    sizeKb: r.size,
    stars: r.stargazers_count,
    createdAt: r.created_at,
    pushedAt: r.pushed_at,
    url: r.html_url,
    description: r.description,
  }));

const languages = {};
for (const r of kept) {
  if (r.language) languages[r.language] = (languages[r.language] || 0) + 1;
}

const summary = {
  user: USER,
  fetchedAt: new Date().toISOString(),
  repoCount: kept.length,
  totalKb: kept.reduce((s, r) => s + r.sizeKb, 0),
  languages: Object.fromEntries(
    Object.entries(languages).sort((a, b) => b[1] - a[1])
  ),
  firstRepoAt: kept.reduce(
    (min, r) => (r.createdAt < min ? r.createdAt : min),
    kept[0]?.createdAt ?? new Date().toISOString()
  ),
  lastPushAt: kept.reduce(
    (max, r) => (r.pushedAt > max ? r.pushedAt : max),
    kept[0]?.pushedAt ?? new Date().toISOString()
  ),
  repos: kept,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(summary, null, 2));
console.log(
  `Wrote ${kept.length} repos (${Object.keys(languages).length} languages) to ${OUT}`
);
