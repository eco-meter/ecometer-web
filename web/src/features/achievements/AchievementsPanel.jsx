import { useCallback, useEffect, useId, useState } from "react";
import { Icon } from "@iconify/react";
import AchievementBadge from "./AchievementBadge.jsx";
import "./AchievementsPanel.css";

const VISIBLE_COUNT = 5; // one row on desktop; the rest sit in the dropdown

// "Additional Achievements" card on the restaurant page.
// Hidden when the restaurant hasn't earned anything yet.
export default function AchievementsPanel({ achievements = [] }) {
  const [openSlug, setOpenSlug] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const listId = useId();
  const titleId = useId();

  const close = useCallback(() => setOpenSlug(null), []);

  // Clicking anywhere outside a badge closes the open popover.
  // So does a change in page width, so it never sits in the wrong spot.
  // (Height is ignored: phones change it when the address bar hides.)
  useEffect(() => {
    if (!openSlug) return;

    const startWidth = window.innerWidth;

    function handlePointerDown(event) {
      if (!event.target.closest(".achievement-badge")) close();
    }

    function handleResize() {
      if (window.innerWidth !== startWidth) close();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [openSlug, close]);

  if (achievements.length === 0) return null;

  const extra = achievements.slice(VISIBLE_COUNT);
  const shown = showAll ? achievements : achievements.slice(0, VISIBLE_COUNT);

  function toggleShowAll() {
    // Close a popover that's about to be hidden.
    if (showAll && extra.some((a) => a.slug === openSlug)) close();
    setShowAll((current) => !current);
  }

  function renderBadge(achievement, index) {
    return (
      <AchievementBadge
        key={achievement.slug}
        achievement={achievement}
        isExtra={index >= VISIBLE_COUNT}
        open={openSlug === achievement.slug}
        onToggle={() =>
          setOpenSlug((current) =>
            current === achievement.slug ? null : achievement.slug,
          )
        }
        onClose={close}
      />
    );
  }

  return (
    <section className='achievements-panel' aria-labelledby={titleId}>
      <svg
        className='achievements-panel__sparks'
        viewBox='0 0 78 84'
        aria-hidden='true'
      >
        <path d='M6 76 L24 76' />
        <path d='M22 22 L34 40' />
        <path d='M60 6 L63 30' />
      </svg>

      <div className='achievements-panel__card'>
        <h2 id={titleId} className='achievements-panel__title'>
          Additional Achievements
        </h2>

        <ul id={listId} className='achievements-panel__grid'>
          {shown.map((achievement, i) => renderBadge(achievement, i))}
        </ul>

        {extra.length > 0 && (
          <button
            type='button'
            className='achievements-panel__toggle'
            aria-expanded={showAll}
            aria-controls={listId}
            onClick={toggleShowAll}
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
