import globeSrc from "../assets/globe.svg";
import "./Hero.css";

export default function Hero() {
  return (
    <section className='hero'>
      <div className='hero__text'>
        <h1>Discover the restaurant making a difference.</h1>
        <p>
          Real sustainability scores, built from real data. Find restaurants
          that back it up.
        </p>
      </div>

      <div className='hero__globe'>
        <img src={globeSrc} alt='' />
      </div>
    </section>
  );
}
