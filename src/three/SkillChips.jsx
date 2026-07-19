import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { skills } from "../data/content";
import { BREADBOARD, CHIP_POSITIONS, CHIP_SIZE } from "./layout";
import monoFont from "../assets/fonts/JetBrainsMono-Bold.ttf";

// Chips hover above the board and seat one-by-one as the visitor arrives —
// the "auto-populate cascade". Hovering a chip lights its traces.
const SEAT_TRIGGER = 0.26; // scroll progress at which the cascade starts
const DROP_HEIGHT = 2.6;
const REST_Y = CHIP_SIZE.h / 2 + 0.06;

function easeOutBack(t) {
  const c1 = 1.20158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function Chip({ skill, index, scrollRef, focusSkillRef }) {
  const group = useRef();
  const matRef = useRef();
  const started = useRef(-1);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (started.current < 0 && scrollRef.current > SEAT_TRIGGER) {
      started.current = state.clock.elapsedTime + index * 0.09;
    }
    let y = DROP_HEIGHT;
    if (started.current >= 0) {
      const t = THREE.MathUtils.clamp(
        (state.clock.elapsedTime - started.current) / 0.55,
        0,
        1
      );
      y = THREE.MathUtils.lerp(DROP_HEIGHT, REST_Y, easeOutBack(t));
    }
    g.position.y = y;

    const focused = focusSkillRef.current === skill.id;
    const seated = started.current >= 0;
    const target = focused ? 1.6 : seated ? 0.35 : 0.05;
    if (matRef.current) {
      matRef.current.emissiveIntensity = THREE.MathUtils.damp(
        matRef.current.emissiveIntensity,
        target,
        8,
        delta
      );
    }
  });

  const pos = CHIP_POSITIONS[index];
  return (
    <group
      ref={group}
      position={[pos.x, DROP_HEIGHT, pos.z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        focusSkillRef.current = skill.id;
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        focusSkillRef.current = null;
        document.body.style.cursor = "auto";
      }}
    >
      <mesh>
        <boxGeometry args={[CHIP_SIZE.w, CHIP_SIZE.h, CHIP_SIZE.d]} />
        <meshStandardMaterial
          ref={matRef}
          color="#101b18"
          roughness={0.4}
          metalness={0.35}
          emissive={skill.color}
          emissiveIntensity={0.05}
        />
      </mesh>
      <Text
        font={monoFont}
        position={[0, CHIP_SIZE.h / 2 + 0.012, 0.02]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.44}
        color="#d7e5e0"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
      >
        {skill.id}
      </Text>
    </group>
  );
}

export default function SkillChips({ scrollRef, focusSkillRef }) {
  // one instanced mesh for every chip's legs
  const pins = useMemo(() => {
    const count = skills.length * 8;
    const geo = new THREE.BoxGeometry(0.09, 0.1, 0.16);
    const mat = new THREE.MeshStandardMaterial({
      color: "#c9a24a",
      metalness: 0.9,
      roughness: 0.25,
    });
    const m = new THREE.InstancedMesh(geo, mat, count);
    const dummy = new THREE.Object3D();
    let i = 0;
    for (const posIdx in skills) {
      const p = CHIP_POSITIONS[posIdx];
      for (let side = -1; side <= 1; side += 2) {
        for (let k = 0; k < 4; k++) {
          dummy.position.set(
            p.x + side * (CHIP_SIZE.w / 2 + 0.09),
            0.05,
            p.z - CHIP_SIZE.d / 2 + 0.2 + k * ((CHIP_SIZE.d - 0.4) / 3)
          );
          dummy.updateMatrix();
          m.setMatrixAt(i++, dummy.matrix);
        }
      }
    }
    return m;
  }, []);

  return (
    <group>
      {/* breadboard base */}
      <mesh position={[BREADBOARD.x, 0.1, BREADBOARD.z]}>
        <boxGeometry args={[BREADBOARD.w, 0.2, BREADBOARD.d]} />
        <meshStandardMaterial color="#0d1917" roughness={0.7} metalness={0.15} />
      </mesh>
      <primitive object={pins} />
      {skills.map((s, i) => (
        <Chip
          key={s.id}
          skill={s}
          index={i}
          scrollRef={scrollRef}
          focusSkillRef={focusSkillRef}
        />
      ))}
    </group>
  );
}
