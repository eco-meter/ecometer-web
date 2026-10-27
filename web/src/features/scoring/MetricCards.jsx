import MetricCard from "./MetricCard";
import { SCORE_CATEGORIES } from "./categories";

// The three category cards for one restaurant.
export default function MetricCards({ restaurant }) {
  return (
    <div className='metric-cards'>
      {SCORE_CATEGORIES.map((category) => (
        <MetricCard
          key={category.key}
          title={category.title}
          score={restaurant[category.field]}
          description={category.description}
        />
      ))}
    </div>
  );
}
