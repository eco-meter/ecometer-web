import globeSrc from "../../assets/globe.svg";
import "./Hero.css";

export default function Hero() {
  return (
    <section className='about-hero'>
      <div className='about-hero__copy'>
        <h1>
          Good food.
          <br />
          Better choices.
        </h1>
        <p>
          You make choices all the time – oat milk or dairy, delivery or
          dine-in, pizza with or without pineapple. <strong>EcoMeter</strong>{" "}
          helps you make more: Choosing the most sustainable restaurants in your
          community.
        </p>
        <p className='about-hero__subline'>
          Our scores are based on real action and data, not just promises.
        </p>
        <div className='about-hero__buttons'>
          <button className='about-hero__btn-primary'>
            See how scoring works
          </button>
          <button className='about-hero__btn-secondary'>
            Browse restaurants
          </button>
        </div>
      </div>

      <div className='about-hero__globe-box'>
        <img src={globeSrc} alt='' />
      </div>
    </section>
  );
}
