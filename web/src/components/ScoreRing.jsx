import "./scoreRing.css";

export default function ScoreRing({ label, value = "TBD" }) {
  return (
    <div className='score-ring'>
      <p className='score-ring__label'>{label}</p>
      <div className='score-ring__circle'>
        <span>{value}</span>
      </div>
    </div>
  );
}
