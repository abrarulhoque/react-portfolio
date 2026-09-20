# Assets

`public/data/world-countries.json` and `public/images/earth-fallback.svg`: generated from the Natural Earth 1:50m country geometry distributed by [world-atlas 2.0.2](https://github.com/topojson/world-atlas). Natural Earth geography is public domain; world-atlas is ISC-licensed. The build script simplifies subpixel geometry and creates geographic paths using D3 Geo and TopoJSON. Borders reflect the source dataset. Sales highlights use the owner's supplied country counts, not geographic area or inferred customer locations. No live map service is used.

The globe material, lighting, controls, and orbit are implemented in code. The former moon scene and its asset are retained as unused historical source.

`public/images/moon-albedo.jpg`: NASA Scientific Visualization Studio CGI Moon Kit, Ernie Wright (USRA). LROC WAC mosaic: NASA / GSFC / Arizona State University. Source: https://svs.gsfc.nasa.gov/4720/ ; image: https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_2k.jpg . Copied from the existing BreakFree project asset. Decorative, not a live astronomical simulation.

`public/images/abrar-portrait.jpg`: owner-supplied `new_profile.png`, converted to JPEG for delivery. Cropping and grayscale presentation are CSS only.

Project visuals are original schematic illustrations of the described work, not screenshots of client software.
