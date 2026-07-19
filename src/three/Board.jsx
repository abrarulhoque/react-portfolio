import { Text } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { BOARD, SECTION_Z } from "./layout";
import monoFont from "../assets/fonts/JetBrainsMono-Bold.ttf";

// Solder-mask plane with a procedural copper grid — no texture downloads.
const boardMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uBase: { value: new THREE.Color("#071310") },
    uLine: { value: new THREE.Color("#0f2a24") },
  },
  vertexShader: /* glsl */ `
    varying vec2 vWorldXZ;
    void main() {
      vec4 wp = modelMatrix * vec4(position, 1.0);
      vWorldXZ = wp.xz;
      gl_Position = projectionMatrix * viewMatrix * wp;
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 uBase;
    uniform vec3 uLine;
    varying vec2 vWorldXZ;
    void main() {
      vec2 g = abs(fract(vWorldXZ) - 0.5);
      float grid = smoothstep(0.47, 0.5, max(g.x, g.y));
      vec2 g4 = abs(fract(vWorldXZ / 4.0) - 0.5);
      float grid4 = smoothstep(0.485, 0.5, max(g4.x, g4.y));
      vec3 col = mix(uBase, uLine, grid * 0.35 + grid4 * 0.5);
      gl_FragColor = vec4(col, 1.0);
    }
  `,
});

function Silkscreen({ children, position, size = 0.6, color = "#9db4ac", anchorX = "center", opacity = 1 }) {
  return (
    <Text
      font={monoFont}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      fontSize={size}
      color={color}
      anchorX={anchorX}
      anchorY="middle"
      fillOpacity={opacity}
      letterSpacing={0.08}
    >
      {children}
    </Text>
  );
}

// A few hundred tiny SMD resistors/capacitors scattered for realism
function SmdScatter() {
  const { positions, count } = useMemo(() => {
    // deterministic PRNG so the board looks identical every visit
    let s = 42;
    const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const pts = [];
    const forbidden = (x, z) =>
      (Math.abs(x) < 7 && z > -70 && z < -32) || // skills + projects districts
      (Math.abs(x) < 7.5 && z > -80 && z < -73) || // xp bus
      (Math.abs(x) < 8 && z > -96 && z < -90); // edge connector
    for (let i = 0; i < 260; i++) {
      const x = (rand() - 0.5) * (BOARD.width - 4);
      const z = 8 - rand() * 110;
      if (forbidden(x, z)) continue;
      pts.push({ x, z, r: rand() });
    }
    return { positions: pts, count: pts.length };
  }, []);

  const mesh = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.34, 0.1, 0.18);
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0.3 });
    const m = new THREE.InstancedMesh(geo, mat, count);
    const dummy = new THREE.Object3D();
    const shades = ["#1c2a27", "#23332e", "#31241c", "#20303c"];
    const c = new THREE.Color();
    positions.forEach((p, i) => {
      dummy.position.set(p.x, 0.05, p.z);
      dummy.rotation.y = p.r > 0.5 ? Math.PI / 2 : 0;
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, c.set(shades[Math.floor(p.r * 4)]));
    });
    m.instanceMatrix.needsUpdate = true;
    return m;
  }, [positions, count]);

  return <primitive object={mesh} />;
}

export default function Board() {
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, BOARD.centerZ]}
        material={boardMaterial}
      >
        <planeGeometry args={[BOARD.width, BOARD.length]} />
      </mesh>

      {/* hero silkscreen — faint, reads as board texture under the DOM headline */}
      <Silkscreen
        position={[0, 0.02, SECTION_Z.home - 3]}
        size={2.2}
        color="#3d564e"
        opacity={0.55}
      >
        ABRARUL HOQUE
      </Silkscreen>
      <Silkscreen
        position={[0, 0.02, SECTION_Z.home - 0.6]}
        size={0.72}
        color="#33473f"
        opacity={0.5}
      >
        WEB DESIGNER + DEVELOPER — BOARD REV 2.0
      </Silkscreen>

      {/* district labels */}
      <Silkscreen position={[-9, 0.02, SECTION_Z.about + 4]} size={0.55} color="#5c7a71" anchorX="left">
        [ PWR ] ABOUT
      </Silkscreen>
      <Silkscreen position={[-9, 0.02, SECTION_Z.skills + 6.6]} size={0.55} color="#5c7a71" anchorX="left">
        [ SKL-GRID ] SKILLS
      </Silkscreen>
      <Silkscreen position={[-9, 0.02, SECTION_Z.projects + 10]} size={0.55} color="#5c7a71" anchorX="left">
        [ PRJ ] SELECTED WORK
      </Silkscreen>
      <Silkscreen position={[-9, 0.02, SECTION_Z.experience + 3.5]} size={0.55} color="#5c7a71" anchorX="left">
        [ XP-BUS ] EXPERIENCE
      </Silkscreen>
      <Silkscreen position={[-7, 0.02, SECTION_Z.contact + 2.5]} size={0.55} color="#5c7a71" anchorX="left">
        [ I/O ] CONTACT
      </Silkscreen>

      <SmdScatter />
    </group>
  );
}
