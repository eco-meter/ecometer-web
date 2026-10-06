export const PLANET_RADIUS = 1.6;

const HILL_HEIGHT = 0.018;

// Gentle rolling hills. Used by the planet mesh, and by trees and houses
// so they sit on the hills instead of floating above or sinking into them.
export function terrainOffset(direction) {
  const { x, y, z } = direction;
  const wave =
    0.5 * Math.sin(x * 3) +
    0.5 * Math.sin(y * 4 + 1) +
    0.5 * Math.sin(z * 5 + 2);
  return wave * HILL_HEIGHT;
}

export function surfaceRadius(direction) {
  return PLANET_RADIUS + terrainOffset(direction);
}
