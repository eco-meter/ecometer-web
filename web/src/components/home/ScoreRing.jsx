import "./ScoreRing.css";

export default function ScoreRing({ label, percent = null }) {
  const radius = 31;
  const circumference = 2 * Math.PI * radius;
  const progress = percent != null ? (percent / 100) * circumference : 0;

  return (
    <div className='score-ring'>
      <p className='score-ring__label'>{label}</p>
      <div className='score-ring__stack'>
        <svg viewBox='0 0 68 68' className='score-ring__svg'>
          <circle cx='34' cy='34' r='31.5' className='score-ring__outer-disc' />
          <circle cx='34' cy='34' r='24.5' className='score-ring__inner-disc' />
          <g transform='rotate(-90 34 34)'>
            <circle cx='34' cy='34' r={radius} className='score-ring__track' />
            <circle
              cx='34'
              cy='34'
              r={radius}
              className='score-ring__progress'
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
            />
          </g>
        </svg>
        <span className='score-ring__value'>
          {percent != null ? `${percent}%` : "TBD"}
        </span>
      </div>
    </div>
  );
}
