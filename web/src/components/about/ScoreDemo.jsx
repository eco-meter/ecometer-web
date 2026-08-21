import { useState } from "react";
import { Icon } from "@iconify/react";
import scoreDemoBg from "../../assets/backgrounds/how-a-score.jpg";
import "./ScoreDemo.css";

const messages = {
  "Food Waste": [
    {
      at: 0,
      text: "Nobody\u2019s eating the food. That\u2019s probably not a good thing\u2026",
    },
    {
      at: 15,
      text: "The fridge broke down again and now everything\u2019s spoiled\u2026",
    },
    { at: 25, text: "Lots of food left on plates." },
    { at: 35, text: "Threw out a bunch of food no one ordered." },
    {
      at: 50,
      text: "Some food got wasted, but we\u2019re trying to keep it under control.",
    },
    {
      at: 65,
      text: "Most ingredients got used, but there\u2019s still some waste.",
    },
    {
      at: 75,
      text: "Portions are dialed in and leftovers are kept to a minimum.",
    },
    { at: 85, text: "Every ingredient has a purpose \u2013 even the scraps!" },
    {
      at: 100,
      text: "Full utilization of ingredients. Almost nothing goes to waste!",
    },
  ],
  "Packaging Waste": [
    {
      at: 0,
      text: "Everything is single-use and none of it can be recycled\u2026",
    },
    { at: 15, text: "Well, at least we have paper towels\u2026" },
    { at: 25, text: "Plastic here. Plastic there. Plastic everywhere!" },
    {
      at: 35,
      text: "Packed lots of items customers didn\u2019t ask for that will likely be discarded.",
    },
    {
      at: 50,
      text: "Switched a lot of packaging to non-plastic compostables.",
    },
    {
      at: 65,
      text: "Trying to cut down on packaging. Most of what\u2019s left is compostable.",
    },
    {
      at: 75,
      text: "Everything our dine-in customers used got reused! Takeout\u2019s still a WIP.",
    },
    { at: 85, text: "Experimenting with reusable alternatives for takeout." },
    { at: 100, text: "Single-use is a thing of the past. Reuse comes first!" },
  ],
  "Supplier Waste": [
    { at: 0, text: "Ordered everything from overseas because it was cheaper." },
    {
      at: 15,
      text: "Picked up one or two things from a grocery the other day.",
    },
    {
      at: 25,
      text: "Bought a mix of products from inside and outside the country.",
    },
    {
      at: 35,
      text: "Most of what was used was sourced from somewhere in the country.",
    },
    { at: 50, text: "Working on sourcing from places closer to us." },
    {
      at: 65,
      text: "Priority is starting to shift to responsible, local suppliers.",
    },
    { at: 75, text: "We take pride in sourcing locally where we can." },
    {
      at: 85,
      text: "Almost fully local now \u2013 either from town or nearby!",
    },
    {
      at: 100,
      text: "Everything we can source locally, we do. It\u2019s one of our top priorities!",
    },
  ],
};

function nearestMessage(category, value) {
  const brackets = messages[category];
  return brackets.reduce((closest, b) =>
    Math.abs(b.at - value) < Math.abs(closest.at - value) ? b : closest,
  ).text;
}

export default function ScoreDemo() {
  const [values, setValues] = useState({
    "Food Waste": 73,
    "Packaging Waste": 52,
    "Supplier Waste": 33,
  });

  const handleChange = (label, val) => {
    setValues((prev) => ({ ...prev, [label]: Number(val) }));
  };

  const average = Object.values(values).reduce((a, b) => a + b, 0) / 3;
  const totalScore = Math.round((average / 100) * 300);

  return (
    <section
      className='score-demo'
      style={{ backgroundImage: `url(${scoreDemoBg})` }}
    >
      <div className='score-demo__heading'>
        <p className='score-demo__eyebrow'>TRY IT</p>
        <h2>See how a score comes together</h2>
      </div>

      <div className='score-demo__card'>
        <div className='score-demo__sliders'>
          {Object.entries(values).map(([label, value]) => (
            <div className='score-demo__slider' key={label}>
              <div className='score-demo__slider-labels'>
                <span>{label}</span>
                <span>{value}%</span>
              </div>
              <input
                type='range'
                min='0'
                max='100'
                value={value}
                onChange={(e) => handleChange(label, e.target.value)}
                className='score-demo__range'
                style={{ "--fill": `${value}%` }}
              />
              <div className='score-demo__message'>
                <Icon
                  key={nearestMessage(label, value)}
                  icon='mdi:chat-outline'
                  className='score-demo__message-icon'
                />
                <p>{nearestMessage(label, value)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className='score-demo__preview'>
          <p className='score-demo__preview-label'>ECOMETER SCORE</p>
          <p className='score-demo__preview-number'>{totalScore}</p>
          <p className='score-demo__preview-tier'>Green Standard</p>
        </div>
      </div>

      <p className='score-demo__disclaimer'>
        These are simplified examples to help illustrate how EcoMeter scores
        work. Actual scores are determined using our full assessment
        methodology, and every restaurant's path to a score is unique.
      </p>
    </section>
  );
}
