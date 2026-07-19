import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";

// High-tier only — the lite tier relies on raw emissive colors instead.
export default function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        intensity={0.85}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.25}
      />
      <Vignette eskil={false} offset={0.22} darkness={0.72} />
    </EffectComposer>
  );
}
