import { Icon } from "@iconify/react";
import { ACHIEVEMENT_ICONS, DEFAULT_ICON } from "./achievementIcons.js";

const dateFormat = new Intl.DateTimeFormat("en-CA", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC", // dates are stored without a time, so don't shift them
});

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

// One achievement card: sticker on a mint stage, then name,
// description and the date it was earned.
export default function AchievementBadge({ achievement, isExtra }) {
  const { name, description, earnedOn } = achievement;

  return (
    <li
      className={`achievement-badge ${isExtra ? "achievement-badge--extra" : ""}`}
    >
      <div className='achievement-badge__stage'>
        <Sticker achievement={achievement} />
      </div>
      <h3 className='achievement-badge__name'>{name}</h3>
      <p className='achievement-badge__description'>{description}</p>
      {earnedOn && (
        <p className='achievement-badge__earned'>
          Earned {dateFormat.format(new Date(`${earnedOn}T00:00:00Z`))}
        </p>
      )}
    </li>
  );
}
