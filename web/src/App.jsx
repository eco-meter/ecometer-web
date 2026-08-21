import { Routes, Route } from "react-router-dom";
import Nav from "./components/layout/Nav.jsx";
import Footer from "./components/layout/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
