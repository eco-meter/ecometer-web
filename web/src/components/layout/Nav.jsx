import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { CONTACT_HREF } from "../../lib/contact";
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
          <Link to='/about#get-listed' onClick={() => setOpen(false)}>
            For Restaurants
          </Link>
          <a
            href={CONTACT_HREF}
            className='nav__cta'
            onClick={() => setOpen(false)}
          >
            Contact Us
          </a>
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
