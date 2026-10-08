import { REGION_PLACEMENTS } from "./regionPlacements";
import { globeToVector } from "./globeMath";

const DEG_TO_RAD = Math.PI / 180;

// Degrees added each region's patch.
const TOWN_PADDING = 1; // the pale "town" ground
const CLEARING_PADDING = 4; // where trees and ponds can't go

export const REGION_ZONES = Object.values(REGION_PLACEMENTS).map(
  (placement) => ({
    direction: globeToVector(placement.lat, placement.lng, 1),
    townRadius: (placement.spread / 2 + TOWN_PADDING) * DEG_TO_RAD,
    clearance: (placement.spread / 2 + CLEARING_PADDING) * DEG_TO_RAD,
  }),
);

export function isInTown(direction) {
  return REGION_ZONES.some(
    (zone) => direction.angleTo(zone.direction) < zone.townRadius,
  );
}

export function isClearOfRegions(direction) {
  return REGION_ZONES.every(
    (zone) => direction.angleTo(zone.direction) > zone.clearance,
  );
}
