// Shared score helpers. Each category is scored 0-100, so the total is out of 300.
export const MAX_CATEGORY = 100;
export const MAX_TOTAL = 300;

// Returns null until all three categories have a score.
export function getTotal(restaurant) {
  const scores = [
    restaurant.food_score,
    restaurant.packaging_score,
    restaurant.supply_score,
  ];
  if (scores.some((score) => score == null)) return null;
  return scores.reduce((sum, score) => sum + score, 0);
}
