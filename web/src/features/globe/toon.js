import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Dark green line used for every outline on the globe.
export const INK = "#3a5e43";

// Three flat bands of light (shadow, mid, lit) instead of a smooth fade.
// This is what gives the cel-shaded, illustrated look.
export const toonGradient = (() => {
  const steps = new Uint8Array([90, 180, 255]);
  const texture = new THREE.DataTexture(
    steps,
    steps.length,
    1,
    THREE.RedFormat,
  );
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
})();

// Outline trick: a slightly puffed-up copy of a shape, drawn inside-out in the
// ink color. Only its edges peek out from behind the real shape.
export const outlineMaterial = new THREE.MeshBasicMaterial({
  color: INK,
  side: THREE.BackSide,
});

// Makes the puffed-up copy by pushing every corner out along its normal.
// Corners are merged first so the outline has no gaps at sharp edges.
export function makeOutlineGeometry(geometry, thickness) {
  const source = geometry.clone();
  source.deleteAttribute("normal");
  source.deleteAttribute("uv");
  const merged = mergeVertices(source);
  merged.computeVertexNormals();

  const position = merged.attributes.position;
  const normal = merged.attributes.normal;
  for (let i = 0; i < position.count; i++) {
    position.setXYZ(
      i,
      position.getX(i) + normal.getX(i) * thickness,
      position.getY(i) + normal.getY(i) * thickness,
      position.getZ(i) + normal.getZ(i) * thickness,
    );
  }
  return merged;
}
