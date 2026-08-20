import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import RestaurantListings from "../components/RestaurantListings";

export default function Home() {
  return (
    <>
      <Hero />
      <SearchBar />
      <RestaurantListings />
    </>
  );
}
