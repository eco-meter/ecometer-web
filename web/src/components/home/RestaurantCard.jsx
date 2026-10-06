import ScoreRing from "./ScoreRing.jsx";
import "./RestaurantCard.css";

const MAX_TOTAL = 300;

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
        <div className='restaurant-card__header'>
          <h3 className='restaurant-card__name'>{name}</h3>
          <p className='restaurant-card__tag'>
            {formatTag(cuisine, price_level)}
          </p>
        </div>

        <div className='restaurant-card__scores'>
          <ScoreRing label='Food' score={food_score} />
          <ScoreRing label='Packaging' score={packaging_score} />
          <ScoreRing label='Suppliers' score={supply_score} />
        </div>

        <div className='restaurant-card__total'>
          <div className='restaurant-card__total-row'>
            <span>Total score</span>
            {total != null ? (
              <span className='restaurant-card__total-value'>
                {total}{" "}
                <span className='restaurant-card__total-max'>
                  / {MAX_TOTAL}
                </span>
              </span>
            ) : (
              <span>Not yet scored</span>
            )}
          </div>
          <div className='restaurant-card__total-track' aria-hidden='true'>
            {total != null && (
              <div
                className='restaurant-card__total-fill'
                style={{ "--fill": `${(total / MAX_TOTAL) * 100}%` }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
