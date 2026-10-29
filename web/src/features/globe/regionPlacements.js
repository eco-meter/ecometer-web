// Where each region sits on the stylized globe. These are NOT real coordinates.
// lat/lng are degrees on the globe itself: lat 0, lng 0 faces the viewer at load.
// Positive lng is to the right, positive lat is up.
// spread = how many degrees across that region's patch is.
//
// Adding a region in Supabase without adding it here means its restaurants
// won't appear on the globe (they still show in listings).

export const REGION_PLACEMENTS = {
  downtown: { lat: 12, lng: -18, spread: 16 },
  burnaby: { lat: 14, lng: 8, spread: 8 },
  richmond: { lat: -14, lng: -14, spread: 8 },
  surrey: { lat: -6, lng: 22, spread: 10 },
};
