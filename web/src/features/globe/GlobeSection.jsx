import { Component, Suspense, lazy, useRef, useState } from "react";
import "./globe.css";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";
import { useRestaurants } from "../../hooks/useRestaurants.js";
import { useRegions } from "../../hooks/useRegions.js";
import { useInView } from "../../hooks/useInView.js";

const EMPTY = [];

const GlobeCanvas = lazy(() => import("./GlobeCanvas.jsx"));

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
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
  const [webglSupported] = useState(hasWebGL);
  const stageRef = useRef(null);
  const inView = useInView(stageRef);

  const fallback = (
    <img src={fallbackSrc} alt='' className='globe-stage__fallback' />
  );

  return (
    <div className='globe-stage' ref={stageRef}>
      {webglSupported ? (
        <GlobeErrorBoundary fallback={fallback}>
          <Suspense fallback={fallback}>
            <GlobeCanvas
              reducedMotion={reducedMotion}
              animateClouds={inView && !reducedMotion}
              restaurants={restaurants}
              regions={regions}
            />
          </Suspense>
        </GlobeErrorBoundary>
      ) : (
        fallback
      )}
    </div>
  );
}
