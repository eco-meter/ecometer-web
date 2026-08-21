import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className='footer'>
      <div className='footer__row'>
        <Link to='/' className='footer__logo'>
          <img src={logo} alt='EcoMeter' />
        </Link>

        <div className='footer__links'>
          <Link to='/about'>About</Link>
          <Link to='/about#scoring'>How it Works</Link>
          <Link to='/about#cta'>For Restaurants</Link>
          <Link to='/about#cta'>Contact</Link>
        </div>
      </div>

      <hr className='footer__divider' />

      <div className='footer__bottom'>
        <span>
          &copy; {new Date().getFullYear()} EcoMeter. All rights reserved.
        </span>
        <a
          href='https://jessicapswilson.com'
          target='_blank'
          rel='noopener noreferrer'
        >
          Built by Jess Wilson
        </a>
      </div>
    </footer>
  );
}
