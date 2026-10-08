import { useEffect, useMemo, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import { REGION_PLACEMENTS } from "./regionPlacements";
import { restaurantToGlobe } from "./globeMath";
import { surfaceRadius } from "./terrain";
import { getCuisineColor } from "./cuisineColors";

const WALL_COLOR = "#faf6ec";
const DOOR_COLOR = "#5a4030";

// Turns each house slightly so you see its front, side and roof.
const HOUSE_TILT = 0.25;
const HOUSE_TURN = -0.5;

function HouseCard({ restaurant }) {
  return (
    <div className='house-card'>
      {restaurant.photoUrl && (
        <img src={restaurant.photoUrl} alt='' className='house-card__photo' />
      )}
      <div className='house-card__body'>
        <p className='house-card__name'>{restaurant.name}</p>
        <p className='house-card__tag'>
          {restaurant.cuisine} • {"$".repeat(restaurant.price_level)}
        </p>
      </div>
    </div>
  );
}

function House({ restaurant, position, hovered, onHover }) {
  const invalidate = useThree((state) => state.invalidate);
  const roofColor = getCuisineColor(restaurant.cuisine);

  // Redraw when hover changes, since the canvas only draws on demand.
  useEffect(() => {
    invalidate();
  }, [hovered, invalidate]);

  const handlePointerOver = (event) => {
    // Ignore houses the mouse passes over while dragging the globe.
    if (event.pointerType === "mouse" && event.buttons > 0) return;
    event.stopPropagation();
    onHover(restaurant.id);
  };

  const handlePointerOut = () => {
    onHover((current) => (current === restaurant.id ? null : current));
  };

  return (
    <Billboard position={position}>
      <group rotation={[HOUSE_TILT, HOUSE_TURN, 0]} scale={hovered ? 1.15 : 1}>
        <mesh position-y={0.035}>
          <boxGeometry args={[0.09, 0.07, 0.07]} />
          <meshStandardMaterial color={WALL_COLOR} flatShading />
        </mesh>
        <mesh position-y={0.1} rotation-y={Math.PI / 4}>
          <coneGeometry args={[0.075, 0.06, 4]} />
          <meshStandardMaterial color={roofColor} flatShading />
        </mesh>
        <mesh position={[0, 0.02, 0.0355]}>
          <boxGeometry args={[0.022, 0.04, 0.002]} />
          <meshStandardMaterial color={DOOR_COLOR} />
        </mesh>
      </group>

      {/* Invisible, larger hover target so small houses are easy to hit. */}
      <mesh
        position-y={0.06}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} />
      </mesh>

      {hovered && (
        <Html
          position={[0, 0.16, 0]}
          zIndexRange={[5, 0]}
          style={{ pointerEvents: "none" }}
        >
          <HouseCard restaurant={restaurant} />
        </Html>
      )}
    </Billboard>
  );
}

export function Markers({ restaurants, regions }) {
  const [hoveredId, setHoveredId] = useState(null);

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

      const direction = restaurantToGlobe(restaurant, region, placement, 1);
      // Sink the base a hair into the ground so no gap shows underneath.
      const position = direction
        .clone()
        .multiplyScalar(surfaceRadius(direction) - 0.003);

      return [{ restaurant, position }];
    });
  }, [restaurants, regions]);

  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
  }, [placed, invalidate]);

  return (
    <>
      {placed.map(({ restaurant, position }) => (
        <House
          key={restaurant.id}
          restaurant={restaurant}
          position={position}
          hovered={hoveredId === restaurant.id}
          onHover={setHoveredId}
        />
      ))}
    </>
  );
}
