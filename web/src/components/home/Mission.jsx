import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./Mission.css";

export default function Mission() {
  return (
    <section className='mission'>
      <div className='mission__content'>
        <h2>What we're actually doing</h2>
        <p>
          EcoMeter tracks the solid waste restaurants send to the landfill and
          turns it into a score you can trust. It's how good businesses get
          recognized, and how you find them.
        </p>
      </div>

      <Link to='/about' className='mission__button'>
        Our Story
        <Icon icon='mdi:arrow-right' width={16} height={16} />
      </Link>
    </section>
  );
}
