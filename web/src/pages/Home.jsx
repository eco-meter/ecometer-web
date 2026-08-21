import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import RestaurantListings from "../components/RestaurantListings";
import Mission from "../components/Mission";

export default function Home() {
  return (
    <>
      <Hero />
      <SearchBar />
      <RestaurantListings />
      <Mission />
    </>
  );
}
