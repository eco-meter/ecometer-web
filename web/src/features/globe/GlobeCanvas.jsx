import { Canvas } from "@react-three/fiber";

const PLANET_RADIUS = 1.6;

function Planet() {
  return (
    <mesh>
      <icosahedronGeometry args={[PLANET_RADIUS, 3]} />
      <meshStandardMaterial color='#3d9b5e' flatShading roughness={0.9} />
    </mesh>
  );
}

export default function GlobeCanvas() {
  return (
    <Canvas
      frameloop='demand'
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ antialias: true, alpha: true }}
    >
      <hemisphereLight args={["#efeee7", "#08572a", 1.2]} />
      <directionalLight position={[4, 5, 3]} intensity={2.2} />
      <Planet />
    </Canvas>
  );
}
