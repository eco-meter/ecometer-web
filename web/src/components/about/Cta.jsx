import { Link } from "react-router-dom";
import ctaBg from "../../assets/backgrounds/your-next-favourite.webp";
import "./Cta.css";

export default function Cta() {
  return (
    <section
      id='cta'
      className='about-cta'
      style={{ "--cta-bg-image": `url(${ctaBg})` }}
    >
      <h2>Find your next favourite, guilt-free.</h2>
      <p>Explore scored restaurants across Vancouver on the EcoMeter map.</p>
      <Link to='/' className='about-cta__button'>
        Open the map
      </Link>
    </section>
  );
}
