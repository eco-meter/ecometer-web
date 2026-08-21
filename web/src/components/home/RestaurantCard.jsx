import ScoreRing from "./ScoreRing.jsx";
import "./RestaurantCard.css";

export default function RestaurantCard({ image, name, tag }) {
  return (
    <div className='restaurant-card'>
      <img src={image} alt={name} className='restaurant-card__image' />

      <div className='restaurant-card__body'>
        <h3 className='restaurant-card__name'>{name}</h3>

        <div className='restaurant-card__scores'>
          <ScoreRing label='Food' percent={null} />
          <ScoreRing label='Packaging' percent={null} />
          <ScoreRing label='Suppliers' percent={null} />
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
