import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { CanvasTexture, FileLoader, SRGBColorSpace } from "three";
import { salesById } from "./countrySales";

function createMap(source) {
  const { width, height, countries } = JSON.parse(source);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  const picking = document.createElement("canvas");
  picking.width = width;
  picking.height = height;
  const pickContext = picking.getContext("2d", { willReadFrequently: true });
  const paths = new Map();
  const countryIds = [];
  context.fillStyle = "#172126";
  context.fillRect(0, 0, width, height);

  // Fine geographic grid, visible only in the oceans.
  context.strokeStyle = "#263136";
  context.lineWidth = 0.6;
  context.beginPath();
  for (let x = 0; x <= width; x += width / 24) {
    context.moveTo(x, 0);
    context.lineTo(x, height);
  }
  for (let y = 0; y <= height; y += height / 12) {
    context.moveTo(0, y);
    context.lineTo(width, y);
  }
  context.stroke();

  countries.forEach((country, index) => {
    const path = new Path2D(country.path);
    paths.set(country.id, path);
    countryIds[index + 1] = country.id;
    context.fillStyle = salesById.has(country.id) ? "#a5b995" : "#41494b";
    context.fill(path);
    context.strokeStyle = "#222c2d";
    context.lineWidth = 0.65;
    context.stroke(path);
    // Flat country IDs permit exact UV picking, including disconnected islands.
    pickContext.fillStyle = `rgb(${index + 1}, 0, 0)`;
    pickContext.fill(path);
  });
  const image = pickContext.getImageData(0, 0, width, height).data;
  const surface = document.createElement("canvas");
  surface.width = width;
  surface.height = height;
  const surfaceContext = surface.getContext("2d");
  surfaceContext.drawImage(canvas, 0, 0);
  const texture = new CanvasTexture(surface);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return {
    texture,
    highlight(id) {
      surfaceContext.drawImage(canvas, 0, 0);
      const path = paths.get(id);
      if (path) {
        surfaceContext.fillStyle = "#e4efcc";
        surfaceContext.fill(path);
        surfaceContext.strokeStyle = "#eff6db";
        surfaceContext.lineWidth = 1.4;
        surfaceContext.stroke(path);
      }
      texture.needsUpdate = true;
    },
    pick(uv) {
      const x = Math.min(width - 1, Math.max(0, Math.floor(uv.x * width)));
      const y = Math.min(height - 1, Math.max(0, Math.floor((1 - uv.y) * height)));
      const offset = (y * width + x) * 4;
      // Ignore antialiased coastline pixels to avoid interpreting blended IDs.
      return image[offset + 3] === 255 ? salesById.get(countryIds[image[offset]]) : null;
    },
  };
}

function Earth({ controls, active, paused, selectedId, pinnedCountry, onHover, onSelect, onReady, onFailure }) {
  const group = useRef();
  const source = useLoader(FileLoader, "/data/world-countries.json");
  const map = useMemo(() => createMap(source), [source]);
  const { gl, invalidate } = useThree();

  useEffect(() => {
    const state = controls.current;
    state.invalidate = invalidate;
    const canvas = gl.domElement;
    const lost = (event) => {
      event.preventDefault();
      onFailure();
    };
    canvas.addEventListener("webglcontextlost", lost);
    onReady();
    return () => {
      canvas.removeEventListener("webglcontextlost", lost);
      state.invalidate = null;
      map.texture.dispose();
    };
  }, [controls, gl, invalidate, map, onFailure, onReady]);

  useEffect(() => {
    map.highlight(selectedId);
    invalidate();
  }, [map, selectedId, invalidate]);

  useFrame((_, delta) => {
    const state = controls.current;
    const step = Math.min(delta, 0.04);
    if (state.target) {
      const factor = paused ? 1 : 1 - Math.exp(-step * 7);
      state.x += (state.target.x - state.x) * factor;
      state.y += (state.target.y - state.y) * factor;
      if (Math.abs(state.target.x - state.x) + Math.abs(state.target.y - state.y) < 0.001) {
        state.target = null;
      } else invalidate();
    } else if (active && !paused && !state.dragging && !state.hovering && !state.focused && !selectedId) {
      state.y += step * 0.055;
      state.x += (22 * Math.PI / 180 - state.x) * step * 0.2;
      state.y += state.velocity * step * 60;
      state.velocity *= Math.exp(-step * 5);
    }
    group.current.rotation.set(state.x, state.y, 0);
  });

  function hover(event) {
    event.stopPropagation();
    if (!controls.current.dragging) onHover(map.pick(event.uv) || null, event);
  }

  return (
    <>
      <ambientLight intensity={1.4} />
      <directionalLight position={[-3, 4, 5]} intensity={2.6} color="#edf1e7" />
      <directionalLight position={[4, -1, -3]} intensity={1.2} color="#839da5" />
      <group ref={group}>
        <mesh
          onPointerMove={hover}
          onPointerOut={() => onHover(null)}
          onClick={(event) => {
            event.stopPropagation();
            if (!controls.current.moved) onSelect(map.pick(event.uv) || null);
          }}
        >
          <sphereGeometry args={[1.7, 96, 64]} />
          <meshStandardMaterial map={map.texture} roughness={0.84} metalness={0.15} />
        </mesh>
        {pinnedCountry && (
          <mesh position={[
            1.725 * Math.cos(pinnedCountry.latitude * Math.PI / 180) * Math.cos(pinnedCountry.longitude * Math.PI / 180),
            1.725 * Math.sin(pinnedCountry.latitude * Math.PI / 180),
            -1.725 * Math.cos(pinnedCountry.latitude * Math.PI / 180) * Math.sin(pinnedCountry.longitude * Math.PI / 180),
          ]} raycast={() => null}>
            <sphereGeometry args={[0.019, 12, 12]} />
            <meshBasicMaterial color="#f2f5e9" />
          </mesh>
        )}
      </group>
    </>
  );
}

export default function EarthScene(props) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6.8], fov: 40 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      frameloop={props.active && !props.paused ? "always" : "demand"}
      fallback={null}
    >
      <Suspense fallback={null}>
        <Earth {...props} />
      </Suspense>
    </Canvas>
  );
}
