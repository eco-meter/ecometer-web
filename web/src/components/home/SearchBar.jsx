import RestaurantSearch from "../../features/restaurant/RestaurantSearch";
import "./SearchBar.css";

export default function SearchBar() {
  return (
    <div className='search-bar'>
      <RestaurantSearch placeholder='Discover eco-friendly restaurants...' />
    </div>
  );
}
