import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import github from "../data/github.json";
import { languageColors } from "../data/content";
import { repoSlot } from "./layout";
import monoFont from "../assets/fonts/JetBrainsMono-Bold.ttf";

const FALLBACK_COLOR = "#3a4a46";

export default function RepoCity() {
  const repos = useMemo(() => {
    return github.repos
      .slice()
      .sort((a, b) => b.sizeKb - a.sizeKb)
      .slice(0, 54)
      .map((r, i) => {
        const slot = repoSlot(i);
        const height = Math.min(6, 0.7 + Math.log2(1 + r.sizeKb) * 0.32);
        return {
          ...r,
          ...slot,
          height,
          color: languageColors[r.language] || FALLBACK_COLOR,
          delay: i * 0.055,
        };
      });
  }, []);

  const bodyRef = useRef();
  const capRef = useRef();
  const progress = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const done = useRef(false);

  // seed instance colors once
  const colorsSet = useRef(false);

  useFrame((state, delta) => {
    if (done.current) return;
    const body = bodyRef.current;
    const cap = capRef.current;
    if (!body || !cap) return;

    if (!colorsSet.current) {
      const c = new THREE.Color();
      const dim = new THREE.Color();
      repos.forEach((r, i) => {
        c.set(r.color);
        dim.copy(c).multiplyScalar(0.34);
        body.setColorAt(i, dim);
        cap.setColorAt(i, c);
      });
      body.instanceColor.needsUpdate = true;
      cap.instanceColor.needsUpdate = true;
      colorsSet.current = true;
    }

    progress.current += delta;
    let allDone = true;
    repos.forEach((r, i) => {
      const t = THREE.MathUtils.clamp((progress.current - r.delay) / 0.7, 0, 1);
      if (t < 1) allDone = false;
      const ease = 1 - Math.pow(1 - t, 3);
      const h = Math.max(0.001, r.height * ease);
      dummy.position.set(r.x, h / 2, r.z);
      dummy.scale.set(1, h, 1);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      body.setMatrixAt(i, dummy.matrix);
      dummy.position.y = h + 0.03;
      dummy.scale.set(0.92, 0.06, 0.92);
      dummy.updateMatrix();
      cap.setMatrixAt(i, dummy.matrix);
    });
    body.instanceMatrix.needsUpdate = true;
    cap.instanceMatrix.needsUpdate = true;
    if (allDone) done.current = true;
  });

  const labeled = useMemo(
    () => repos.filter((r) => !r.name.includes(".")).slice(0, 3),
    [repos]
  );

  return (
    <group>
      <instancedMesh ref={bodyRef} args={[null, null, repos.length]} frustumCulled={false}>
        <boxGeometry args={[2.2, 1, 1.5]} />
        <meshStandardMaterial roughness={0.55} metalness={0.25} />
      </instancedMesh>
      {/* neon roof caps — toneMapped off so they catch bloom */}
      <instancedMesh ref={capRef} args={[null, null, repos.length]} frustumCulled={false}>
        <boxGeometry args={[2.2, 1, 1.5]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {labeled.map((r) => (
        <Text
          key={r.name}
          font={monoFont}
          position={[r.x, r.height + 0.8, r.z]}
          fontSize={0.42}
          color="#93aca4"
          anchorX="center"
          rotation={[0, r.x > 0 ? -Math.PI / 5 : Math.PI / 5, 0]}
        >
          {r.name.slice(0, 14)}
        </Text>
      ))}
    </group>
  );
}
