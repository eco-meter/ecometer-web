import { useEffect, useMemo, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { REGION_PLACEMENTS } from "./regionPlacements";
import { restaurantToGlobe } from "./globeMath";
import { surfaceRadius } from "./terrain";
import { getCuisineColor } from "./cuisineColors";
import { getStickerTexture } from "./stickerTexture";

// Size of each sticker on the planet (the planet's radius is 1.6).
const STICKER_RADIUS = 0.09;
// How far stickers sit above the ground, so hills don't poke through.
const STICKER_LIFT = 0.012;
const MAX_TOTAL = 300;

function getTotal(restaurant) {
  const scores = [
    restaurant.food_score,
    restaurant.packaging_score,
    restaurant.supply_score,
  ];
  if (scores.some((score) => score == null)) return null;
  return scores.reduce((sum, score) => sum + score, 0);
}

function HouseCard({ restaurant }) {
  const total = getTotal(restaurant);

  return (
    <div className='house-card'>
      {restaurant.photoUrl && (
        <img src={restaurant.photoUrl} alt='' className='house-card__photo' />
      )}

      <div className='house-card__body'>
        <p className='house-card__name'>{restaurant.name}</p>

        <div className='house-card__meta'>
          <span className='house-card__tag'>
            <span
              className='house-card__dot'
              style={{ background: getCuisineColor(restaurant.cuisine) }}
            />
            {restaurant.cuisine} · {"$".repeat(restaurant.price_level)}
          </span>
          {restaurant.verified && (
            <span className='house-card__verified'>✓ Verified</span>
          )}
        </div>

        <div className='house-card__score'>
          <div className='house-card__score-row'>
            <span>Total score</span>
            {total != null ? (
              <span className='house-card__score-value'>
                {total}{" "}
                <span className='house-card__score-max'>/ {MAX_TOTAL}</span>
              </span>
            ) : (
              <span>Not yet scored</span>
            )}
          </div>
          <div className='house-card__track'>
            {total != null && (
              <div
                className='house-card__fill'
                style={{ "--fill": `${(total / MAX_TOTAL) * 100}%` }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Sticker({ restaurant, position, hovered, onHover }) {
  const invalidate = useThree((state) => state.invalidate);
  const texture = getStickerTexture(restaurant.cuisine);

  // Lay the sticker flat on the ground, facing out from the planet.
  // lookAt points the sticker's front (+Z) away from the centre.
  const orientation = useMemo(() => {
    const helper = new THREE.Object3D();
    helper.position.copy(position);
    helper.lookAt(position.clone().multiplyScalar(2));
    return helper.quaternion.clone();
  }, [position]);

  // Redraw once the icon has loaded onto the sticker.
  useEffect(() => {
    let cancelled = false;
    texture.userData.ready.then(() => {
      if (!cancelled) invalidate();
    });
    return () => {
      cancelled = true;
    };
  }, [texture, invalidate]);

  // Redraw when hover changes, since the canvas only draws on demand.
  useEffect(() => {
    invalidate();
  }, [hovered, invalidate]);

  const handlePointerOver = (event) => {
    // Ignore stickers the mouse passes over while dragging the globe.
    if (event.pointerType === "mouse" && event.buttons > 0) return;
    event.stopPropagation();
    onHover(restaurant.id);
  };

  const handlePointerOut = () => {
    onHover((current) => (current === restaurant.id ? null : current));
  };

  return (
    <group position={position} quaternion={orientation}>
      <mesh scale={hovered ? 1.2 : 1}>
        <circleGeometry args={[STICKER_RADIUS, 32]} />
        <meshBasicMaterial
          map={texture}
          transparent
          polygonOffset
          polygonOffsetFactor={-4}
        />
      </mesh>

      {/* Invisible, larger hover target so small stickers are easy to hit. */}
      <mesh onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
        <circleGeometry args={[STICKER_RADIUS * 1.4, 16]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} />
      </mesh>

      {hovered && (
        <Html
          position={[0, 0, 0.08]}
          zIndexRange={[5, 0]}
          style={{ pointerEvents: "none" }}
        >
          <HouseCard restaurant={restaurant} />
        </Html>
      )}
    </group>
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
      const position = direction
        .clone()
        .multiplyScalar(surfaceRadius(direction) + STICKER_LIFT);

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
        <Sticker
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
