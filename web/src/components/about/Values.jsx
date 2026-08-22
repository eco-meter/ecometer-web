import { Icon } from "@iconify/react";
import "./Values.css";

const values = [
  {
    title: "Transparency",
    body: "Scores are public, criteria are published, and every rating shows its work",
  },
  {
    title: "Local first",
    body: "We start with the neighbourhoods we eat in and the growers who feed them.",
  },
  {
    title: "Progress over purity",
    body: "We reward restaurants for improving, not just for being perfect on day one.",
  },
];

export default function Values() {
  return (
    <section className='values'>
      <div className='values__heading'>
        <p className='values__eyebrow'>WHAT WE BELIEVE</p>
        <h2>Good food shouldn't cost the planet.</h2>
        <p className='balues__subline'>Know your foodprint.</p>
      </div>

      <div className='values__row'>
        {values.map((v) => (
          <div className='values__item' key={v.title}>
            <Icon icon='mdi:hexagon' className='values__icon' />
            <h3>{v.title}</h3>
            <p>{v.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
