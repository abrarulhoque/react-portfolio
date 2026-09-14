import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  BufferGeometry,
  Float32BufferAttribute,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
} from "three";

function Orbit({ radius, rotation, opacity = 0.24, children }) {
  const geometry = useMemo(
    () =>
      new BufferGeometry().setFromPoints(
        Array.from({ length: 161 }, (_, i) => {
          const angle = (i / 160) * Math.PI * 2;
          return new Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0,
          );
        }),
      ),
    [radius],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <group rotation={rotation}>
      <lineLoop geometry={geometry}>
        <lineBasicMaterial color="#b7bcc3" transparent opacity={opacity} />
      </lineLoop>
      {children}
    </group>
  );
}
function LunarObjects({ paused, onReady, onLost }) {
  const moon = useRef();
  const satellite = useRef();
  const group = useRef();
  const time = useRef(0);
  const finePointer = useMemo(
    () => window.matchMedia("(pointer: fine)").matches,
    [],
  );
  const texture = useLoader(TextureLoader, "/images/moon-albedo.jpg");
  useEffect(() => {
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    onReady();
  }, [texture, onReady]);
  useFrame(({ pointer, gl }, delta) => {
    if (gl.getContext().isContextLost()) {
      onLost();
      return;
    }
    if (paused) return;
    const step = Math.min(delta, 0.05);
    time.current += step;
    moon.current.rotation.y += step * 0.028;
    const angle = time.current * 0.13 + 0.55;
    satellite.current.position.set(
      Math.cos(angle) * 2.38,
      Math.sin(angle) * 2.38,
      0,
    );
    const factor = 1 - Math.exp(-step * 2);
    const scroll = finePointer
      ? Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1)
      : 0;
    group.current.rotation.z +=
      (-0.1 - scroll * 0.14 - group.current.rotation.z) * factor;
    group.current.rotation.y +=
      ((finePointer ? pointer.x * 0.085 : 0) - group.current.rotation.y) *
      factor;
    group.current.rotation.x +=
      ((finePointer ? -pointer.y * 0.055 : 0) - group.current.rotation.x) *
      factor;
  });
  return (
    <group ref={group} rotation={[0.03, 0, -0.1]}>
      <ambientLight intensity={0.045} />
      <directionalLight position={[-3, 4, 5]} intensity={2.4} color="#eef0f4" />
      <mesh ref={moon} rotation={[0.15, 3.8, 0]}>
        <sphereGeometry args={[1.53, 80, 64]} />
        <meshStandardMaterial
          map={texture}
          bumpMap={texture}
          bumpScale={0.035}
          roughness={1}
          metalness={0}
        />
      </mesh>
      <Orbit radius={2.38} rotation={[1.1, 0.35, -0.33]}>
        <mesh ref={satellite} position={[2.03, 1.24, 0]}>
          <sphereGeometry args={[0.041, 12, 12]} />
          <meshBasicMaterial color="#f4f4f2" />
        </mesh>
      </Orbit>
      <Orbit radius={2.69} rotation={[0.7, -0.7, 0.78]} opacity={0.1} />
    </group>
  );
}
function Stars() {
  const geometry = useMemo(() => {
    const positions = [];
    let seed = 312;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 95; i++)
      positions.push(
        (random() - 0.5) * 15,
        (random() - 0.5) * 12,
        -3 - random() * 3,
      );
    return new BufferGeometry().setAttribute(
      "position",
      new Float32BufferAttribute(positions, 3),
    );
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <points geometry={geometry}>
      <pointsMaterial
        color="#b8bcc5"
        size={0.012}
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}
export default function MoonScene({ paused }) {
  const container = useRef();
  const [visible, setVisible] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(!document.hidden);
  const [ready, setReady] = useState(false);
  const [lost, setLost] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(container.current);
    const change = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", change);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", change);
    };
  }, []);
  const running = !paused && visible && documentVisible;
  return (
    <div
      ref={container}
      className={`moon-canvas ${ready && !lost ? "is-ready" : ""}`}
      aria-hidden="true"
    >
      {!lost && (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 7.6], fov: 40 }}
          gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
          frameloop={running ? "always" : "demand"}
          fallback={null}
          onCreated={({ gl }) => {
            gl.setClearColor("#08090b", 1);
          }}
        >
          <Suspense fallback={null}>
            <LunarObjects
              paused={!running}
              onReady={() => setReady(true)}
              onLost={() => setLost(true)}
            />
            <Stars />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
