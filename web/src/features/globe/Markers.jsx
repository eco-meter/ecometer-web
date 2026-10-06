import { Component, Suspense, useEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { Billboard, useTexture } from "@react-three/drei";
import { REGION_PLACEMENTS } from "./regionPlacements";
import { restaurantToGlobe } from "./globeMath";
import { surfaceRadius } from "./terrain";

// Lifts markers off the surface so they don't sink into the planet.
const MARKER_LIFT = 0.1;
const MARKER_RADIUS = 0.11;
const BORDER_WIDTH = 0.014;
const PHOTO_RADIUS = MARKER_RADIUS - BORDER_WIDTH;

const BORDER_COLOR = "#efeee7";
const EMPTY_COLOR = "#d8d4c8";

// The canvas only redraws on demand, so ask for a frame when something new mounts.
function useRedrawOnMount() {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [invalidate]);
}

// Crops a rectangular photo to a centred square, like CSS object-fit: cover.
function coverCrop(texture) {
  const { width, height } = texture.image;
  const aspect = width / height;

  if (aspect > 1) {
    texture.repeat.set(1 / aspect, 1);
    texture.offset.set((1 - 1 / aspect) / 2, 0);
  } else {
    texture.repeat.set(1, aspect);
    texture.offset.set(0, (1 - aspect) / 2);
  }
}

function MarkerEmpty() {
  useRedrawOnMount();
  return (
    <mesh position-z={0.001}>
      <circleGeometry args={[PHOTO_RADIUS, 48]} />
      <meshBasicMaterial color={EMPTY_COLOR} toneMapped={false} />
    </mesh>
  );
}

function MarkerPhoto({ url }) {
  const texture = useTexture(url, coverCrop);
  useRedrawOnMount();

  return (
    <mesh position-z={0.001}>
      <circleGeometry args={[PHOTO_RADIUS, 48]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

// If one photo fails to load, show an empty marker instead of crashing the globe.
class MarkerErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn(`[globe] Photo failed to load for ${this.props.name}.`, error);
  }

  render() {
    return this.state.failed ? <MarkerEmpty /> : this.props.children;
  }
}

function RestaurantMarker({ restaurant, position }) {
  return (
    <Billboard position={position}>
      <mesh>
        <circleGeometry args={[MARKER_RADIUS, 48]} />
        <meshBasicMaterial color={BORDER_COLOR} toneMapped={false} />
      </mesh>

      {restaurant.photoUrl ? (
        <MarkerErrorBoundary name={restaurant.name}>
          <Suspense fallback={<MarkerEmpty />}>
            <MarkerPhoto url={restaurant.photoUrl} />
          </Suspense>
        </MarkerErrorBoundary>
      ) : (
        <MarkerEmpty />
      )}
    </Billboard>
  );
}

export function Markers({ restaurants, regions }) {
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
        .multiplyScalar(surfaceRadius(direction) + MARKER_LIFT);

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
        <RestaurantMarker
          key={restaurant.id}
          restaurant={restaurant}
          position={position}
        />
      ))}
    </>
  );
}
