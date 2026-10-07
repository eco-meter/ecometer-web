import { Component, Suspense, lazy, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRestaurants } from "../../hooks/useRestaurants.js";
import { useRegions } from "../../hooks/useRegions.js";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";
import { useInView } from "../../hooks/useInView.js";
import { REGION_PLACEMENTS } from "./regionPlacements";
import { RegionPicker } from "./RegionPicker";
import "./globe.css";

const GlobeCanvas = lazy(() => import("./GlobeCanvas.jsx"));

const EMPTY = [];

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// Returns a copy of the URL params with the region set or removed.
function withRegion(params, slug) {
  const next = new URLSearchParams(params);
  if (slug) next.set("region", slug);
  else next.delete("region");
  return next;
}

class GlobeErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.warn("Globe failed to load, showing static illustration.", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function GlobeSection({ fallbackSrc }) {
  const reducedMotion = usePrefersReducedMotion();
  const { data: restaurants = EMPTY } = useRestaurants();
  const { data: regions = EMPTY } = useRegions();
  const stageRef = useRef(null);
  const inView = useInView(stageRef);
  const [webglSupported] = useState(hasWebGL);
  const [searchParams, setSearchParams] = useSearchParams();

  // Ignore ?region= values that don't exist on the globe
  const requestedSlug = searchParams.get("region");
  const activeSlug =
    requestedSlug && REGION_PLACEMENTS[requestedSlug] ? requestedSlug : null;
  const focus = activeSlug ? REGION_PLACEMENTS[activeSlug] : null;

  const pickableRegions = regions.filter(
    (region) => REGION_PLACEMENTS[region.slug],
  );

  function selectRegion(slug) {
    setSearchParams((params) => withRegion(params, slug), {
      preventScrollReset: true,
    });
  }

  // Escape zooms back out.
  useEffect(() => {
    if (!activeSlug) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setSearchParams((params) => withRegion(params, null), {
          preventScrollReset: true,
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeSlug, setSearchParams]);

  const fallback = (
    <img src={fallbackSrc} alt='' className='globe-stage__fallback' />
  );

  return (
    <div className='globe-section'>
      <div className='globe-stage' ref={stageRef}>
        {webglSupported ? (
          <GlobeErrorBoundary fallback={fallback}>
            <Suspense fallback={fallback}>
              <GlobeCanvas
                reducedMotion={reducedMotion}
                animateClouds={inView && !reducedMotion}
                focus={focus}
                restaurants={restaurants}
                regions={regions}
              />
            </Suspense>
          </GlobeErrorBoundary>
        ) : (
          fallback
        )}
      </div>

      <RegionPicker
        regions={pickableRegions}
        activeSlug={activeSlug}
        onSelect={selectRegion}
      />
    </div>
  );
}
