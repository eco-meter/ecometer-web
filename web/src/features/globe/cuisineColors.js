// Roof colors on the globe, one per cuisine. Uses the illustration palette where it has a fit. Seafood and Lebanese have no palette match, so they use muted colors chosen to sit alongside it.

export const CUISINE_COLORS = {
  Pizza: "#d9472e", // tomato red
  Mexican: "#e8a33d", // citrus yellow
  Cafe: "#c68a4e", // bread tan
  Vegan: "#3d9b5e", // leaf green
  Healthy: "#0ea54e", // brand green
  Seafood: "#3e8fb0",
  Lebanese: "#b5643c",
};

const FALLBACK_COLOR = "#8a8a80";

export function getCuisineColor(cuisine) {
  return CUISINE_COLORS[cuisine] ?? FALLBACK_COLOR;
}
