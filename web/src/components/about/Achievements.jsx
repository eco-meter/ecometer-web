import { useState } from "react";
import { Icon } from "@iconify/react";
import trophy from "../../assets/icons/trophy.png";
import "./Achievements.css";

const achievements = [
  {
    title: "Food For All",
    body: "Helps reduce food insecurity by regularly donating safe, edible surplus food whenever possible.",
  },
  {
    title: "Veggie Rescuer",
    body: "Actively sources visually imperfect produce to reduce food waste on farms.",
  },
  {
    title: "All Organic",
    body: "Uses only certified organic ingredients that avoid synthetic pesticides, artificial fertilizers, GMOs, and ionizing radiation.",
  },
  {
    title: "Plastic Free",
    body: "Avoids plastic throughout the storage, preparation, cleaning, and service of its food and food ware wherever practical.",
  },
  {
    title: "Reusable Friendly",
    body: "Welcomes customers who bring their own reusable food and drink containers.",
  },
  {
    title: "Canada First",
    body: "Sources the majority of its food and packaging from Canadian farms and manufacturers, verified through supplier information.",
  },
];

const moreAchievements = [
  {
    title: "Microplastic Mitigator",
    body: "Takes proactive steps to reduce microplastic contamination in food and beverages, including using high-quality water filtration.",
  },
  {
    title: "Sustainable Seafood",
    body: "Serves seafood certified by Ocean Wise.",
  },
  {
    title: "Vegetarian Champion",
    body: "Over 50% of menu items are vegetarian friendly.",
  },
  {
    title: "Vegetarian Friend",
    body: "25-50% of menu items are vegetarian friendly.",
  },
  {
    title: "Vegan Champion",
    body: "Over 50% of menu items are vegan friendly.",
  },
  { title: "Vegan Friend", body: "25-50% of menu items are vegan friendly." },
  {
    title: "Upcycler",
    body: "Uses upcycled ingredients in dishes (e.g. spent grain, fruit pulp, peels, coffee grounds, etc.) or ensures they\u2019re upcycled elsewhere.",
  },
  {
    title: "Responsible Oil",
    body: "Partners with specialized local recycling services to sustainably collect used cooking oil and replenish it with fresh oil in reusable containers.",
  },
];

function Badge({ title, body }) {
  return (
    <div className='achievements__badge'>
      <Icon icon='mdi:hexagon' className='achievements__icon'></Icon>
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </div>
  );
}

export default function Achievements() {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className='achievements'>
      <div className='achievements__heading-row'>
        <div className='achievements__heading'>
          <p className='achievements__eyebrow'>BEYOND THE SCORE</p>
          <h2>Achievements restaurants can earn</h2>
          <p className='achievements__intro'>
            On top of their score, restaurants unlock achievements for further.
            Achievements show up on their profiles and on the map.
          </p>
        </div>
        <img src={trophy} alt='' className='achievements__trophy' />
      </div>

      <div className='achievements__grid'>
        {achievements.map((a) => (
          <Badge key={a.title} {...a} />
        ))}
        {showMore &&
          moreAchievements.map((a) => <Badge key={a.title} {...a} />)}
      </div>

      <button
        className='achievements__discover'
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? "Show fewer achievements" : "Discover more achievements"}
      </button>
    </section>
  );
}
