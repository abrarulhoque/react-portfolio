// Rebuild local map assets with: node scripts/build-globe-map.mjs
// No third-party requests are made by the delivered globe.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { feature } from "topojson-client";
import { presimplify, simplify } from "topojson-simplify";
import { geoEquirectangular, geoOrthographic, geoPath } from "d3-geo";
import { countrySales, salesById, mappedSales } from "../src/lunar/countrySales.js";

const atlas = JSON.parse(await readFile(new URL("../node_modules/world-atlas/countries-50m.json", import.meta.url)));
// Remove subpixel coastline detail, retaining the 50m atlas's small countries.
const simplified = simplify(presimplify(atlas), 0.005);
const countries = feature(simplified, simplified.objects.countries).features;
const width = 2048;
const height = 1024;
const projection = geoEquirectangular().scale(width / (2 * Math.PI)).translate([width / 2, height / 2]);
const path = geoPath(projection).digits(1);
const paths = countries.map((country) => ({
  id: String(country.id).padStart(3, "0"),
  path: path(country),
}));
const ids = new Set(paths.map((country) => country.id));
for (const country of countrySales) {
  if (!ids.has(country.id)) throw new Error(`Missing map geometry: ${country.name}`);
}
if (countrySales.length !== 47 || mappedSales !== 771 || salesById.size !== 47) {
  throw new Error("Country data does not match the supplied 47 countries / 771 sales.");
}
await mkdir(new URL("../public/data/", import.meta.url), { recursive: true });
await writeFile(new URL("../public/data/world-countries.json", import.meta.url), JSON.stringify({ width, height, countries: paths }));

const fallbackAtlas = simplify(presimplify(atlas), 0.08);
const fallbackCountries = feature(fallbackAtlas, fallbackAtlas.objects.countries).features;
const globePath = geoPath(geoOrthographic().rotate([40, -22]).scale(237).translate([250, 250])).digits(1);
const shapes = fallbackCountries.map((country) => {
  const shape = globePath(country);
  const worked = salesById.has(String(country.id).padStart(3, "0"));
  return shape ? `<path d="${shape}" fill="${worked ? "#a5b995" : "#353b3e"}" stroke="#101718" stroke-width=".45"/>` : "";
}).join("");
await writeFile(new URL("../public/images/earth-fallback.svg", import.meta.url), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><defs><radialGradient id="shade" cx="30%" cy="25%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity=".08"/><stop offset=".5" stop-opacity="0"/><stop offset="1" stop-opacity=".85"/></radialGradient></defs><circle cx="250" cy="250" r="237" fill="#131c20"/>${shapes}<circle cx="250" cy="250" r="237" fill="url(#shade)"/></svg>`);
console.log(`Built ${paths.length} country shapes; all 47 client countries present; ${mappedSales} mapped sales.`);
