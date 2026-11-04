import { Icon } from "@iconify/react";
import "./RestaurantInfo.css";

const dateFormat = new Intl.DateTimeFormat("en-CA", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC", // dates are stored without a time, so don't shift them
});

// "Healthy Café, Plant-Based, Organic" → ["Healthy Café", "Plant-Based", "Organic"]
function splitTags(tags) {
  if (!tags) return [];
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

// Five stars, filled to the nearest half.
function Stars({ rating }) {
  const halves = Math.round(rating * 2);

  return (
    <span className='restaurant-info__stars' aria-hidden='true'>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = halves - i * 2;
        const icon =
          filled >= 2
            ? "ph:star-fill"
            : filled === 1
              ? "ph:star-half-fill"
              : "ph:star";
        return <Icon key={i} icon={icon} />;
      })}
    </span>
  );
}

// Left column of the restaurant page: name, photo, description and details.
// Rows only show when Ewan has filled in that field in Supabase.
export default function RestaurantInfo({ restaurant }) {
  const {
    name,
    cuisine,
    photoUrl,
    description,
    address,
    tags,
    google_rating: rating,
    google_review_count: reviewCount,
    score_updated_at: scoreUpdatedAt,
  } = restaurant;

  const cuisineLine = [cuisine, ...splitTags(tags)]
    .filter((tag, i, all) => all.indexOf(tag) === i) // no repeats
    .join(" · ");

  return (
    <article className='restaurant-info'>
      <header className='restaurant-info__header'>
        <h1 className='restaurant-info__name'>{name}</h1>
        {scoreUpdatedAt && (
          <p className='restaurant-info__updated'>
            Score last updated:{" "}
            {dateFormat.format(new Date(`${scoreUpdatedAt}T00:00:00Z`))}
          </p>
        )}
      </header>

      {photoUrl ? (
        <img src={photoUrl} alt='' className='restaurant-info__photo' />
      ) : (
        <div className='restaurant-info__photo restaurant-info__photo--empty' />
      )}

      {description && (
        <p className='restaurant-info__description'>{description}</p>
      )}

      <dl className='restaurant-info__details'>
        <div className='restaurant-info__row'>
          <Icon icon='ph:fork-knife-fill' className='restaurant-info__icon' />
          <dt>Cuisine</dt>
          <dd>{cuisineLine}</dd>
        </div>

        {address && (
          <div className='restaurant-info__row'>
            <Icon icon='ph:map-pin-fill' className='restaurant-info__icon' />
            <dt>Address</dt>
            <dd>{address}</dd>
          </div>
        )}

        {rating != null && (
          <div className='restaurant-info__row'>
            <Icon icon='ph:star' className='restaurant-info__icon' />
            <dt>Google Reviews</dt>
            <dd className='restaurant-info__rating'>
              <span>{Number(rating).toFixed(1)}</span>
              <Stars rating={Number(rating)} />
              <span className='visually-hidden'>out of 5 stars</span>
              {reviewCount != null && (
                <span>({reviewCount.toLocaleString("en-CA")} reviews)</span>
              )}
            </dd>
          </div>
        )}
      </dl>
    </article>
  );
}
