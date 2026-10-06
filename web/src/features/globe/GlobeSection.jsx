import { Component, Suspense, lazy, useState } from "react";
import "./globe.css";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";

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
  const [webglSupported] = useState(hasWebGL);

  const fallback = (
    <img src={fallbackSrc} alt='' className='globe-stage__fallback' />
  );

  return (
    <div className='globe-stage'>
      {webglSupported ? (
        <GlobeErrorBoundary fallback={fallback}>
          <Suspense fallback={fallback}>
            <GlobeCanvas reducedMotion={reducedMotion} />
          </Suspense>
        </GlobeErrorBoundary>
      ) : (
        fallback
      )}
    </div>
  );
}
