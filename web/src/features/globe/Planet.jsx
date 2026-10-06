import { useMemo } from "react";
import * as THREE from "three";
import { PLANET_RADIUS, surfaceRadius } from "./terrain";

const LAND_COLOR = "#6cc070";

export function Planet() {
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(PLANET_RADIUS, 6);
    const position = geo.attributes.position;
    const point = new THREE.Vector3();

    for (let i = 0; i < position.count; i++) {
      point.fromBufferAttribute(position, i).normalize();
      const radius = surfaceRadius(point);
      point.multiplyScalar(radius);
      position.setXYZ(i, point.x, point.y, point.z);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={LAND_COLOR} flatShading roughness={0.95} />
    </mesh>
  );
}
