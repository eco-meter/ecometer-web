import { useId, useState } from "react";
import { Icon } from "@iconify/react";
import ScoreDial from "./ScoreDial.jsx";
import "./MetricCard.css";

// One collapsible score card: dial, title and chevron.
// Opening it shows "How this score works" for that category.
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
            <div className='metric-card__copy'>
              <h3 className='metric-card__heading'>How this score works</h3>
              <p className='metric-card__description'>{description}</p>
            </div>
            <div className='metric-card__scene' aria-hidden='true'>
              <ScoreDial score={score} size={56} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
