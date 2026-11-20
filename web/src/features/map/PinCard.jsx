import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { getCuisineColor } from "../globe/cuisineColors";
import { getTotal, MAX_TOTAL } from "../../lib/scores";

// Option A: name, cuisine, verified badge, total score and a link
export default function PinCard({ restaurant, onClose }) {
  const total = getTotal(restaurant);
  const percent = total == null ? 0 : (total / MAX_TOTAL) * 100;

  return (
    <article className='pin-card' aria-labelledby='pin-card-name'>
      <div className='pin-card__top'>
        <div>
          <h3 id='pin-card-name' className='pin-card__name'>
            {restaurant.name}
          </h3>
          <p className='pin-card__meta'>
            <span
              className='pin-card__dot'
              style={{ background: getCuisineColor(restaurant.cuisine) }}
            />
            {restaurant.cuisine}
            {restaurant.region && ` · ${restaurant.region.name}`}
          </p>
        </div>
        <button
          type='button'
          className='pin-card__close'
          aria-label='Close'
          onClick={onClose}
        >
          <Icon icon='akar-icons:cross' aria-hidden='true' />
        </button>
      </div>

      {restaurant.verified && (
        <span className='pin-card__verified'>
          <Icon icon='akar-icons:check' aria-hidden='true' />
          Verified
        </span>
      )}

      <div className='pin-card__score'>
        <span>EcoMeter score</span>
        <span className='pin-card__total'>
          {total ?? "–"}
          <span> / {MAX_TOTAL}</span>
        </span>
      </div>
      <div className='pin-card__bar'>
        <div style={{ width: `${percent}%` }} />
      </div>

      <Link to={`/restaurant/${restaurant.slug}`} className='pin-card__link'>
        View restaurant
        <Icon icon='akar-icons:arrow-right' aria-hidden='true' />
      </Link>
    </article>
  );
}
