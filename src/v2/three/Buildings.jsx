import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { buildings, cityRadius } from "../cityData";

// Three instanced meshes for the whole skyline: solid bodies, emissive
// roof caps (bloom bait), and a full-height wireframe "scaffold" ghost
// that the solids snap up inside of during the compile phase.
const easeOutBack = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

const N = buildings.length;

export default function Buildings({
  builtRef,
  phase,
  focusLang,
  selectedName,
  onSelect,
  onHover,
}) {
  const bodyRef = useRef();
  const capRef = useRef();
  const scaffoldRef = useRef();
  const riseT = useRef(new Float32Array(N));
  const settled = useRef(false);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const scratch = useMemo(() => new THREE.Color(), []);
  const base = useMemo(
    () =>
      buildings.map((b) => {
        const c = new THREE.Color(b.color);
        return { body: c.clone().multiplyScalar(0.32), cap: c };
      }),
    []
  );

  // handlers read these so they never see stale props
  const focusRef = useRef(null);
  const selRef = useRef(null);
  const phaseRef = useRef(phase);
  const hoverIdx = useRef(-1);

  function applyColors() {
    const body = bodyRef.current;
    const cap = capRef.current;
    if (!body || !cap) return;
    const focus = focusRef.current;
    for (let i = 0; i < N; i++) {
      const b = buildings[i];
      const dimmed = focus && b.language !== focus;
      const hot =
        selRef.current === b.name ||
        hoverIdx.current === i ||
        (focus && b.language === focus);
      scratch.copy(base[i].body).multiplyScalar(dimmed ? 0.35 : hot ? 2.4 : 1);
      body.setColorAt(i, scratch);
      scratch.copy(base[i].cap).multiplyScalar(dimmed ? 0.16 : hot ? 1.7 : 1);
      cap.setColorAt(i, scratch);
    }
    body.instanceColor.needsUpdate = true;
    cap.instanceColor.needsUpdate = true;
  }

  useEffect(() => {
    focusRef.current = focusLang;
    selRef.current = selectedName;
    phaseRef.current = phase;
    applyColors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusLang, selectedName, phase]);

  // InstancedMesh caches a boundingSphere computed from the initial
  // (pre-rise) matrices and then fails every raycast's early-out test —
  // preset one that covers the finished city so picking always works.
  useEffect(() => {
    const body = bodyRef.current;
    if (body) {
      body.boundingSphere = new THREE.Sphere(
        new THREE.Vector3(0, 4, 0),
        cityRadius + 14
      );
    }
  }, []);

  // scaffold ghosts sit at final size from the start — set once
  useEffect(() => {
    const s = scaffoldRef.current;
    if (!s) return;
    buildings.forEach((b, i) => {
      dummy.position.set(b.x, b.height / 2, b.z);
      dummy.scale.set(b.footprint, b.height, b.footprint * 0.78);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      s.setMatrixAt(i, dummy.matrix);
    });
    s.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame((_, dt) => {
    const body = bodyRef.current;
    const cap = capRef.current;
    const scaffold = scaffoldRef.current;
    if (!body || !cap) return;

    if (scaffold) {
      const target = phase === "boot" ? 0 : phase === "compile" ? 0.2 : 0.045;
      const m = scaffold.material;
      m.opacity += (target - m.opacity) * Math.min(1, dt * 3);
      scaffold.visible = m.opacity > 0.012;
    }

    if (settled.current) return;
    const built = builtRef.current;
    let allDone = true;
    for (let i = 0; i < N; i++) {
      const b = buildings[i];
      let t = riseT.current[i];
      if (i < built && t < 1) {
        t = Math.min(1, t + dt / 0.55);
        riseT.current[i] = t;
      }
      if (t < 1) allDone = false;
      const h = Math.max(0.001, b.height * (t === 0 ? 0 : easeOutBack(t)));
      dummy.position.set(b.x, h / 2, b.z);
      dummy.scale.set(b.footprint, h, b.footprint * 0.78);
      dummy.updateMatrix();
      body.setMatrixAt(i, dummy.matrix);
      dummy.position.y = h + 0.05;
      dummy.scale.set(b.footprint * 0.9, 0.09, b.footprint * 0.68);
      dummy.updateMatrix();
      cap.setMatrixAt(i, dummy.matrix);
    }
    body.instanceMatrix.needsUpdate = true;
    cap.instanceMatrix.needsUpdate = true;
    if (allDone && built >= N) settled.current = true;
  });

  const noRaycast = () => null;

  return (
    <group>
      <instancedMesh
        ref={bodyRef}
        args={[null, null, N]}
        frustumCulled={false}
        onPointerMove={(e) => {
          if (phaseRef.current !== "city") return;
          e.stopPropagation();
          if (e.instanceId !== hoverIdx.current) {
            hoverIdx.current = e.instanceId;
            onHover(buildings[e.instanceId] ?? null);
            document.body.style.cursor = "pointer";
            applyColors();
          }
        }}
        onPointerOut={() => {
          if (hoverIdx.current === -1) return;
          hoverIdx.current = -1;
          onHover(null);
          document.body.style.cursor = "";
          applyColors();
        }}
        onClick={(e) => {
          if (phaseRef.current !== "city" || e.instanceId == null) return;
          e.stopPropagation();
          onSelect(buildings[e.instanceId]);
        }}
      >
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial roughness={0.5} metalness={0.3} />
      </instancedMesh>

      <instancedMesh
        ref={capRef}
        args={[null, null, N]}
        frustumCulled={false}
        raycast={noRaycast}
      >
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      <instancedMesh
        ref={scaffoldRef}
        args={[null, null, N]}
        frustumCulled={false}
        raycast={noRaycast}
      >
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshBasicMaterial
          wireframe
          transparent
          opacity={0}
          color="#2de2c3"
          toneMapped={false}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
}
