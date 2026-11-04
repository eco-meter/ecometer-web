import { useId, useState } from "react";
import { Icon } from "@iconify/react";
import AchievementBadge from "./AchievementBadge.jsx";
import "./AchievementsPanel.css";

const VISIBLE_COUNT = 5; // one row on desktop; the rest sit in the dropdown

// "Additional Achievements" panel on the restaurant page.
// Hidden when the restaurant hasn't earned anything yet.
export default function AchievementsPanel({ achievements = [] }) {
  const [showAll, setShowAll] = useState(false);
  const listId = useId();
  const titleId = useId();

  if (achievements.length === 0) return null;

  const hasMore = achievements.length > VISIBLE_COUNT;
  const shown = showAll ? achievements : achievements.slice(0, VISIBLE_COUNT);

  return (
    <section className='achievements-panel' aria-labelledby={titleId}>
      <svg
        className='achievements-panel__sparks'
        viewBox='0 0 78 84'
        aria-hidden='true'
      >
        <path d='M5 74 L29 76' />
        <path d='M24 20 L42 40' />
        <path d='M66 5 L71 22' />
      </svg>

      <div className='achievements-panel__card'>
        <h2 id={titleId} className='achievements-panel__title'>
          Additional Achievements
        </h2>

        <ul id={listId} className='achievements-panel__grid'>
          {shown.map((achievement, i) => (
            <AchievementBadge
              key={achievement.slug}
              achievement={achievement}
              isExtra={i >= VISIBLE_COUNT}
            />
          ))}
        </ul>

        {hasMore && (
          <button
            type='button'
            className='achievements-panel__toggle'
            aria-expanded={showAll}
            aria-controls={listId}
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll
              ? "Show fewer achievements"
              : `Show all ${achievements.length} achievements`}
            <Icon
              icon='akar-icons:chevron-down'
              className='achievements-panel__chevron'
              aria-hidden='true'
            />
          </button>
        )}
      </div>
    </section>
  );
}
