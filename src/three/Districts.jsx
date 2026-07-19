import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { experience } from "../data/content";
import { SECTION_Z, XP_POSITIONS } from "./layout";
import monoFont from "../assets/fonts/JetBrainsMono-Bold.ttf";

// About district: power block + capacitors. Experience district: 4 chips on a bus.
export default function Districts() {
  const ledRef = useRef();

  useFrame((state) => {
    if (ledRef.current) {
      ledRef.current.emissiveIntensity =
        1.4 + Math.sin(state.clock.elapsedTime * 2.4) * 0.9;
    }
  });

  return (
    <group>
      {/* ---- ABOUT / PWR ---- */}
      <group position={[-8.5, 0, SECTION_Z.about + 2]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[3.4, 1, 2.6]} />
          <meshStandardMaterial color="#131f1c" roughness={0.4} metalness={0.35} />
        </mesh>
        <mesh position={[0, 1.05, 0.75]}>
          <boxGeometry args={[0.5, 0.12, 0.22]} />
          <meshStandardMaterial
            ref={ledRef}
            color="#0a1613"
            emissive="#39d353"
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
        <Text
          font={monoFont}
          position={[0, 1.02, -0.25]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.4}
          color="#e8f1ee"
          letterSpacing={0.1}
        >
          PWR-CORE
        </Text>
        <Text
          font={monoFont}
          position={[0, 1.02, 0.35]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.22}
          color="#5c7a71"
          letterSpacing={0.14}
        >
          EST. 2022 · ONLINE
        </Text>
      </group>

      {/* electrolytic capacitors next to the power block */}
      {[[-11.2, SECTION_Z.about + 0.4], [-10.4, SECTION_Z.about + 3.4], [-11.6, SECTION_Z.about + 2.2]].map(
        ([x, z], i) => (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.55, 0]}>
              <cylinderGeometry args={[0.42, 0.42, 1.1, 20]} />
              <meshStandardMaterial color="#1a2c36" roughness={0.35} metalness={0.5} />
            </mesh>
            <mesh position={[0, 1.12, 0]}>
              <cylinderGeometry args={[0.42, 0.42, 0.04, 20]} />
              <meshStandardMaterial color="#aab8bf" roughness={0.3} metalness={0.8} />
            </mesh>
          </group>
        )
      )}

      {/* ---- EXPERIENCE / XP-BUS ---- */}
      {experience.map((xp, i) => {
        const p = XP_POSITIONS[i];
        return (
          <group key={xp.company} position={[p.x, 0, p.z]}>
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[3, 0.6, 2]} />
              <meshStandardMaterial color="#131f1c" roughness={0.45} metalness={0.3} />
            </mesh>
            <Text
              font={monoFont}
              position={[0, 0.62, -0.3]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.34}
              color="#e8f1ee"
              letterSpacing={0.08}
            >
              {xp.company.toUpperCase().replace(" ", "-").slice(0, 10)}
            </Text>
            <Text
              font={monoFont}
              position={[0, 0.62, 0.3]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.22}
              color="#5c7a71"
              letterSpacing={0.1}
            >
              {xp.period.replace(" — ", "-")}
            </Text>
          </group>
        );
      })}
    </group>
  );
}
