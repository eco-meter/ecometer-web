import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useRestaurant } from "../hooks/useRestaurants.js";
import { getTotal } from "../lib/scores.js";
import RestaurantInfo from "../features/restaurant/RestaurantInfo.jsx";
import EcoGauge from "../features/gauge/EcoGauge.jsx";
import MetricCards from "../features/scoring/MetricCards.jsx";
import AchievementsPanel from "../features/achievements/AchievementsPanel.jsx";
import "./Restaurant.css";

import leaf1 from "../assets/restaurant/leaf-1.svg";
import leaf2 from "../assets/restaurant/leaf-2.svg";
import leaf3 from "../assets/restaurant/leaf-3.svg";
import leaf4 from "../assets/restaurant/leaf-4.svg";
import leaf5 from "../assets/restaurant/leaf-5.svg";
import leaf6 from "../assets/restaurant/leaf-6.svg";

// Decorative leaves scattered behind the layout (desktop only).
// Positions live in Restaurant.css.
const LEAVES = [leaf1, leaf2, leaf3, leaf4, leaf5, leaf6];

// Restaurant page: info card, gauge and metric cards,
// with achievements underneath.
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
        <div className='restaurant-page__leaves' aria-hidden='true'>
          {LEAVES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=''
              className={`restaurant-page__leaf restaurant-page__leaf--${i + 1}`}
            />
          ))}
        </div>
        <div className='restaurant-page__info'>
          {restaurant.verified && (
            <p className='restaurant-page__verified'>
              <Icon icon='akar-icons:circle-check-fill' aria-hidden='true' />
              EcoMeter Verified
            </p>
          )}
          <RestaurantInfo restaurant={restaurant} />
        </div>

        <EcoGauge total={getTotal(restaurant)} />
        <MetricCards restaurant={restaurant} />
      </div>

      <AchievementsPanel achievements={restaurant.achievements} />
    </section>
  );
}
