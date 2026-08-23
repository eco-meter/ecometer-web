import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import RestaurantCard from "./RestaurantCard.jsx";
import restaurant1 from "../../assets/restaurants/restaurant-1.webp";
import restaurant2 from "../../assets/restaurants/restaurant-2.webp";
import restaurant3 from "../../assets/restaurants/restaurant-3.webp";
import "./RestaurantListings.css";

const restaurants = [
  {
    image: restaurant1,
    name: "Rocky Mountain Flatbread Company",
    tag: "Pizza • $$",
  },
  { image: restaurant2, name: "Chickpea", tag: "Vegan • $$" },
  { image: restaurant3, name: "Jamjar Canteen", tag: "Lebanese • $$" },
];

export default function RestaurantListings() {
  const rowRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const onScroll = () => {
      const cardWidth = row.firstElementChild?.off;
      const gap = 32;
      const index = Math.round(row.scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(index, restaurants.length - 1));
    };
    row.addEventListener("scroll", onScroll, { passive: true });
    return () => row.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToIndex = (i) => {
    const row = rowRef.current;
    if (!row) return;
    const card = row.children[i];
    card?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <section className='restaurant-listings'>
      <h2 className='restaurant-listings__heading'>Restaurants near you</h2>

      <div className='restaurant-listings__row-wrapper'>
        <button
          className='restaurant-listings__arrow'
          aria-label='Previous'
          onClick={() => scrollToIndex(Math.max(activeIndex - 1, 0))}
        >
          <Icon icon='mdi:arrow-left' width={28} height={28} />
        </button>

        <div className='restaurant-listings__row' ref={rowRef}>
          {restaurants.map((r) => (
            <RestaurantCard key={r.name} {...r} />
          ))}
        </div>

        <button
          className='restaurant-listings__arrow'
          aria-label='Next'
          onClick={() =>
            scrollToIndex(Math.min(activeIndex + 1, restaurants.length - 1))
          }
        >
          <Icon icon='mdi:arrow-right' width={28} height={28} />
        </button>
      </div>

      <div className='restaurant-listings__pagination'>
        {restaurants.map((r, i) => (
          <span
            key={r.name}
            className={`dot ${i === activeIndex ? "dot--active" : ""}`}
            onClick={() => scrollToIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
