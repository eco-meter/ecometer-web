import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSpin } from "./useSpin";
import { Markers } from "./Markers";
import { Planet } from "./Planet";
import { PLANET_RADIUS } from "./terrain";
import { Trees, Clouds, Ponds } from "./Scenery";
import { Mountains, Flowers } from "./Landscape";

const FOV = 35;
const FILL = 0.9; // planet fills 90% of the canvas's shorter side
const FOCUS_RATIO = 0.75; // region view sits 25% closer than the default

// How far the camera needs to be for the planet to fill the canvas.
// Portrait screens (phones) are limited by width, so the camera backs off.
function fitDistance(aspect) {
  const halfFov = THREE.MathUtils.degToRad(FOV / 2);
  return PLANET_RADIUS / (FILL * Math.tan(halfFov) * Math.min(1, aspect));
}

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
  const aspect = useThree((state) => state.size.width / state.size.height);
  const baseDistance = fitDistance(aspect);

  const { pitchRef, yawRef } = useSpin({
    damping: reducedMotion ? 30 : 3.5,
    instant: reducedMotion,
    focus,
    baseDistance,
    focusDistance: baseDistance * FOCUS_RATIO,
    planetRadius: PLANET_RADIUS,
  });

  return (
    <group ref={pitchRef}>
      <group ref={yawRef}>
        <Planet />
        <Ponds />
        <Mountains />
        <Trees />
        <Flowers />
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
      camera={{ position: [0, 0, 7], fov: FOV }}
      gl={{ antialias: true, alpha: true }}
    >
      <directionalLight position={[5, 5.5, 5.5]} intensity={2.6} />
      <hemisphereLight args={["#ffffff", "#5b8a5f", 0.55]} />
      <ambientLight intensity={0.35} />
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
