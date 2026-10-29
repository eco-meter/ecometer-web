import { globeToVector } from "./globeMath";
import { PLANET_RADIUS } from "./terrain";

const DEG_TO_RAD = Math.PI / 180;
const TREE_GAP = 3 * DEG_TO_RAD; // keeps trees off the mountain slopes

// Hand-placed mountains; lat/lng on the stylized globe (not real places),
// size = how wide the base is. Kept away from the four regions.
export const MOUNTAINS = [
  { lat: 50, lng: -6, size: 0.18 },
  { lat: 46, lng: 10, size: 0.14 },
  { lat: -26, lng: -150, size: 0.15 },
  { lat: 26, lng: 150, size: 0.17 },
].map((mountain) => ({
  ...mountain,
  direction: globeToVector(mountain.lat, mountain.lng, 1),
  angle: mountain.size / PLANET_RADIUS,
}));

export function isClearOfMountains(direction) {
  return MOUNTAINS.every(
    (mountain) =>
      direction.angleTo(mountain.direction) > mountain.angle + TREE_GAP,
  );
}
