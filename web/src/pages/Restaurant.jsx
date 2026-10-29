import { useParams } from "react-router-dom";
import { useRestaurant } from "../hooks/useRestaurants.js";
import { getTotal } from "../lib/scores.js";
import EcoGauge from "../features/gauge/EcoGauge.jsx";
import MetricCards from "../features/scoring/MetricCards.jsx";
import "./Restaurant.css";

// Restaurant page. Gauge and metric cards are in; the info card
// (left column) and achievements come next.
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
      <h1 className='restaurant-page__name'>{restaurant.name}</h1>

      <div className='restaurant-page__scores'>
        <EcoGauge total={getTotal(restaurant)} />
        <MetricCards restaurant={restaurant} />
      </div>
    </section>
  );
}
