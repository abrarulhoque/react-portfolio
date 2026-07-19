import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { EDGE_CONNECTOR } from "./layout";
import monoFont from "../assets/fonts/JetBrainsMono-Bold.ttf";

// Gold-fingered I/O port at the end of the board — the contact section's anchor.
export default function EdgeConnector() {
  const { z, pinCount, width } = EDGE_CONNECTOR;
  const ledRef = useRef();

  const pins = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.34, 0.06, 1.9);
    const mat = new THREE.MeshStandardMaterial({
      color: "#e8b84b",
      metalness: 0.95,
      roughness: 0.2,
      emissive: "#e8b84b",
      emissiveIntensity: 0.12,
    });
    const m = new THREE.InstancedMesh(geo, mat, pinCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < pinCount; i++) {
      dummy.position.set(
        -width / 2 + (i * width) / (pinCount - 1),
        0.04,
        z - 0.6
      );
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    return m;
  }, [z, pinCount, width]);

  useFrame((state) => {
    if (ledRef.current) {
      ledRef.current.emissiveIntensity =
        1.6 + Math.sin(state.clock.elapsedTime * 3.2) * 1.1;
    }
  });

  return (
    <group>
      <primitive object={pins} />
      {/* connector housing */}
      <mesh position={[0, 0.45, z - 2.4]}>
        <boxGeometry args={[width + 2.4, 0.9, 1.4]} />
        <meshStandardMaterial color="#0d1917" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* blinking TX/RX LED */}
      <mesh position={[width / 2 + 1.9, 0.25, z - 0.6]}>
        <boxGeometry args={[0.3, 0.14, 0.3]} />
        <meshStandardMaterial
          ref={ledRef}
          color="#0a1613"
          emissive="#2de2c3"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      <Text
        font={monoFont}
        position={[3.4, 0.02, z + 2.4]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.62}
        color="#c8d8d2"
        letterSpacing={0.14}
      >
        I/O PORT — OPEN FOR PROJECTS
      </Text>
    </group>
  );
}
