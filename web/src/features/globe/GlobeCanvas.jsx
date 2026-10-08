import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useSpin } from "./useSpin";
import { Markers } from "./Markers";
import { Planet } from "./Planet";
import { PLANET_RADIUS } from "./terrain";
import { Trees, Clouds, Ponds } from "./Scenery";

const CAMERA_DISTANCE = 7;
const FOCUS_DISTANCE = 5;

function Halo() {
  return (
    <mesh>
      <sphereGeometry args={[PLANET_RADIUS * 1.18, 48, 48]} />
      <meshBasicMaterial
        color='#bfe3c9'
        transparent
        opacity={0.3}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function World({ reducedMotion, focus, restaurants, regions }) {
  const { pitchRef, yawRef } = useSpin({
    damping: reducedMotion ? 30 : 3.5,
    instant: reducedMotion,
    focus,
    baseDistance: CAMERA_DISTANCE,
    focusDistance: FOCUS_DISTANCE,
    planetRadius: PLANET_RADIUS,
  });

  return (
    <group ref={pitchRef}>
      <group ref={yawRef}>
        <Planet />
        <Ponds />
        <Trees />
        <Markers restaurants={restaurants} regions={regions} />
      </group>
    </group>
  );
}

export default function GlobeCanvas({
  reducedMotion = false,
  animateClouds = false,
  focus = null,
  restaurants = [],
  regions = [],
}) {
  return (
    <Canvas
      flat
      frameloop='demand'
      dpr={[1, 2]}
      camera={{ position: [0, 0, CAMERA_DISTANCE], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
    >
      <directionalLight position={[5, 5.5, 5.5]} intensity={2.2} />
      <hemisphereLight args={["#ffffff", "#5b8a5f", 1.3]} />
      <ambientLight intensity={0.9} />
      <Halo />
      <Clouds animate={animateClouds} />
      <World
        reducedMotion={reducedMotion}
        focus={focus}
        restaurants={restaurants}
        regions={regions}
      />
    </Canvas>
  );
}
