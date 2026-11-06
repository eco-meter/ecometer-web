import { useState } from "react";
import { useLocation } from "react-router-dom";
import { CONTACT_EMAIL, CONTACT_HREF } from "../../lib/contact";
import "./Faq.css";

const faqs = [
  {
    question: "How often are scores updated?",
    answer:
      "Scores are updated any time a restaurant undergoes a new two-week waste audit for all three categories and reports it to us.",
  },
  {
    question: "Can restaurants pay for a better score?",
    answer:
      "Yes! Restaurants can pay to improve their score by investing more into reducing waste in their operations. And the best part? With EcoMeter\u2019s help, they\u2019ll earn all that money back within a year.",
  },
  {
    question:
      "Can restaurants really become more profitable by making greener choices?",
    answer:
      "A common misconception is that becoming more eco-friendly means spending more, but the opposite is true when done right. Every $1 towards preventing and reducing food waste saves restaurants a median $8.30. This sometimes went as high as $617.70 saved per $1 invested in a study by the World Resources Institute.\n\nIf you\u2019re wasting less, you\u2019re spending less while utilizing more of what you have, helping you save money!",
  },
  {
    question: "Who verifies the data?",
    answer:
      "Restaurants are responsible for collecting the data on their own end using our guidelines. They\u2019re incentivized to do so as thoroughly as possible because accurate data = accurate solutions, which saves them more money.\n\nFor an extra level of verification, restaurants can request a manual review from the EcoMeter team. These restaurants have the \u201cEcoMeter Verified\u201d badge on their profiles.",
  },
  {
    question: "Why trust EcoMeter?",
    answer:
      "Unlike restaurants, we have all the time in the world to conduct full length research and stay up to date with sustainability research, innovations, and regulations. We\u2019re sustainability nerds at our core and we love doing what we do!\n\nOn top of that, we\u2019re constantly peer reviewing our methodology, services, and products with local sustainability consultancies and the City of Vancouver to make sure everything is done right.",
  },
  {
    question:
      "Do you look at other factors such as energy and water consumption?",
    answer:
      "EcoMeter\u2019s scoring system focuses specifically on the weight of solid waste that goes from restaurants to landfills. For that reason, we can\u2019t include other factors that add to a restaurant\u2019s carbon footprint like energy and water usage. We instead address this by awarding additional but separate achievements verified through partnerships with other organizations. See our list of partners for more.",
  },
  {
    id: "get-listed", // "For Restaurants" in the nav and footer links here
    question: "How do I suggest a restaurant?",
    answer: (
      <>
        If you or someone you know owns or works at a restaurant you want listed
        on our website, email us at <a href={CONTACT_HREF}>{CONTACT_EMAIL}</a>{" "}
        to get in touch!
      </>
    ),
  },
];

// Index of the question whose id matches the URL hash, or -1.
function findLinkedIndex(hash) {
  return faqs.findIndex((item) => item.id && `#${item.id}` === hash);
}
export default function Faq() {
  const { hash } = useLocation();
  const [openIndex, setOpenIndex] = useState(() => {
    const linked = findLinkedIndex(hash);
    return linked === -1 ? 0 : linked;
  });

  // Arriving from a link like /about#get-listed opens that question,
  // including when you're already on this page.
  const [lastHash, setLastHash] = useState(hash);
  if (hash !== lastHash) {
    setLastHash(hash);
    const linked = findLinkedIndex(hash);
    if (linked !== -1) setOpenIndex(linked);
  }

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className='faq'>
      <h2>Questions, answered</h2>

      <div className='faq__list'>
        {faqs.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div className='faq__item' key={item.question} id={item.id}>
              <button className='faq__question' onClick={() => toggle(i)}>
                <span>{item.question}</span>
                <span className='faq__icon'>{isOpen ? "\u2212" : "+"}</span>
              </button>
              {isOpen && <p className='faq__answer'>{item.answer}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
