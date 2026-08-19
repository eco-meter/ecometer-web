import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className='footer'>
      <div className='footer__inner'>
        <span className='footer__logo'>EcoMeter</span>

        <div className='footer_links'>
          <Link to='/about'>About</Link>
          <Link to='/'>Browse Restaurants</Link>
          <Link to='/about#cta'>For Restaurants</Link>
        </div>
      </div>

      <hr className='footer__divider' />

      <div className='footer__bottom'>
        <span>&copy; {new Date().getFullYear()} EcoMeter</span>
        <span>Design &amp; build: Jess Wilson</span>
      </div>
    </footer>
  );
}
