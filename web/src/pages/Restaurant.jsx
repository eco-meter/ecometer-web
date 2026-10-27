import { useParams } from "react-router-dom";
import { useRestaurant } from "../hooks/useRestaurants";
import { getTotal } from "../lib/scores";
import EcoGauge from "../features/gauge/EcoGauge";

// Temporary page so the gauge can be tested with real data.
// The full layout (info cards, achievements) comes later.
export default function Restaurant() {
  const { slug } = useParams();
  const { data: restaurant, isPending, isError } = useRestaurant(slug);

  if (isPending) return <p style={{ padding: 48 }}>Loading…</p>;
  if (isError) return <p style={{ padding: 48 }}>Something went wrong.</p>;
  if (!restaurant) return <p style={{ padding: 48 }}>Restaurant not found.</p>;

  return (
    <section style={{ padding: "48px 24px" }}>
      <h1 style={{ textAlign: "center", marginBottom: 32 }}></h1>
      <EcoGauge total={getTotal(restaurant)} />
    </section>
  );
}
