import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

async function fetchRegions() {
  const { data, error } = await supabase
    .from("regions")
    .select(
      "id, slug, name, area, min_lat, max_lat, min_lng, max_lng, sort_order, is_default",
    )
    .order("sort_order");

  if (error) throw error;
  return data;
}

export function useRegions() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
  });
}
