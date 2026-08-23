import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Nav.css";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className='nav'>
      <div className='nav__inner'>
        <Link to='/' className='nav__logo'>
          <img src={logo} alt='EcoMeter' />
        </Link>

        <div className={`nav__links ${open ? "nav__links--open" : ""}`}>
          <Link to='/about' onClick={() => setOpen(false)}>
            About
          </Link>
          <Link to='/about#scoring' onClick={() => setOpen(false)}>
            How it Works
          </Link>
          <Link to='/about#cta' onClick={() => setOpen(false)}>
            For Restaurants
          </Link>
          <button className='nav__cta'>Contact Us</button>
        </div>

        <button
          className='nav__hamburger'
          aria-label='Menu'
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
