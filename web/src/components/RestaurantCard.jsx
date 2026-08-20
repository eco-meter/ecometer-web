import ScoreRing from "./ScoreRing";
import "./RestaurantCard.css";

export default function RestaurantCard({
  image,
  name,
  tag,
  food,
  supplier,
  packaging,
}) {
  return (
    <div className='restaurant-card'>
      <img src={image} alt={name} className='restaurant-card__image' />

      <div className='restaurant-card__body'>
        <h3 className='restaurant-card__name'>{name}</h3>

        <div className='restaurant-card__scores'>
          <ScoreRing label='Food' value={food} />
          <ScoreRing label='Supplier' value={supplier} />
          <ScoreRing label='Packaging' value={packaging} />
        </div>

        <div className='restaurant-card__total-bar'>
          <span>XX /300</span>
        </div>

        <div className='restaurant-card__footer'>
          <span>{tag}</span>
          <span>Total Score</span>
        </div>
      </div>
    </div>
  );
}
