import { MAX_CATEGORY } from "../../lib/scores.js";
import "./ScoreDial.css";

// Two looks from the Figma file:
// - "ring": thick mint track, used in the metric card headers (80px)
// - "badge": white disc with a thinner ring, used in the open panel (89px)
const VARIANTS = {
  ring: { box: 80, radius: 32, stroke: 12 },
  badge: { box: 89, radius: 37, stroke: 7 },
};

// Circular score dial for one category (0-100).
export default function ScoreDial({ score, variant = "ring" }) {
  const { box, radius, stroke } = VARIANTS[variant];
  const center = box / 2;
  const circumference = 2 * Math.PI * radius;

  const hasScore = score != null;
  const offset = hasScore
    ? circumference * (1 - score / MAX_CATEGORY)
    : circumference;

  return (
    <div
      className={`score-dial score-dial--${variant}`}
      style={{ "--dial-size": `${box}px` }}
    >
      <svg
        viewBox={`0 0 ${box} ${box}`}
        className='score-dial__svg'
        aria-hidden='true'
      >
        {variant === "badge" && (
          <circle
            cx={center}
            cy={center}
            r={center - 1.5}
            className='score-dial__disc'
          />
        )}
        <circle
          cx={center}
          cy={center}
          r={radius}
          className='score-dial__track'
          strokeWidth={stroke}
        />
        {hasScore && (
          <circle
            cx={center}
            cy={center}
            r={radius}
            className='score-dial__progress'
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        )}
      </svg>
      <span className='score-dial__value'>{hasScore ? score : "TBD"}</span>
    </div>
  );
}
