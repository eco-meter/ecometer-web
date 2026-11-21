import Hero from "../components/home/Hero";
import SearchBar from "../components/home/SearchBar";
import RestaurantListings from "../components/home/RestaurantListings";
import Mission from "../components/home/Mission";

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
