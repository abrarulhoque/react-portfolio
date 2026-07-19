// Single source of truth for board coordinates. Everything — camera path,
// traces, module placement — derives from these so districts never drift.

export const SECTION_ORDER = [
  "home",
  "about",
  "skills",
  "projects",
  "experience",
  "contact",
];

export const SECTION_Z = {
  home: 0,
  about: -18,
  skills: -36,
  projects: -58,
  experience: -76,
  contact: -92,
};

export const BOARD = {
  width: 34,
  length: 124,
  centerZ: -46,
  surfaceY: 0,
};

// [position, lookAt] per section, in SECTION_ORDER order
export const CAMERA_WAYPOINTS = [
  { pos: [0, 17, 15], look: [0, 0, -8] },
  { pos: [4, 6.5, -11], look: [-7.5, 0, -19.5] },
  { pos: [6.5, 7.5, -28], look: [-2.5, 0, -38] },
  { pos: [-7, 13, -45], look: [3, -1, -58] },
  { pos: [7.5, 6.5, -68], look: [-3, 0, -78] },
  { pos: [0, 14, -78], look: [0, -2, -94] },
];

// Projects district: 7 ICs zig-zagging down two columns
export const MODULE_POSITIONS = [
  { x: -4.5, z: -50 },
  { x: 4.5, z: -52.5 },
  { x: -4.5, z: -55 },
  { x: 4.5, z: -57.5 },
  { x: -4.5, z: -60 },
  { x: 4.5, z: -62.5 },
  { x: -4.5, z: -65 },
];
export const MODULE_SIZE = { w: 4, h: 0.7, d: 2.2 };

// Skills breadboard: 2 cols x 5 rows
export const BREADBOARD = { x: -1, z: -36, w: 8.4, d: 10 };
export const CHIP_POSITIONS = Array.from({ length: 10 }, (_, i) => ({
  x: BREADBOARD.x + (i % 2 === 0 ? -2 : 2),
  z: BREADBOARD.z + (Math.floor(i / 2) - 2) * 1.85,
}));
export const CHIP_SIZE = { w: 2.6, h: 0.32, d: 1.3 };

// Experience bus: 4 chips in a row
export const XP_POSITIONS = Array.from({ length: 4 }, (_, i) => ({
  x: -6 + i * 4,
  z: -76.5,
}));

// Repo city: two strips flanking the projects district
export function repoSlot(i) {
  const perStrip = 14;
  const strip = Math.floor(i / perStrip) % 4;
  const idx = i % perStrip;
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const sideX = strip % 2 === 0 ? -11.5 : 11.5;
  const bandZ = strip < 2 ? -47 : -60;
  return {
    x: sideX + (col === 0 ? -1.4 : 1.4),
    z: bandZ - row * 1.9,
  };
}

export const EDGE_CONNECTOR = { z: -94.5, pinCount: 22, width: 13 };

export const BUS_LANES_X = [-1.8, -0.9, 0, 0.9, 1.8];
