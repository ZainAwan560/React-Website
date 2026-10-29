import "./BrandStrip.css";

import versace from "../../assets/versace.png";
import zara from "../../assets/zara.png";
import gucci from "../../assets/gucci.png";
import prada from "../../assets/prada.png";
import calvinKlein from "../../assets/calvin-klein.png";

const BrandStrip = () => {
  return (
    <section className="brand-strip">
      <div className="brand-container">

        <div className="brand-item">
          <img src={versace} alt="Versace" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/assets/versace.png"; }} />
        </div>

        <div className="brand-item">
          <img src={zara} alt="Zara" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/assets/zara.png"; }} />
        </div>

        <div className="brand-item">
          <img src={gucci} alt="Gucci" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/assets/gucci.png"; }} />
        </div>

        <div className="brand-item">
          <img src={prada} alt="Prada" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/assets/prada.png"; }} />
        </div>

        <div className="brand-item">
          <img src={calvinKlein} alt="Calvin Klein" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/assets/calvin-klein.png"; }} />
        </div>

      </div>
    </section>
  );
};

export default BrandStrip;