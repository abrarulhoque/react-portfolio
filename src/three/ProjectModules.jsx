import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { projects, skills } from "../data/content";
import { MODULE_POSITIONS, MODULE_SIZE } from "./layout";
import monoFont from "../assets/fonts/JetBrainsMono-Bold.ttf";

const POWER_TRIGGER = 0.47; // scroll progress where modules begin powering up

// which skills feed each project (inverted index for focus lookups)
const projectSkills = {};
for (const s of skills) {
  for (const pid of s.projects) {
    (projectSkills[pid] ||= []).push(s.id);
  }
}

function Module({ project, index, scrollRef, focusSkillRef, onProjectClick }) {
  const ledRef = useRef();
  const bodyRef = useRef();
  const pos = MODULE_POSITIONS[index];

  useFrame((state, delta) => {
    const focus = focusSkillRef.current;
    const linked = focus && (projectSkills[project.id] || []).includes(focus);
    const powered =
      scrollRef.current > POWER_TRIGGER + index * 0.012 || linked;
    const ledTarget = linked ? 3.2 : powered ? 1.6 : 0.04;
    const bodyTarget = linked ? 0.5 : powered ? 0.12 : 0.0;
    if (ledRef.current) {
      ledRef.current.emissiveIntensity = THREE.MathUtils.damp(
        ledRef.current.emissiveIntensity,
        ledTarget,
        6,
        delta
      );
    }
    if (bodyRef.current) {
      bodyRef.current.emissiveIntensity = THREE.MathUtils.damp(
        bodyRef.current.emissiveIntensity,
        bodyTarget,
        6,
        delta
      );
    }
  });

  return (
    <group
      position={[pos.x, MODULE_SIZE.h / 2, pos.z]}
      onClick={(e) => {
        e.stopPropagation();
        onProjectClick?.(project.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <mesh>
        <boxGeometry args={[MODULE_SIZE.w, MODULE_SIZE.h, MODULE_SIZE.d]} />
        <meshStandardMaterial
          ref={bodyRef}
          color="#131f1c"
          roughness={0.45}
          metalness={0.3}
          emissive="#2de2c3"
          emissiveIntensity={0}
        />
      </mesh>
      {/* status LED strip along the outer edge */}
      <mesh
        position={[
          pos.x > 0 ? MODULE_SIZE.w / 2 - 0.12 : -MODULE_SIZE.w / 2 + 0.12,
          MODULE_SIZE.h / 2 + 0.01,
          0,
        ]}
      >
        <boxGeometry args={[0.14, 0.04, MODULE_SIZE.d - 0.5]} />
        <meshStandardMaterial
          ref={ledRef}
          color="#0a1613"
          emissive="#2de2c3"
          emissiveIntensity={0.04}
          toneMapped={false}
        />
      </mesh>
      <Text
        font={monoFont}
        position={[0, MODULE_SIZE.h / 2 + 0.012, -0.35]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.44}
        color="#e8f1ee"
        anchorX="center"
        letterSpacing={0.08}
      >
        {project.chip}
      </Text>
      <Text
        font={monoFont}
        position={[0, MODULE_SIZE.h / 2 + 0.012, 0.35]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.26}
        color="#5c7a71"
        anchorX="center"
        letterSpacing={0.12}
      >
        {`U${project.id} · ${project.tech[0].toUpperCase()}`}
      </Text>
    </group>
  );
}

export default function ProjectModules({ scrollRef, focusSkillRef, onProjectClick }) {
  // gold pins for all modules in one instanced mesh
  const pins = useMemo(() => {
    const perSide = 6;
    const count = projects.length * perSide * 2;
    const geo = new THREE.BoxGeometry(0.16, 0.1, 0.3);
    const mat = new THREE.MeshStandardMaterial({
      color: "#c9a24a",
      metalness: 0.9,
      roughness: 0.25,
    });
    const m = new THREE.InstancedMesh(geo, mat, count);
    const dummy = new THREE.Object3D();
    let i = 0;
    MODULE_POSITIONS.forEach((p) => {
      for (let side = -1; side <= 1; side += 2) {
        for (let k = 0; k < perSide; k++) {
          dummy.position.set(
            p.x - MODULE_SIZE.w / 2 + 0.35 + k * ((MODULE_SIZE.w - 0.7) / (perSide - 1)),
            0.05,
            p.z + side * (MODULE_SIZE.d / 2 + 0.16)
          );
          dummy.updateMatrix();
          m.setMatrixAt(i++, dummy.matrix);
        }
      }
    });
    return m;
  }, []);

  return (
    <group>
      <primitive object={pins} />
      {projects.map((p, i) => (
        <Module
          key={p.id}
          project={p}
          index={i}
          scrollRef={scrollRef}
          focusSkillRef={focusSkillRef}
          onProjectClick={onProjectClick}
        />
      ))}
    </group>
  );
}
