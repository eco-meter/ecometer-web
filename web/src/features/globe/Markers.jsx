import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
import { REGION_PLACEMENTS } from "./regionPlacements";
import { restaurantToGlobe } from "./globeMath";
import { surfaceRadius } from "./terrain";
import { getCuisineColor } from "./cuisineColors";
import {
  getStickerTexture,
  STICKER_WIDTH,
  STICKER_HEIGHT,
} from "./stickerTexture";

// Height of each sticker on the planet (the planet's radius is 1.6).
const STICKER_SIZE = 0.38;
// How far stickers sit above the ground.
const STICKER_LIFT = 0.01;
// How directly a sticker must face the camera to show (0 = edge-on).
const MIN_FACING = 0.12;
const INK = "#3a5e43";
const UP = new THREE.Vector3(0, 1, 0);

// One shared plane for every sticker, with its bottom edge at the ground.
const stickerGeometry = (() => {
  const width = STICKER_SIZE * (STICKER_WIDTH / STICKER_HEIGHT);
  const geometry = new THREE.PlaneGeometry(width, STICKER_SIZE);
  geometry.translate(0, STICKER_SIZE / 2 - 0.035, 0);
  return geometry;
})();

// Reused every frame instead of making new vectors.
const worldPosition = new THREE.Vector3();
const toCamera = new THREE.Vector3();
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
  const anchorRef = useRef(null);
  const visibleRef = useRef(true);

  // Each sticker leans a few degrees, like it was placed by hand.
  const tilt = ((restaurant.id * 37) % 9) / 100 - 0.04;

  // Soft shadow lies flat on the ground under the sticker.
  const groundRotation = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        UP,
        position.clone().normalize(),
      ),
    [position],
  );

  // Hide stickers on the far side of the planet. They draw on top of the
  // planet (so they never sink into hills), so they need hiding manually.
  useFrame(({ camera }) => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    anchor.getWorldPosition(worldPosition);
    toCamera.copy(camera.position).sub(worldPosition).normalize();
    const facing = worldPosition.normalize().dot(toCamera) > MIN_FACING;
    anchor.visible = facing;
    visibleRef.current = facing;
  });

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
    if (!visibleRef.current) return;
    event.stopPropagation();
    onHover(restaurant.id);
  };

  const handlePointerOut = () => {
    onHover((current) => (current === restaurant.id ? null : current));
  };

  return (
    <group position={position} ref={anchorRef}>
      <mesh
        quaternion={groundRotation}
        position={position.clone().normalize().multiplyScalar(0.004)}
      >
        <circleGeometry args={[STICKER_SIZE * 0.4, 24]} />
        <meshBasicMaterial
          color={INK}
          transparent
          opacity={0.14}
          depthWrite={false}
        />
      </mesh>

      <Billboard>
        <group rotation-z={tilt} scale={hovered ? 1.12 : 1}>
          <mesh geometry={stickerGeometry} renderOrder={10}>
            <meshBasicMaterial
              map={texture}
              transparent
              alphaTest={0.02}
              toneMapped={false}
              depthTest={false}
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* Invisible hover target matching the sticker. */}
        <mesh
          geometry={stickerGeometry}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <meshBasicMaterial colorWrite={false} depthWrite={false} />
        </mesh>

        {hovered && (
          <Html
            position={[0, STICKER_SIZE * 0.95, 0]}
            zIndexRange={[5, 0]}
            style={{ pointerEvents: "none" }}
          >
            <HouseCard restaurant={restaurant} />
          </Html>
        )}
      </Billboard>
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
