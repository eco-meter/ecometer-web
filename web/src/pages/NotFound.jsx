import { Link } from "react-router-dom";
import "./NotFound.css";

// Shown for any URL that doesn't match a route.
export default function NotFound() {
  return (
    <section className='not-found'>
      <p className='not-found__code'>404</p>
      <h1 className='not-found__title'>This page doesn't exist</h1>
      <p className='not-found__text'>
        The link may be broken, or the page may have moved.
      </p>
      <Link to='/' className='not-found__button'>
        Back to the map
      </Link>
    </section>
  );
}
