import { useLocation, Navigate } from "react-router-dom";
import React, { useRef } from "react";
import "./Result.css";
import error from "./error.jpeg";
import html2pdf from "html2pdf.js";
import download from "./download.png";
import highrisk from "./highrisk.jpeg";

const Result = () => {
  const location = useLocation();
  const state = location.state;

  if (!state || !state.formData || !state.result) {
    return <Navigate to="/" replace />;
  }

  const { formData, result } = state;

  const risk = Number(result.risk);
  const riskLevel = result.riskLevel;
  const isHighRisk = riskLevel.toLowerCase() === "high";

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);

    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const pdfRef = useRef();

  const downloadPDF = () => {
    const element = pdfRef.current;

    // 🔴 Hide buttons manually
    const buttons = element.querySelectorAll(".no-pdf");
    buttons.forEach((btn) => (btn.style.display = "none"));

    const options = {
      margin: 0,
      filename: "Implant_Risk_Report.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 1,
        useCORS: true,
        scrollY: 0,
      },
      jsPDF: {
        unit: "px",
        format: [element.scrollWidth, element.scrollHeight],
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all"] },
    };

    html2pdf()
      .set(options)
      .from(element)
      .save()
      .then(() => {
        // 🟢 Show buttons again
        buttons.forEach((btn) => (btn.style.display = ""));
      });
  };

  return (
    <>
      <div className="body">
        <div className="rmainDiv" ref={pdfRef}>
          <div className="Containers">
            <div className="rcontainer1">
              <div className="box1">
                <div>
                  <button
                    className="backBtn no-pdf"
                    onClick={() => {
                      window.location.href = "/implant";
                    }}
                  >
                    ← New Prediction
                  </button>
                </div>
                <div>
                  <h1 className="implantH1 heading">Risk Assessment Results</h1>
                </div>
                <div>
                  <p className="container1P2 time">
                    Generated on {formatDateTime(result.createdAt)}
                  </p>
                </div>
              </div>
              <div className="box2">
                <button className="download no-pdf" onClick={downloadPDF}>
                  <img src={download} alt="" style={{ width: "30px" }} />
                  <p>Download PDF Report</p>
                </button>
              </div>
            </div>

            <div className="rcontainer2">
              <div style={{ padding: "0 24px" }}>
                <img
                  className="errorImg"
                  src={isHighRisk ? highrisk : error}
                  alt=""
                />
              </div>
              <div style={{ padding: "0 24px" }}>
                <h2>Implant Failure Risk</h2>
              </div>
              <div style={{ padding: "0 24px" }}>
                <h1 className="h1" style={{color: isHighRisk ? "#dc2626" : "#f59f01",}}>{risk}%</h1>
              </div>
              <div style={{ padding: "0 24px" }}>
                <p
                  style={{
                    padding: "8px 15px 8px 15px",
                    backgroundColor: "#e1e7ef",
                    borderRadius: "10px",
                  }}
                  className="moderate"
                >
                  {riskLevel.toUpperCase()} RISK
                </p>
              </div>
              <div style={{ padding: "0 24px" }}>
                <input
                  disabled
                  type="range"
                  min="0.00"
                  max="100.00"
                  className="riskRange"
                  value={risk}
                  step={0.01}
                  style={{
                    background: `linear-gradient(
                      to right,
                      #2563eb 0%,
                      #2563eb ${risk}%,
                      #e5e7eb ${risk}%,
                      #e5e7eb 100%
                    )`,
                    padding: "0px",
                  }}
                />
              </div>
            </div>

            <div className="rcontainer3">
              <h3
                style={{
                  margin: "0",
                  fontSize: "16px",
                  fontWeight: "600",
                  padding: "0 24px",
                }}
              >
                Key Contributing Factors
              </h3>
              <p className="container1P2" style={{ padding: "0 24px" }}>
                Factors with the highest impact on failure risk (SHAP analysis)
              </p>
            </div>

            <div className="rcontainer4" style={{backgroundColor: isHighRisk ? "#ef43431a" : "#f59f0a1a", borderColor: isHighRisk ? "#ef4343" : "rgb(245, 149,10)"}}>
              <div style={{ padding: "0 0 0 24px" }}>
                <p>⚠︎</p>
              </div>
              <div style={{ padding: "0 24px 0 0" }}>
                <h3
                  style={{ margin: "0", fontSize: "16px", fontWeight: "600" }}
                >
                  Clinical Recommendations
                </h3>
                <p style={{ margin: "10px 0px" }}>
                  Optimize reduction quality and ensure TAD{" <"}20mm. Consider
                  careful lag screw positioning in center-center or
                  inferior-center position. Monitor closely for early signs of
                  failure.
                </p>
              </div>
            </div>

            <div className="rcontainer5">
              <h3 className="psTitle">Patient Summary</h3>
              <p className="psSubtitle">Input parameters used for prediction</p>

              <div className="summaryGrid">
                
                  <div className="summaryBlock fullWidth">
                  <h4>Demographics</h4>
                  <div className="row">
                    <span>Age:</span>
                    <strong>{formData.age} years</strong>
                  </div>
                  <div className="row">
                    <span>Sex:</span>
                    <strong>{formData.gender}</strong>
                  </div>
                  <div className="row">
                    <span>BMI:</span>
                    <strong>{formData.bmi} kg/m²</strong>
                  </div>
                  <div className="row">
                    <span>Side:</span>
                    <strong>{formData.side}</strong>
                  </div>
                  <div className="row">
                    <span>Mode of Injury:</span>
                    <strong>{formData.modeOfInjuring}</strong>
                  </div>
                </div>

              {/*  <div className="summaryBlock">
                  <h4>Fracture Characteristics</h4>
                  <div className="row">
                    <span>AO/OTA:</span>
                    <strong>{formData.aoota}</strong>
                  </div>
                  <div className="row">
                    <span>Stability:</span>
                    <strong>{formData.stability}</strong>
                  </div>
                  <div className="row">
                    <span>Medial Calcar:</span>
                    <strong>{formData.calcar}</strong>
                  </div>
                  <div className="row">
                    <span>Lateral Wall:</span>
                    <strong>{formData.lateralWall}mm</strong>
                  </div>
                </div> */}

                {/*    <div className="summaryBlock fullWidth">
                  <h4>Surgical Parameters</h4>

                  <div className="twoCol">
                    <div className="row">
                      <span>Reduction Quality:</span>
                      <strong>{formData.reduction}</strong>
                    </div>
                    <div className="row">
                      <span>Tip-Apex Distance:</span>
                      <strong>{formData.tad}mm</strong>
                    </div>

                    <div className="row">
                      <span>Lag Screw Position:</span>
                      <strong>{formData.legScrew}</strong>
                    </div>
                    <div className="row">
                      <span>Neck-Shaft Angle:</span>
                      <strong>{formData.neckShaftAngle}°</strong>
                    </div>

                    <div className="row">
                      <span>Nail Length:</span>
                      <strong>{formData.nailLength}mm</strong>
                    </div>
                  </div> 
                </div> */}
              </div>
            </div>

            <div className="rcontainer6">
              <p>
                <label htmlFor="Disclaimer" style={{ fontWeight: "bold" }}>
                  Disclaimer:
                </label>
                This prediction tool provides decision support only and should
                not replace clinical judgment. The AI model is based on clinical
                parameters and research evidence but individual patient factors
                may vary. Always consider the complete clinical picture when
                making treatment decisions.
              </p>
            </div>

            <div className="rcontainer7">
              <div>
                <button
                  className="cancle no-pdf"
                  onClick={() => {
                    window.location.href = "/implant";
                  }}
                >
                  New Assessment
                </button>
              </div>
              <div>
                <button
                  className="calculate_risk no-pdf"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  Back To Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Result;
