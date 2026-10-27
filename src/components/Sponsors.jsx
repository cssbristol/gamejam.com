import "../css/Sponsors.css";

const sponsors = [
  {
    name: "Programming Languages Research Group",
    link: "https://www.bristol.ac.uk/research/groups/programming-languages/",
    image: "src/assets/plrg.png"
  },
  {
    name: "Ground Shatter",
    link: "https://www.groundshatter.com/",
    image: "src/assets/ground-shatter.png"
  },
  {
    name: "Ghyston",
    link: "https://www.ghyston.com/",
    image: "src/assets/ghyston.png"
  },
  {
    name: "TPP",
    link: "https://tpp-uk.com/",
    image: "src/assets/tpp.png"
  },
  {
    name: "AI4CI",
    link: "https://ai4ci.ac.uk/",
    image: "src/assets/ai4ci.svg"
  },
  {
    name: "Susquehanna",
    link: "https://sig.com/",
    image: "src/assets/susquehanna.png"
  },
  {
    name: "Trackr",
    link: "https://the-trackr.com/",
    image: "src/assets/trackr.png"
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
