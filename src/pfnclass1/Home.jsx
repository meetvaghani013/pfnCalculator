import React, { useRef} from "react";
import "./Home.css";
import img1 from "./first.png";
import img2 from "./second.png";
import img3 from "./third.png";
import img4 from "./four.png";

const Home = () => {
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
    <div className="body">
      <div className="mainDiv">
        <div>
          <h1>PFN Implant Failure Prediction System</h1>
          <p className="headerP">
            AI-powered clinical decision support for orthopaedic surgeons to
            predict Proximal Femoral Nail implant failure risk
          </p>

          <div className="buttonDiv">
            <button className="button" onClick={scrollToBottom}>Start New Prediction</button>
          </div>
        </div>

        <div className="features">
          <div className="container">
            <div className="container1">
              <div style={{ display: "flex", gap: "10px" }}>
                <img src={img1} alt="icon" />
                <div>
                  <p className="container1P1">Evidence-Based Predictions</p>
                  <p className="container1P2">
                    Clinical parameters analyzed with AI
                  </p>
                </div>
              </div>
              <p className="container1P3">
                Advanced prediction model considering patient demographics,
                fracture characteristics, and surgical parameters.
              </p>
            </div>

            <div className="container1">
              <div style={{ display: "flex", gap: "10px" }}>
                <img src={img2} alt="icon" />
                <div>
                  <p className="container1P1">Explainable AI</p>
                  <p className="container1P2">Understand key risk factors</p>
                </div>
              </div>
              <p className="container1P3">
                SHAP-based analysis explains contributing factors for clinical
                decisions.
              </p>
            </div>

            <div className="container1">
              <div style={{ display: "flex", gap: "10px" }}>
                <img src={img3} alt="icon" />
                <div>
                  <p className="container1P1">Risk Stratification</p>
                  <p className="container1P2">Clear risk categories</p>
                </div>
              </div>
              <p className="container1P3">
                Patients classified into low, moderate, or high-risk groups.
              </p>
            </div>

            <div className="container1">
              <div style={{ display: "flex", gap: "10px" }}>
                <img src={img4} alt="icon" />
                <div>
                  <p className="container1P1">Clinical Reports</p>
                  <p className="container1P2">PDF documentation</p>
                </div>
              </div>
              <p className="container1P3">
                Generate detailed reports for records and research.
              </p>
            </div>
          </div>
        </div>

        <div className="working">
          <div className="container2">
            <h2>How It Works</h2>
            <div className="works">
              <div className="work">
                <div className="numbers">1</div>
                <p className="container1P1">Input Patient Data</p>
                <p className="container1P3">
                  Enter demographics, fracture, and surgical data
                </p>
              </div>

              <div className="work">
                <div className="numbers">2</div>
                <p className="container1P1">AI Analysis</p>
                <p className="container1P3">
                  Model predicts risk and identifies factors
                </p>
              </div>

              <div className="work">
                <div className="numbers">3</div>
                <p className="container1P1">Get Recommendations</p>
                <p className="container1P3">
                  Review risk assessment and guidance
                </p>
              </div>
            </div>
          </div>
        </div>

        <div ref={bottomRef} className="buttonDiv">
         <input
            className="button"
            type="button"
            value="Start New Prediction"
            onClick={() => {
              window.location.href = "/implant";
            }}
          />
          <p className="bottomP">
            This tool provides decision support only and should not replace
            clinical judgment
          </p>
        </div>
      </div>
      </div>
    </>
  );
};

export default Home;
