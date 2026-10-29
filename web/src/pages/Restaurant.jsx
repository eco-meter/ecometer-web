import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useRestaurant } from "../hooks/useRestaurants.js";
import { getTotal } from "../lib/scores.js";
import RestaurantInfo from "../features/restaurant/RestaurantInfo.jsx";
import EcoGauge from "../features/gauge/EcoGauge.jsx";
import MetricCards from "../features/scoring/MetricCards.jsx";
import "./Restaurant.css";

// Restaurant page: info card, gauge and metric cards.
// Achievements go underneath these later.
export default function Restaurant() {
  const { slug } = useParams();
  const { data: restaurant, isPending, isError } = useRestaurant(slug);

  if (isPending) return <p className='restaurant-page__status'>Loading...</p>;
  if (isError)
    return <p className='restaurant-page__status'>Something went wrong.</p>;
  if (!restaurant)
    return <p className='restaurant-page__status'>Restaurant not found.</p>;

  return (
    <section className='restaurant-page'>
      <div className='restaurant-page__layout'>
        <div className='restaurant-page__info'>
          {restaurant.verified && (
            <p className='restaurant-page__verified'>
              <Icon icon='ph:seal-check-fill' aria-hidden='true' />
              EcoMeter Verified
            </p>
          )}
          <RestaurantInfo restaurant={restaurant} />
        </div>

        <EcoGauge total={getTotal(restaurant)} />
        <MetricCards restaurant={restaurant} />
      </div>
    </section>
  );
}
