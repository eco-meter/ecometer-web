import { useId, useState } from "react";
import { Icon } from "@iconify/react";
import ScoreDial from "./ScoreDial.jsx";
import clouds from "../../assets/restaurant/score-clouds.svg";
import greenery from "../../assets/restaurant/score-greenery.svg";
import "./MetricCard.css";

// One collapsible score card: dial, title and chevron.
// Opening it shows "How this score works" for that category,
// in the illustrated sky-and-meadow panel from Figma.
export default function MetricCard({ title, score, description }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className={`metric-card ${open ? "metric-card--open" : ""}`}>
      <button
        type='button'
        className='metric-card__header'
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        <ScoreDial score={score} />
        <span className='metric-card__title'>{title}</span>
        <Icon
          icon='akar-icons:chevron-down'
          className='metric-card__chevron'
          aria-hidden='true'
        />
      </button>

      <div className='metric-card__panel' id={panelId} inert={!open}>
        <div className='metric-card__panel-inner'>
          <div className='metric-card__explainer'>
            <img src={clouds} alt='' className='metric-card__clouds' />

            <div className='metric-card__copy'>
              <h3 className='metric-card__heading'>How this score works</h3>
              <p className='metric-card__description'>{description}</p>
            </div>

            <div className='metric-card__scene' aria-hidden='true'>
              <svg className='metric-card__sparks' viewBox='0 0 19 20'>
                <path d='M1.5 17 L5.5 19' />
                <path d='M6 2 L6.5 7.5' />
                <path d='M14 1.5 L13 7' />
              </svg>
              <ScoreDial score={score} variant='badge' />
              <span className='metric-card__dial-shadow' />
            </div>

            <img src={greenery} alt='' className='metric-card__greenery' />
          </div>
        </div>
      </div>
    </div>
  );
}
