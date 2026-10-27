import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import Info from "../components/Info"
import Navbar from "../components/Navbar"
import Counter from "../components/Counter"
import Societies from "../components/Societies"
import Schedule from "../components/Schedule"
import Prizes from "../components/Prizes"
import Rules from "../components/Rules"
import Sponsors from "../components/Sponsors"
import Footer from "../components/Footer"
import "../css/Home.css"
import TimeVortex from "../components/TimeVortex"

function Home() {

  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [location]);

  return (
    <div className="main">
      <TimeVortex />
      <div className="text-wrapper orbitron">
        <Navbar></Navbar>
        <div style={{ height: "100vh" }} />
        <Info></Info>
        <Counter></Counter>
        <Rules></Rules>
        <Prizes></Prizes>
        <Schedule></Schedule>
        <Sponsors></Sponsors>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Home;
