import { useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { REGION_PLACEMENTS } from "./regionPlacements";
import { restaurantToGlobe } from "./globeMath";

// Sits markers just above teh surface so they don't clip into the planet.
const MARKER_LIFT = 0.02;

export function Markers({ restaurants, regions, radius }) {
  const placed = useMemo(() => {
    if (regions.length === 0) return [];

    const regionsBySlug = new Map(
      regions.map((region) => [region.slug, region]),
    );

    return restaurants.flatMap((restaurant) => {
      const slug = restaurant.region?.slug;
      const region = regionsBySlug.get(slug);
      const placement = REGION_PLACEMENTS[slug];

      if (!region || !placement) {
        console.warn(
          `[globe] No placement for region "${slug}". Skipping ${restaurant.name}.`,
        );
        return [];
      }

      return [
        {
          restaurant,
          position: restaurantToGlobe(
            restaurant,
            region,
            placement,
            radius + MARKER_LIFT,
          ),
        },
      ];
    });
  }, [restaurants, regions, radius]);

  // The canvas only redraws on demand, so ask for a frame when markers change.
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
  }, [placed, invalidate]);

  return (
    <>
      {placed.map(({ restaurant, position }) => (
        <mesh key={restaurant.id} position={position}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color='#efeee7' />
        </mesh>
      ))}
    </>
  );
}
