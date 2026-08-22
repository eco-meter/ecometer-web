import ctaBg from "../../assets/backgrounds/your-next-favourite.jpg";
import "./Cta.css";

export default function Cta() {
  return (
    <section
      className='about-cta'
      style={{ "--cta-bg-image": `url(${ctaBg})` }}
    >
      <h2>Find your next favourite, guilt-free.</h2>
      <p>Explore scored restaurants across Vancouver on the EcoMeter map.</p>
      <button className='about-cta__button'>Open the map</button>
    </section>
  );
}
