import globeSrc from "../../assets/globe.svg";
import GlobeSection from "../../features/globe/GlobeSection";
import "./Hero.css";

export default function Hero() {
  return (
    <div className='hero'>
      <div className='hero__heading'>
        <h1>Discover the restaurants making a difference.</h1>
        <p>
          Real sustainability scores, built from real data. Find restaurants
          that back it up.
        </p>
      </div>

      <div className='hero__globe-band'>
        <GlobeSection fallbackSrc={globeSrc} />
      </div>
    </div>
  );
}
