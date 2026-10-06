import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import RestaurantCard from "./RestaurantCard.jsx";
import { useRestaurants } from "../../hooks/useRestaurants.js";
import "./RestaurantListings.css";

export default function RestaurantListings() {
  const { data: restaurants = [], isLoading, error } = useRestaurants();
  const rowRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const count = restaurants.length;

  useEffect(() => {
    const row = rowRef.current;
    if (!row || count === 0) return;
    const onScroll = () => {
      const cardWidth = row.firstElementChild?.offsetWidth;
      const gap = 32;
      const index = Math.round(row.scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(index, count - 1));
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    return () => row.removeEventListener("scroll", onScroll);
  }, [count]);

  const scrollToIndex = (i) => {
    const card = rowRef.current?.children[i];
    card?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <section className='restaurant-listings'>
      <h2 className='restaurant-listings__heading'>Restaurants near you</h2>

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
          <div className='restaurant-listings__row-wrapper'>
            {count > 0 && (
              <button
                className='restaurant-listings__arrow'
                aria-label='Previous restaurant'
                onClick={() => scrollToIndex(Math.max(activeIndex - 1, 0))}
              >
                <Icon icon='mdi:arrow-left' width={28} height={28} />
              </button>
            )}

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
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                    />
                  ))}
            </div>

            {count > 0 && (
              <button
                className='restaurant-listings__arrow'
                aria-label='Next restaurant'
                onClick={() =>
                  scrollToIndex(Math.min(activeIndex + 1, count - 1))
                }
              >
                <Icon icon='mdi:arrow-right' width={28} height={28} />
              </button>
            )}
          </div>

          {count > 0 && (
            <div className='restaurant-listings__pagination'>
              {restaurants.map((restaurant, i) => (
                <button
                  key={restaurant.id}
                  className={`dot ${i === activeIndex ? "dot--active" : ""}`}
                  aria-label={`Show ${restaurant.name}`}
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
