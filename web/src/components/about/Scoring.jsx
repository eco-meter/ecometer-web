import scoringBg from "../../assets/backgrounds/what-we-look-at-first.jpg";
import "./Scoring.css";

export default function Scoring() {
  return (
    <section
      className='scoring'
      style={{ backgroundImage: `url(${scoringBg})` }}
    >
      <div className='scoring__heading'>
        <p className='scoring__eyebrow'>HOW WE SCORE</p>
        <h2>What we look at first</h2>
        <p className='scoring__intro'>
          Every restaurant is measured across three categories. Together they
          roll up into a single <strong>EcoMeter</strong> score out of 300.
        </p>
      </div>

      <div className='scoring__cards'>
        <div className='scoring__card'>
          <p className='scoring__number'>01</p>
          <h3>Food</h3>
          <p className='scoring__card-title'>Making every bite count.</p>
          <p className='scoring__card-body'>
            We help restaurants reduce food waste by tracking spoiled
            ingredients, kitchen scraps, and leftovers.
          </p>
        </div>

        <div className='scoring__card'>
          <p className='scoring__number'>02</p>
          <h3>Packaging</h3>
          <p className='scoring__card-title'>Packaging with a purpose.</p>
          <p className='scoring__card-body'>
            We reward restaurants that choose reusables and use less single-use
            plastic in their packaging.
          </p>
        </div>

        <div className='scoring__card'>
          <p className='scoring__number'>03</p>
          <h3>Suppliers</h3>
          <p className='scoring__card-title'>Loving our local neighbours.</p>
          <p className='scoring__card-body'>
            We measure how much restaurants source nearby to reduce food and
            packaging waste in the community.
          </p>
        </div>
      </div>
    </section>
  );
}
