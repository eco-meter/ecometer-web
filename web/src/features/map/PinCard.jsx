import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { getCuisineColor } from "../globe/cuisineColors";
import { SCORE_CATEGORIES } from "../scoring/categories";
import { getTotal, MAX_CATEGORY, MAX_TOTAL } from "../../lib/scores";

// Short labels so the score bars fit the card
const SHORT_LABELS = {
  food: "Food waste",
  packaging: "Packaging",
  supply: "Suppliers",
};

// Option B: photo, the three category scores, total, and two links
export default function PinCard({ restaurant, onClose }) {
  const total = getTotal(restaurant);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`;

  return (
    <article className='pin-card' aria-labelledby='pin-card-name'>
      <div className='pin-card__photo'>
        {restaurant.photoUrl && <img src={restaurant.photoUrl} alt='' />}
        <button
          type='button'
          className='pin-card__close'
          aria-label='Close'
          onClick={onClose}
        >
          <Icon icon='akar-icons:cross' aria-hidden='true' />
        </button>
      </div>

      <div className='pin-card__body'>
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
          {restaurant.verified && (
            <span className='pin-card__verified'>
              <Icon icon='akar-icons:check' aria-hidden='true' />
              Verified
            </span>
          )}
        </div>

        <ul className='pin-card__scores'>
          {SCORE_CATEGORIES.map((category) => {
            const score = restaurant[category.field];
            const percent = ((score ?? 0) / MAX_CATEGORY) * 100;

            return (
              <li key={category.key} className='pin-card__score-row'>
                <span>{SHORT_LABELS[category.key]}</span>
                <span className='pin-card__bar'>
                  <span style={{ width: `${percent}%` }} />
                </span>
                <span className='pin-card__value'>{score ?? "–"}</span>
              </li>
            );
          })}
        </ul>

        <div className='pin-card__total-row'>
          <span>EcoMeter score</span>
          <span className='pin-card__total'>
            {total ?? "–"}
            <span> / {MAX_TOTAL}</span>
          </span>
        </div>

        <div className='pin-card__actions'>
          <Link
            to={`/restaurant/${restaurant.slug}`}
            className='pin-card__link'
          >
            View restaurant
          </Link>
          <a
            href={directionsUrl}
            target='_blank'
            rel='noreferrer'
            className='pin-card__directions'
          >
            Directions
          </a>
        </div>
      </div>
    </article>
  );
}
