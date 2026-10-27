import { useEffect, useState } from "react";

// True while the element is on screen.
// With { once: true } it stays true after the first time it's seen.
export function useInView(ref, { rootMargin = "0px", once = false } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (once) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
          return;
        }
        setInView(entry.isIntersecting);
      },
      { rootMargin },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, rootMargin, once]);

  return inView;
}
