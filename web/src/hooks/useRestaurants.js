import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase.js";

const PHOTO_BUCKET = "restaurant-photos";

function getPhotoUrl(path) {
  if (!path) return null;
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
}

async function fetchRestaurants() {
  const { data, error } = await supabase
    .from("restaurants")
    .select(
      "id, slug, name, cuisine, price_level, lat, lng, photo_path, food_score, packaging_score, supply_score, verified, region:regions(slug, name)",
    )
    .order("name");

  if (error) throw error;

  return data.map((restaurant) => ({
    ...restaurant,
    photoUrl: getPhotoUrl(restaurant.photo_path),
  }));
}

export function useRestaurants() {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: fetchRestaurants,
  });
}
