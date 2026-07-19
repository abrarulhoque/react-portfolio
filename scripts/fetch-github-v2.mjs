// V2 skyline data: per-repo commit counts, file-tree breadth, README excerpts.
// Heavier than fetch-github.mjs (~3 API calls per repo) so it needs a token:
//   GITHUB_TOKEN=$(gh auth token) npm run fetch-data-v2
// Output is committed so CI builds never hit the GitHub API.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const USER = "abrarulhoque";
const OUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/data/github-v2.json"
);

const headers = { Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
} else {
  console.warn("No GITHUB_TOKEN — 54 repos need ~160 calls, you will hit the 60/hr limit.");
}

async function gh(path, accept) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: accept ? { ...headers, Accept: accept } : headers,
  });
  return res;
}

const listRes = await gh(`/users/${USER}/repos?per_page=100&sort=pushed`);
if (!listRes.ok) {
  console.error(`GitHub API ${listRes.status}: ${await listRes.text()}`);
  process.exit(1);
}
const all = await listRes.json();
// same filter as fetch-github.mjs so both datasets describe the same repo set
const kept = all.filter((r) => !r.fork || r.stargazers_count > 0);

async function commitCount(repo) {
  const res = await gh(`/repos/${USER}/${repo.name}/commits?per_page=1`);
  if (res.status === 409) return 0; // empty repo
  if (!res.ok) return null;
  const link = res.headers.get("link");
  if (!link) return (await res.json()).length;
  const m = link.match(/[?&]page=(\d+)>; rel="last"/);
  return m ? Number(m[1]) : 1;
}

async function treeStats(repo) {
  const res = await gh(
    `/repos/${USER}/${repo.name}/git/trees/${repo.default_branch}?recursive=1`
  );
  if (!res.ok) return { files: null, topLevel: null };
  const data = await res.json();
  const files = data.tree.filter((n) => n.type === "blob").length;
  const topLevel = new Set(data.tree.map((n) => n.path.split("/")[0])).size;
  return { files, topLevel };
}

function stripMarkdown(raw) {
  return raw
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/[*_`~>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function readmeExcerpt(repo) {
  const res = await gh(
    `/repos/${USER}/${repo.name}/readme`,
    "application/vnd.github.raw+json"
  );
  if (!res.ok) return null;
  const text = stripMarkdown(await res.text());
  if (!text) return null;
  if (text.length <= 320) return text;
  const cut = text.slice(0, 320);
  return cut.slice(0, cut.lastIndexOf(" ")) + " …";
}

const results = [];
const queue = kept.slice();
const WORKERS = 6;

async function worker() {
  for (let repo = queue.shift(); repo; repo = queue.shift()) {
    const [commits, tree, readme] = await Promise.all([
      commitCount(repo),
      treeStats(repo),
      readmeExcerpt(repo),
    ]);
    results.push({
      name: repo.name,
      commits,
      files: tree.files,
      topLevel: tree.topLevel,
      readme,
    });
    console.log(
      `${String(results.length).padStart(2)}/${kept.length}  ${repo.name} — ${commits} commits, ${tree.files ?? "?"} files`
    );
  }
}

await Promise.all(Array.from({ length: WORKERS }, worker));

const byName = new Map(kept.map((r) => [r.name, r]));
results.sort(
  (a, b) => (byName.get(a.name).created_at < byName.get(b.name).created_at ? -1 : 1)
);

const summary = {
  user: USER,
  fetchedAt: new Date().toISOString(),
  repoCount: results.length,
  totalCommits: results.reduce((s, r) => s + (r.commits || 0), 0),
  totalFiles: results.reduce((s, r) => s + (r.files || 0), 0),
  oldestRepo: results[0]?.name ?? null,
  repos: results,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(summary, null, 2));
console.log(
  `\nWrote ${results.length} repos — ${summary.totalCommits} commits, ${summary.totalFiles} files → ${OUT}`
);
