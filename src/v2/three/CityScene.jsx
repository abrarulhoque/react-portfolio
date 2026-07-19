import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Grid, OrbitControls, Text } from "@react-three/drei";
import { easing } from "maath";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import Effects from "../../three/Effects.jsx";
import monoFont from "../../assets/fonts/JetBrainsMono-Bold.ttf";
import { beaconPos, buildings, oldest, totals } from "../cityData";
import Buildings from "./Buildings.jsx";

// Camera choreography: top-down blueprint view during boot, a slow
// descent to the overview corner as the city compiles, then OrbitControls
// take over (slow auto-orbit, fly-to on building select).
function Rig({ phase, builtRef, selected }) {
  const controlsRef = useRef();
  const { camera } = useThree();
  const vec = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const CENTER = useMemo(() => new THREE.Vector3(0, 1.5, 0), []);

  // skip (or a repeat visit) can enter city phase while the camera is
  // still way up in the boot position — cut straight to the overview
  useEffect(() => {
    if (phase === "city" && camera.position.y > 32) {
      camera.position.set(34, 20, 34);
    }
  }, [phase, camera]);

  useFrame((_, dt) => {
    if (phase !== "city") {
      const r = builtRef.current / buildings.length;
      const e = r * r * (3 - 2 * r);
      vec.set(
        THREE.MathUtils.lerp(0, 34, e),
        THREE.MathUtils.lerp(54, 20, e),
        THREE.MathUtils.lerp(10, 34, e)
      );
      easing.damp3(camera.position, vec, 1.1, dt);
      camera.lookAt(0, 1.5, 0);
      return;
    }
    const c = controlsRef.current;
    if (!c) return;
    if (selected) {
      vec.set(selected.x, selected.height * 0.5, selected.z);
      easing.damp3(c.target, vec, 0.45, dt);
      // keep the visitor's bearing — just come in close over the rooftops
      dir.copy(camera.position).sub(c.target);
      if (dir.lengthSq() < 1) dir.set(1, 1, 1);
      dir.y = Math.max(dir.y, 3);
      dir.setLength(8 + selected.footprint * 5);
      vec.copy(c.target).add(dir);
      easing.damp3(camera.position, vec, 0.6, dt);
    } else {
      easing.damp3(c.target, CENTER, 1.0, dt);
    }
  });

  return phase === "city" ? (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      enablePan={false}
      minDistance={7}
      maxDistance={95}
      maxPolarAngle={Math.PI * 0.47}
      autoRotate={!selected}
      autoRotateSpeed={0.35}
      target={[0, 1.5, 0]}
    />
  ) : null;
}

function ContactBeacon({ phase, onContact }) {
  const beamRef = useRef();
  const ringRef = useRef();
  const pos = useMemo(() => new THREE.Vector3(...beaconPos), []);

  useFrame((state) => {
    const pulse = (Math.sin(state.clock.elapsedTime * 2.2) + 1) / 2;
    // fade out when the orbiting camera swings right past the beacon,
    // otherwise the beam washes the whole frame
    const near = THREE.MathUtils.smoothstep(
      state.camera.position.distanceTo(pos),
      9,
      20
    );
    if (beamRef.current)
      beamRef.current.material.opacity = (0.5 + pulse * 0.45) * near;
    if (ringRef.current) {
      const s = 1 + pulse * 0.55;
      ringRef.current.scale.set(s, s, 1);
      ringRef.current.material.opacity = (0.75 - pulse * 0.5) * near;
    }
  });

  return (
    <group
      position={beaconPos}
      visible={phase === "city"}
      onClick={(e) => {
        e.stopPropagation();
        onContact();
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      <mesh ref={beamRef} position={[0, 7, 0]}>
        <cylinderGeometry args={[0.32, 0.55, 14, 12, 1, true]} />
        <meshBasicMaterial
          color="#2de2c3"
          transparent
          opacity={0.8}
          toneMapped={false}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[1.3, 1.85, 40]} />
        <meshBasicMaterial
          color="#2de2c3"
          transparent
          opacity={0.6}
          toneMapped={false}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <Billboard position={[0, 15.4, 0]}>
        <Text font={monoFont} fontSize={0.95} color="#2de2c3" anchorX="center">
          CONTACT
        </Text>
      </Billboard>
    </group>
  );
}

// Gold ring around the first-ever repo — About is anchored to it.
function AboutMarker({ phase, onSelect }) {
  return (
    <group
      position={[oldest.x, 0, oldest.z]}
      visible={phase !== "boot"}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(oldest);
      }}
      onPointerOver={() => (document.body.style.cursor = "pointer")}
      onPointerOut={() => (document.body.style.cursor = "")}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[oldest.footprint * 0.95, oldest.footprint * 1.25, 40]} />
        <meshBasicMaterial
          color="#e8b84b"
          toneMapped={false}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <Billboard position={[0, oldest.height + 1.5, 0]}>
        <Text font={monoFont} fontSize={0.55} color="#e8b84b" anchorX="center">
          {`EST.${totals.firstYear} · FIRST COMMIT`}
        </Text>
      </Billboard>
    </group>
  );
}

