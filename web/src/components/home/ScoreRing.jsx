import "./ScoreRing.css";

const RADIUS = 29;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ScoreRing({ label, score = null }) {
  const hasScore = score != null;
  const offset = hasScore ? CIRCUMFERENCE * (1 - score / 100) : CIRCUMFERENCE;

  return (
    <div className='score-ring'>
      <p className='score-ring__label'>{label}</p>
      <div className='score-ring__stack'>
        <svg viewBox='0 0 68 68' className='score-ring__svg' aria-hidden='true'>
          <circle cx='34' cy='34' r={RADIUS} className='score-ring__track' />
          {hasScore && (
            <circle
              cx='34'
              cy='34'
              r={RADIUS}
              className='score-ring__progress'
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
            />
          )}
        </svg>
        <span
          className={`score-ring__value ${hasScore ? "" : "score-ring__value--empty"}`}
        >
          {hasScore ? score : "TBD"}
        </span>
      </div>
    </div>
  );
}
