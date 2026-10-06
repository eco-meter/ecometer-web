import ScoreRing from "./ScoreRing.jsx";
import "./RestaurantCard.css";

function formatTag(cuisine, priceLevel) {
  return `${cuisine} • ${"$".repeat(priceLevel)}`;
}

function getTotal(scores) {
  if (scores.some((score) => score == null)) return null;
  return scores.reduce((sum, score) => sum + score, 0);
}

export default function RestaurantCard({ restaurant }) {
  const {
    name,
    cuisine,
    price_level,
    photoUrl,
    food_score,
    packaging_score,
    supply_score,
  } = restaurant;

  const total = getTotal([food_score, packaging_score, supply_score]);

  return (
    <div className='restaurant-card'>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt=''
          className='restaurant-card__image'
          loading='lazy'
        />
      ) : (
        <div className='restaurant-card__image restaurant-card__image--empty' />
      )}

      <div className='restaurant-card__body'>
        <h3 className='restaurant-card__name'>{name}</h3>

        <div className='restaurant-card__scores'>
          <ScoreRing label='Food' percent={food_score} />
          <ScoreRing label='Packaging' percent={packaging_score} />
          <ScoreRing label='Suppliers' percent={supply_score} />
        </div>

        <div className='restaurant-card__total-bar'>
          <span>{total != null ? `${total} /300` : "Not yet scored"}</span>
        </div>

        <div className='restaurant-card__footer'>
          <span>{formatTag(cuisine, price_level)}</span>
          <span>Total Score</span>
        </div>
      </div>
    </div>
  );
}
