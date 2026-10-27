import "../css/Sponsors.css";
import plrg_logo from "../assets/plrg.png";
import groundshatter_logo from "../assets/ground-shatter.png";
import ghyston_logo from "../assets/ghyston.png";
import tpp_logo from "../assets/tpp.png";
import ai4ci_logo from "../assets/ai4ci.svg";
import susquehanna_logo from "../assets/susquehanna.png";
import trackr_logo from "../assets/trackr.png";

const sponsors = [
  {
    name: "Programming Languages Research Group",
    link: "https://www.bristol.ac.uk/research/groups/programming-languages/",
    image: plrg_logo,
  },
  {
    name: "Ground Shatter",
    link: "https://www.groundshatter.com/",
    image: groundshatter_logo,
  },
  {
    name: "Ghyston",
    link: "https://www.ghyston.com/",
    image: ghyston_logo,
  },
  {
    name: "TPP",
    link: "https://tpp-uk.com/",
    image: tpp_logo,
  },
  {
    name: "AI4CI",
    link: "https://ai4ci.ac.uk/",
    image: ai4ci_logo,
  },
  {
    name: "Susquehanna",
    link: "https://sig.com/",
    image: susquehanna_logo,
  },
  {
    name: "Trackr",
    link: "https://the-trackr.com/",
    image: trackr_logo,
  },
];

function Sponsors() {
  return (
    <div className="sponsors-container" id="sponsors">
      <h2 className="sponsors-heading">Our Sponsors</h2>
      <div className="sponsors-grid">
        {sponsors.map((sponsor, index) => (
          <a 
            key={index} 
            href={sponsor.link} 
            target="_blank" 
            className="sponsor-item"
          >
            <img 
              src={sponsor.image} 
              alt={`${sponsor.name} Logo`} 
              className="sponsor-logo"
            />
          </a>
        ))}
      </div>
    </div>
  );
}

export default Sponsors;
