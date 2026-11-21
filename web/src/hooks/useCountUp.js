import { useEffect, useState } from "react";

// Counts from 0 up to `target` with an ease-out cureve.
// `start` holds the count at 0 until it's true. `instant` skips the animation.
export function useCountUp(
  target,
  { duration = 1200, start = true, instant = false } = {},
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target == null || !start || instant) return;

    let frame;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, start, instant]);

  if (target == null) return null;
  return instant ? target : value;
}
