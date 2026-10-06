import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import RestaurantCard from "./RestaurantCard.jsx";
import { useRestaurants } from "../../hooks/useRestaurants.js";
import "./RestaurantListings.css";

function getStep(row) {
  const card = row.firstElementChild;
  if (!card) return 0;
  const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
  return card.offsetWidth + gap;
}

export default function RestaurantListings() {
  const { data: restaurants = [], isLoading, error } = useRestaurants();
  const rowRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [positions, setPositions] = useState(1);
  const count = restaurants.length;

  useEffect(() => {
    const row = rowRef.current;
    if (!row || count === 0) return;

    const measure = () => {
      const step = getStep(row);
      if (!step) return;
      const visible = Math.max(1, Math.round((row.clientWidth + 1) / step));
      const maxIndex = Math.max(0, count - visible);
      setPositions(maxIndex + 1);
      setActiveIndex(Math.min(Math.round(row.scrollLeft / step), maxIndex));
    };

    // ResizeObserver fires once immediately, so this also handles the first measure.
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    row.addEventListener("scroll", measure, { passive: true });

    return () => {
      observer.disconnect();
      row.removeEventListener("scroll", measure);
    };
  }, [count]);

  const scrollToIndex = (i) => {
    const row = rowRef.current;
    if (!row) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    row.scrollTo({
      left: i * getStep(row),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const showControls = count > 0 && positions > 1;

  return (
    <section className='restaurant-listings'>
      <div className='restaurant-listings__header'>
        <h2 className='restaurant-listings__heading'>Featured restaurants</h2>

        {showControls && (
          <div className='restaurant-listings__arrows'>
            <button
              className='restaurant-listings__arrow'
              aria-label='Previous restaurants'
              disabled={activeIndex === 0}
              onClick={() => scrollToIndex(activeIndex - 1)}
            >
              <Icon icon='mdi:arrow-left' width={24} height={24} />
            </button>
            <button
              className='restaurant-listings__arrow'
              aria-label='Next restaurants'
              disabled={activeIndex >= positions - 1}
              onClick={() => scrollToIndex(activeIndex + 1)}
            >
              <Icon icon='mdi:arrow-right' width={24} height={24} />
            </button>
          </div>
        )}
      </div>

      {error ? (
        <p className='restaurant-listings__message'>
          Restaurants couldn’t load. Refresh the page to try again.
        </p>
      ) : !isLoading && count === 0 ? (
        <p className='restaurant-listings__message'>
          No restaurants listed yet. Check back soon.
        </p>
      ) : (
        <>
          <div className='restaurant-listings__row' ref={rowRef}>
            {isLoading
              ? [0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className='restaurant-card restaurant-card--skeleton'
                    aria-hidden='true'
                  />
                ))
              : restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
          </div>

          {showControls && (
            <div className='restaurant-listings__pagination'>
              {Array.from({ length: positions }, (_, i) => (
                <button
                  key={i}
                  className={`dot ${i === activeIndex ? "dot--active" : ""}`}
                  aria-label={`Show restaurants from ${restaurants[i].name}`}
                  aria-current={i === activeIndex ? "true" : undefined}
                  onClick={() => scrollToIndex(i)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
