import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { CAMERA_WAYPOINTS } from "./layout";

// Scroll owns the camera: progress [0..1] is damped, then sampled along two
// CatmullRom curves (position + lookAt). Pointer adds a whisper of parallax.
export default function CameraRig({ scrollRef }) {
  const { camera, pointer } = useThree();

  const { posCurve, lookCurve } = useMemo(() => {
    const pos = new THREE.CatmullRomCurve3(
      CAMERA_WAYPOINTS.map((w) => new THREE.Vector3(...w.pos)),
      false,
      "centripetal"
    );
    const look = new THREE.CatmullRomCurve3(
      CAMERA_WAYPOINTS.map((w) => new THREE.Vector3(...w.look)),
      false,
      "centripetal"
    );
    return { posCurve: pos, lookCurve: look };
  }, []);

  const p = useRef(0);
  const target = useRef(new THREE.Vector3());
  const eye = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    p.current = THREE.MathUtils.damp(p.current, scrollRef.current, 3.2, delta);
    const t = THREE.MathUtils.clamp(p.current, 0, 1);
    posCurve.getPoint(t, eye.current);
    lookCurve.getPoint(t, target.current);
    eye.current.x += pointer.x * 0.55;
    eye.current.y += pointer.y * 0.3;
    camera.position.copy(eye.current);
    camera.lookAt(target.current);
  });

  return null;
}
