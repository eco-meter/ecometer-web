import * as THREE from "three";

const DEG_TO_RAD = Math.PI / 180;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Turns a globe lat/lng (in degrees) into a 3D point on a sphere.
export function globeToVector(lat, lng, radius) {
  const phi = lat * DEG_TO_RAD;
  const theta = lng * DEG_TO_RAD;

  return new THREE.Vector3(
    radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.cos(theta),
  );
}

// Where a value falls between min and max, as -1 (min) to 1 (max).
function normalize(value, min, max) {
  if (max === min) return 0;
  return clamp(((value - min) / (max - min)) * 2 - 1, -1, 1);
}

// Places a restaurant inside its region's patch on the globe
export function restaurantToGlobe(restaurant, region, placement, radius) {
  const x = normalize(restaurant.lng, region.min_lng, region.max_lng);
  const y = normalize(restaurant.lat, region.min_lat, region.max_lat);

  return globeToVector(
    placement.lat + y * (placement.spread / 2),
    placement.lng + x * (placement.spread / 2),
    radius,
  );
}