// Name labels over the tallest towers so the skyline reads at a glance.
function Landmarks({ phase }) {
  const top = useMemo(
    () =>
      buildings
        .slice()
        .sort((a, b) => b.commits - a.commits)
        .slice(0, 4)
        .filter((b) => b.name !== oldest.name),
    []
  );
  return (
    <group visible={phase === "city"}>
      {top.map((b) => (
        <Billboard key={b.name} position={[b.x, b.height + 1.1, b.z]}>
          <Text font={monoFont} fontSize={0.44} color="#93aca4" anchorX="center">
            {b.name.slice(0, 18)}
          </Text>
        </Billboard>
      ))}
    </group>
  );
}

export default function CityScene({
  tier,
  phase,
  builtRef,
  focusLang,
  selected,
  onSelect,
  onHover,
  onContact,
}) {
  return (
    <div className="v2-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, tier === "high" ? 1.75 : 1.3]}
        camera={{ fov: 42, near: 0.5, far: 300, position: [0, 54, 10] }}
        gl={{
          antialias: tier !== "high",
          powerPreference: "high-performance",
          alpha: false,
        }}
        onPointerMissed={() => onSelect(null)}
      >
        <color attach="background" args={["#04070a"]} />
        <fog attach="fog" args={["#04070a", 55, 170]} />

        <ambientLight intensity={0.45} />
        <directionalLight position={[18, 32, 8]} intensity={0.95} color="#cfeee6" />
        <pointLight
          position={[beaconPos[0], 10, beaconPos[2]]}
          intensity={40}
          color="#2de2c3"
        />

        {phase !== "boot" && (
          <Grid
            position={[0, -0.02, 0]}
            infiniteGrid
            cellSize={2}
            sectionSize={10}
            cellThickness={0.6}
            sectionThickness={1}
            cellColor="#0f2e27"
            sectionColor="#1d5648"
            fadeDistance={120}
            fadeStrength={2.5}
          />
        )}

        {/* everything that can suspend (drei Text fonts) stays inside this
            boundary — otherwise suspension unmounts the whole Canvas and
            kills the WebGL context under the composer */}
        <Suspense fallback={null}>
          <Buildings
            builtRef={builtRef}
            phase={phase}
            focusLang={focusLang}
            selectedName={selected?.name ?? null}
            onSelect={onSelect}
            onHover={onHover}
          />

          <ContactBeacon phase={phase} onContact={onContact} />
          <AboutMarker phase={phase} onSelect={onSelect} />
          <Landmarks phase={phase} />
        </Suspense>

        <Rig phase={phase} builtRef={builtRef} selected={selected} />

        {tier === "high" && <Effects />}
      </Canvas>
    </div>
  );
}
