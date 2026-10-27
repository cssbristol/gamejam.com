import '../css/Societies.css';
import cssLogo from "../assets/css_logo.png";
import beeesLogo from "../assets/beees_logo.png";
import blockChainLogo from "../assets/blockchain_logo.jpeg"

function Societies() {
  return (
    <div className="societies-section" id="collaborators">
      <p className="organiser-heading">Collaborators</p>
      <div className="societies-logo">
        <a href="https://cssbristol.co.uk/">
          <img className="css-logo" src={cssLogo} alt="CSS Bristol Logo" />
        </a>
      </div>
    </div>
  );
}

export default Societies;
