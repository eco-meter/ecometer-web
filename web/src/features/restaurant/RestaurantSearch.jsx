import { useId, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useRestaurants } from "../../hooks/useRestaurants.js";
import "./RestaurantSearch.css";

const MAX_RESULTS = 5;

// "Search for another restaurant" box at the bottom of the info card.
// Matches names as you type. Enter opens the first match.
export default function RestaurantSearch({ currentSlug }) {
  const { data: restaurants = [] } = useRestaurants();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const resultsId = useId();

  const trimmed = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!trimmed) return [];
    return restaurants
      .filter(
        (restaurant) =>
          restaurant.slug !== currentSlug &&
          restaurant.name.toLowerCase().includes(trimmed),
      )
      .slice(0, MAX_RESULTS);
  }, [restaurants, trimmed, currentSlug]);

  function handleSubmit(event) {
    event.preventDefault();
    if (results.length > 0) navigate(`/restaurant/${results[0].slug}`);
  }

  return (
    <form
      className='restaurant-search'
      role='search'
      onSubmit={handleSubmit}
      onFocus={() => setShowResults(true)}
      onBlur={(event) => {
        // Close when focus leaves the search box and its results
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setShowResults(false);
        }
      }}
    >
      <div className='restaurant-search__field'>
        <Icon
          icon='basil:search-solid'
          className='restaurant-search__icon'
          aria-hidden='true'
        />
        <input
          type='search'
          className='restaurant-search__input'
          placeholder='Search for another restaurant...'
          aria-label='Search for another restaurant'
          aria-controls={resultsId}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setQuery("");
          }}
        />
      </div>

      {showResults && trimmed && (
        <div
          className='restaurant-search__results'
          id={resultsId}
          // Keep focus in the input while clicking a result, so the
          // list doesn't close before the click lands (Safari)
          onPointerDown={(event) => event.preventDefault()}
        >
          {results.length > 0 ? (
            <ul>
              {results.map((restaurant) => (
                <li key={restaurant.id}>
                  <Link to={`/restaurant/${restaurant.slug}`}>
                    <span className='restaurant-search__name'>
                      {restaurant.name}
                    </span>
                    <span className='restaurant-search__meta'>
                      {restaurant.cuisine}
                      {restaurant.region && ` · ${restaurant.region.name}`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className='restaurant-search__empty' role='status'>
              No restaurants match “{query.trim()}”.
            </p>
          )}
        </div>
      )}
    </form>
  );
}
