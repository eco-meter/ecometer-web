import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { useSpin } from "./useSpin";
import { Markers } from "./Markers";
import { Planet } from "./Planet";
import { PLANET_RADIUS } from "./terrain";

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

function World({ reducedMotion, restaurants, regions }) {
  const { pitchRef, yawRef } = useSpin({
    damping: reducedMotion ? 30 : 3.5,
  });

  return (
    <group ref={pitchRef}>
      <group ref={yawRef}>
        <Planet />
        <Markers
          restaurants={restaurants}
          regions={regions}
          radius={PLANET_RADIUS}
        />
      </group>
    </group>
  );
}

export default function GlobeCanvas({
  reducedMotion = false,
  restaurants = [],
  regions = [],
}) {
  return (
    <Canvas
      flat
      frameloop='demand'
      dpr={[1, 2]}
      camera={{ position: [0, 0, 7], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
    >
      <directionalLight position={[5, 5.5, 5.5]} intensity={2.2} />
      <hemisphereLight args={["#ffffff", "#335533", 1.1]} />
      <ambientLight intensity={0.5} />
      <Halo />
      <World
        reducedMotion={reducedMotion}
        restaurants={restaurants}
        regions={regions}
      />
    </Canvas>
  );
}
