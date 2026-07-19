import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { skills } from "../data/content";
import {
  BUS_LANES_X,
  CHIP_POSITIONS,
  EDGE_CONNECTOR,
  MODULE_POSITIONS,
  MODULE_SIZE,
  SECTION_Z,
} from "./layout";

const TRACE_Y = 0.025;

// Cut 90° corners into 45° chamfers like real PCB routing
function chamfer(points, cut = 0.9) {
  if (points.length < 3) return points;
  const out = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    const a = points[i - 1];
    const b = points[i + 1];
    const da = norm2(p.x - a.x, p.z - a.z);
    const db = norm2(b.x - p.x, b.z - p.z);
    out.push({ x: p.x - da.x * cut, z: p.z - da.z * cut });
    out.push({ x: p.x + db.x * cut, z: p.z + db.z * cut });
  }
  out.push(points[points.length - 1]);
  return out;
}

function norm2(x, z) {
  const l = Math.hypot(x, z) || 1;
  return { x: x / l, z: z / l };
}

// Flat ribbon on the board surface; uv.x = distance along the path so the
// shader can march pulses down it.
function ribbonGeometry(points, width = 0.16) {
  const pts = chamfer(points);
  const hw = width / 2;
  const verts = [];
  const uvs = [];
  const idx = [];
  let dist = 0;
  for (let i = 0; i < pts.length; i++) {
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(pts.length - 1, i + 1)];
    const dir = norm2(next.x - prev.x, next.z - prev.z);
    const perp = { x: -dir.z, z: dir.x };
    if (i > 0) dist += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z);
    verts.push(
      pts[i].x + perp.x * hw, TRACE_Y, pts[i].z + perp.z * hw,
      pts[i].x - perp.x * hw, TRACE_Y, pts[i].z - perp.z * hw
    );
    uvs.push(dist, 0, dist, 1);
    if (i > 0) {
      const a = (i - 1) * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(idx);
  return geo;
}

function mergeRibbons(paths, width) {
  const geos = paths.map((p) => ribbonGeometry(p, width));
  const merged = mergeGeometries(geos);
  geos.forEach((g) => g.dispose());
  return merged;
}

// tiny local merge (positions+uvs+index only) to avoid importing examples/
function mergeGeometries(geos) {
  let vCount = 0;
  const pos = [], uv = [], idx = [];
  for (const g of geos) {
    const p = g.getAttribute("position");
    const u = g.getAttribute("uv");
    const ind = g.getIndex();
    for (let i = 0; i < p.count; i++) pos.push(p.getX(i), p.getY(i), p.getZ(i));
    for (let i = 0; i < u.count; i++) uv.push(u.getX(i), u.getY(i));
    for (let i = 0; i < ind.count; i++) idx.push(ind.getX(i) + vCount);
    vCount += p.count;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  return geo;
}

function makeTraceMaterial({ base = "#1a4a40", pulse = "#2de2c3", speed = 2.6, density = 0.09 } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uActive: { value: 0 },
      uBase: { value: new THREE.Color(base) },
      uPulse: { value: new THREE.Color(pulse) },
      uSpeed: { value: speed },
      uDensity: { value: density },
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uTime, uActive, uSpeed, uDensity;
      uniform vec3 uBase, uPulse;
      varying vec2 vUv;
      void main() {
        // soft edges across the ribbon
        float edge = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.75, vUv.y);
        // comet pulse marching along the trace
        float f = fract(vUv.x * uDensity - uTime * uSpeed * 0.1);
        float band = pow(max(0.0, 1.0 - f), 10.0);
        float f2 = fract(vUv.x * uDensity * 2.0 - uTime * uSpeed * 0.23 + 0.5);
        float band2 = pow(max(0.0, 1.0 - f2), 14.0) * uActive;
        vec3 col = uBase * (0.55 + uActive * 0.9);
        col += uPulse * (band * (0.85 + uActive * 1.2) + band2 * 1.6);
        gl_FragColor = vec4(col * edge, 1.0);
      }
    `,
  });
}

export default function Traces({ focusSkillRef }) {
  // static plumbing: bus lanes, module stubs, edge fan, power feed
  const { staticGeo, skillGroups } = useMemo(() => {
    const staticPaths = [];

    for (const x of BUS_LANES_X) {
      staticPaths.push([
        { x, z: 7 },
        { x, z: -88 },
      ]);
    }

    // module stubs from inner edge to nearest lane
    MODULE_POSITIONS.forEach((m) => {
      const inner = m.x > 0 ? m.x - MODULE_SIZE.w / 2 : m.x + MODULE_SIZE.w / 2;
      const lane = m.x > 0 ? BUS_LANES_X[4] : BUS_LANES_X[0];
      staticPaths.push([
        { x: inner, z: m.z },
        { x: lane, z: m.z },
      ]);
    });

    // fan from lanes into the edge connector
    const fanTargets = [-6, -3, 0, 3, 6];
    BUS_LANES_X.forEach((x, i) => {
      staticPaths.push([
        { x, z: -88 },
        { x: fanTargets[i], z: EDGE_CONNECTOR.z + 1.6 },
      ]);
    });

    // power feed from the about district into the bus
    staticPaths.push([
      { x: -8.5, z: SECTION_Z.about + 2 },
      { x: -8.5, z: SECTION_Z.about - 2 },
      { x: BUS_LANES_X[0], z: SECTION_Z.about - 4.5 },
    ]);

    // skill-link traces, grouped per skill so each can light up alone
    const groups = skills
      .filter((s) => s.projects.length > 0)
      .map((skill) => {
        const chipIdx = skills.indexOf(skill);
        const chip = CHIP_POSITIONS[chipIdx];
        const paths = skill.projects.map((pid) => {
          const m = MODULE_POSITIONS[pid - 1];
          const targetX = m.x > 0 ? m.x - MODULE_SIZE.w / 2 : m.x + MODULE_SIZE.w / 2;
          // leave the chip southward, ride the corridor, turn into the module
          const corridorX = chip.x + (chipIdx % 2 === 0 ? -0.6 : 0.6) + (pid % 3) * 0.25;
          return [
            { x: chip.x, z: chip.z + 0.8 },
            { x: corridorX, z: chip.z + 2.2 },
            { x: corridorX, z: m.z },
            { x: targetX, z: m.z },
          ];
        });
        return { id: skill.id, color: skill.color, geo: mergeRibbons(paths, 0.14) };
      });

    return { staticGeo: mergeRibbons(staticPaths, 0.18), skillGroups: groups };
  }, []);

  const staticMat = useMemo(() => makeTraceMaterial(), []);
  const skillMats = useMemo(
    () =>
      Object.fromEntries(
        skillGroups.map((g) => [
          g.id,
          makeTraceMaterial({ base: "#274038", pulse: g.color, speed: 4.2, density: 0.16 }),
        ])
      ),
    [skillGroups]
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    staticMat.uniforms.uTime.value = t;
    const focus = focusSkillRef.current;
    for (const g of skillGroups) {
      const mat = skillMats[g.id];
      mat.uniforms.uTime.value = t;
      const target = focus === g.id ? 1 : 0;
      mat.uniforms.uActive.value = THREE.MathUtils.damp(
        mat.uniforms.uActive.value,
        target,
        8,
        delta
      );
    }
  });

  return (
    <group>
      <mesh geometry={staticGeo} material={staticMat} />
      {skillGroups.map((g) => (
        <mesh key={g.id} geometry={g.geo} material={skillMats[g.id]} />
      ))}
    </group>
  );
}
