import { useMemo } from "react";
import * as THREE from "three";
import { PLANET_RADIUS, surfaceRadius } from "./terrain";
import { smoothNoise } from "./noise";
import { isInTown } from "./regionZones";

const MEADOW_COLORS = ["#5fb466", "#6cc070", "#79c977", "#68bb6a"];
const TOWN_COLOR = "#a7db8c";
const PATCH_SCALE = 2.4;

export function Planet() {
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(PLANET_RADIUS, 6);
    const position = geo.attributes.position;
    const point = new THREE.Vector3();

    for (let i = 0; i < position.count; i++) {
      point.fromBufferAttribute(position, i).normalize();
      point.multiplyScalar(surfaceRadius(point));
      position.setXYZ(i, point.x, point.y, point.z);
    }

    // One colour per triangle. Each triangle owns its 3 corners in this geometry, so colouring all 3 the same gives crisp facets.
    const colors = new Float32Array(position.count * 3);
    const palette = MEADOW_COLORS.map((color) => new THREE.Color(color));
    const town = new THREE.Color(TOWN_COLOR);
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();

    for (let i = 0; i < position.count; i += 3) {
      a.fromBufferAttribute(position, i);
      b.fromBufferAttribute(position, i + 1);
      c.fromBufferAttribute(position, i + 2);
      const centre = a.add(b).add(c).normalize();

      const patch = Math.min(
        palette.length - 1,
        Math.floor(smoothNoise(centre, PATCH_SCALE) * palette.length),
      );
      const color = isInTown(centre) ? town : palette[patch];

      for (let k = 0; k < 3; k++) color.toArray(colors, (i + k) * 3);
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh
      geometry={geometry}
      onPointerOver={(event) => event.stopPropagation()}
    >
      <meshStandardMaterial vertexColors flatShading roughness={0.95} />
    </mesh>
  );
}
