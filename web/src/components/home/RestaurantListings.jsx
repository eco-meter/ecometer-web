import { Icon } from "@iconify/react";
import RestaurantCard from "./RestaurantCard.jsx";
import restaurant1 from "../../assets/restaurants/restaurant-1.png";
import restaurant2 from "../../assets/restaurants/restaurant-2.png";
import restaurant3 from "../../assets/restaurants/restaurant-3.png";
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
  return (
    <section className='restaurant-listings'>
      <h2 className='restaurant-listings__heading'>Restaurants near you</h2>

      <div className='restaurant-listings__row-wrapper'>
        <button className='restaurant-listings__arrow' aria-label='Previous'>
          <Icon icon='mdi:arrow-left' width={28} height={28} />
        </button>

        <div className='restaurant-listings__row'>
          {restaurants.map((r) => (
            <RestaurantCard key={r.name} {...r} />
          ))}
        </div>

        <button className='restaurant-listings__arrow' aria-label='Next'>
          <Icon icon='mdi:arrow-right' width={28} height={28} />
        </button>
      </div>

      <div className='restaurant-listings__pagination'>
        <span className='dot dot--active' />
        <span className='dot' />
        <span className='dot' />
      </div>
    </section>
  );
}
