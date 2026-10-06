import { Canvas } from "@react-three/fiber";
import { useSpin } from "./useSpin";
import { Markers } from "./Markers";

const PLANET_RADIUS = 1.6;

function Planet() {
  return (
    <mesh>
      <icosahedronGeometry args={[PLANET_RADIUS, 3]} />
      <meshStandardMaterial color='#3d9b5e' flatShading roughness={0.9} />
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
      frameloop='demand'
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
    >
      <hemisphereLight args={["#efeee7", "#08572a", 1.2]} />
      <directionalLight position={[4, 5, 3]} intensity={2.2} />
      <World
        reducedMotion={reducedMotion}
        restaurants={restaurants}
        regions={regions}
      />
    </Canvas>
  );
}
