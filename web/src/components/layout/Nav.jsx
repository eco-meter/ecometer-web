import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Nav.css";

export default function Nav() {
  return (
    <nav className='nav'>
      <div className='nav__inner'>
        <Link to='/' className='nav__logo'>
          <img src={logo} alt='EcoMeter' />
        </Link>

        <div className='nav__links'>
          <Link to='/about'>About</Link>
          <Link to='/about#scoring'>How it Works</Link>
          <Link to='/about#cta'>For Restaurants</Link>
        </div>

        <button className='nav__cta'>Contact Us</button>

        <button className='nav__hamburger' aria-label='Menu'></button>
        <span />
        <span />
        <span />
      </div>
    </nav>
  );
}
