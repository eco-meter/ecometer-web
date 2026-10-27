import { MAX_CATEGORY } from "../../lib/scores.js";
import "./ScoreDial.css";

const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Circular score ring used in the metric cards. `size` is in pixels.
export default function ScoreDial({ score, size = 64 }) {
  const hasScore = score != null;
  const offset = hasScore
    ? CIRCUMFERENCE * (1 - score / MAX_CATEGORY)
    : CIRCUMFERENCE;

  return (
    <div className='score-dial' style={{ "--dial-size": `${size}px` }}>
      <svg viewBox='0 0 64 64' className='score-dial__svg' aria-hidden='true'>
        <circle cx='32' cy='32' r={RADIUS} className='score-dial__track' />
        {hasScore && (
          <circle
            cx='32'
            cy='32'
            r={RADIUS}
            className='score-dial__progress'
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
          />
        )}
      </svg>
      <span className='score-dial__value'>{hasScore ? score : "TBD"}</span>
    </div>
  );
}
