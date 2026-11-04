import { useEffect, useId, useLayoutEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { ACHIEVEMENT_ICONS, DEFAULT_ICON } from "./achievementIcons.js";

const dateFormat = new Intl.DateTimeFormat("en-CA", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC", // dates are stored without a time, so don't shift them
});

const EDGE_GAP = 12; // keeps the popover this far from the screen edge

// The round sticker: emblem image if Ewan uploaded one, otherwise an icon.
function Sticker({ achievement }) {
  const { slug, emblemUrl } = achievement;

  return (
    <span className='achievement-badge__sticker' aria-hidden='true'>
      {emblemUrl ? (
        <img src={emblemUrl} alt='' className='achievement-badge__emblem' />
      ) : (
        <Icon
          icon={ACHIEVEMENT_ICONS[slug] ?? DEFAULT_ICON}
          className='achievement-badge__emblem'
        />
      )}
      <span className='achievement-badge__check'>
        <Icon icon='ph:check-bold' />
      </span>
    </span>
  );
}

// One award circle. Clicking it opens a popover with the description
// and the date it was earned.
export default function AchievementBadge({
  achievement,
  isExtra,
  open,
  onToggle,
  onClose,
}) {
  const { name, description, earnedOn } = achievement;
  const popoverId = useId();
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);

  // Nudge the popover sideways if it would run off the screen.
  useLayoutEffect(() => {
    const popover = popoverRef.current;
    if (!open || !popover) return;

    popover.style.setProperty("--shift", "0px");
    const { left, right } = popover.getBoundingClientRect();
    const maxRight = document.documentElement.clientWidth - EDGE_GAP;

    let shift = 0;
    if (left < EDGE_GAP) shift = EDGE_GAP - left;
    else if (right > maxRight) shift = maxRight - right;

    popover.style.setProperty("--shift", `${shift}px`);
  }, [open]);

  // Escape closes the popover and puts focus back on the badge.
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event) {
      if (event.key !== "Escape") return;
      onClose();
      buttonRef.current?.focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <li
      className={[
        "achievement-badge",
        isExtra && "achievement-badge--extra",
        open && "achievement-badge--open",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        ref={buttonRef}
        type='button'
        className='achievement-badge__button'
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={onToggle}
      >
        <Sticker achievement={achievement} />
        <span className='achievement-badge__name'>{name}</span>
      </button>

      {open && (
        <div
          ref={popoverRef}
          id={popoverId}
          className='achievement-badge__popover'
          role='region'
          aria-label={name}
        >
          <h3 className='achievement-badge__popover-name'>{name}</h3>
          <p className='achievement-badge__description'>{description}</p>
          {earnedOn && (
            <p className='achievement-badge__earned'>
              Earned {dateFormat.format(new Date(`${earnedOn}T00:00:00Z`))}
            </p>
          )}
        </div>
      )}
    </li>
  );
}
