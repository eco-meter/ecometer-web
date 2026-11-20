import Hero from "../components/about/Hero";
import Scoring from "../components/about/Scoring";
import Values from "../components/about/Values";
import Achievements from "../components/about/Achievements";
import ScoreDemo from "../components/about/ScoreDemo";
// Team section hidden until photos and team are finalized. Uncomment this line and <Team /> below to show it.
// import Team from "../components/about/Team";
import Faq from "../components/about/Faq";
import Cta from "../components/about/Cta";

export default function About() {
  return (
    <>
      <Hero />
      <Scoring />
      <Values />
      <Achievements />
      <ScoreDemo />
      {/* Team section hidden until ready. Uncomment to show it again. */}
      {/* <Team /> */}
      <Faq />
      <Cta />
    </>
  );
}
