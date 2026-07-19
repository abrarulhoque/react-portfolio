import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Board from "./Board";
import CameraRig from "./CameraRig";
import Districts from "./Districts";
import EdgeConnector from "./EdgeConnector";
import Effects from "./Effects";
import ProjectModules from "./ProjectModules";
import RepoCity from "./RepoCity";
import SkillChips from "./SkillChips";
import Traces from "./Traces";

export default function Scene({ scrollRef, focusSkillRef, tier, onProjectClick }) {
  const high = tier === "high";
  return (
    <Canvas
      camera={{ fov: 50, near: 0.5, far: 170, position: [0, 17, 15] }}
      dpr={high ? [1, 1.75] : [1, 1.25]}
      gl={{
        antialias: !high,
        powerPreference: "high-performance",
        alpha: false,
      }}
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
      aria-hidden="true"
    >
      <color attach="background" args={["#04070a"]} />
      <fog attach="fog" args={["#04070a", 46, 135]} />

      <ambientLight intensity={0.55} color="#cfe8e0" />
      <directionalLight position={[6, 16, 6]} intensity={1.15} color="#e8f4ef" />
      <pointLight position={[0, 7, -93]} intensity={26} color="#2de2c3" distance={34} />
      <pointLight position={[-9, 5, -16]} intensity={14} color="#39d353" distance={22} />

      <Suspense fallback={null}>
        <Board />
        <Traces focusSkillRef={focusSkillRef} />
        <RepoCity />
        <SkillChips scrollRef={scrollRef} focusSkillRef={focusSkillRef} />
        <ProjectModules
          scrollRef={scrollRef}
          focusSkillRef={focusSkillRef}
          onProjectClick={onProjectClick}
        />
        <Districts />
        <EdgeConnector />
      </Suspense>

      <CameraRig scrollRef={scrollRef} />
      {high && <Effects />}
    </Canvas>
  );
}
