import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import "./Implant.css";
import calculator from "./calculator.jpeg";
import loader from "./loading.png"
import axios from "axios";

const Implant = () => {
  const navigate = useNavigate();

  // const apexMin = 5;
  // const apexMax = 50;
  // const angleMin = 90;
  // const angleMax = 160;
  // const nailLengthMin = 150;
  // const nailLengthMax = 400;
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    age: "70",
    gender: "Female",
    bmi: "24",
    side: "Right",
    modeOfInjuring: "Fall",
    // aoota: "31-A1",
    // stability: "Stable",
    // calcar: "No",
    // lateralWall: 25,
    // reduction: "Good",
    // tad: 18,
    // neckShaftAngle: 130,
    // nailLength: 240,
    // legScrew: "Center-Center",
  });

  const handleCalculateRisk = async () => {
    if (errors.age || errors.bmi) {
      alert("Please fix validation errors");
      return;
    }

    if (!image) {
      alert("Please upload an image");
      return;
    }

    if (image.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    if (!image.type.startsWith("image/")) {
      alert("Only images are allowed");
      return;
    }

    setLoading(true); // 🔥 START LOADING

    try {
      const formDataToSend = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      formDataToSend.append("image", image);

      const response = await axios.post(
        "http://localhost:5000/calculate-risk",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      navigate("/Result", {
        state: {
          formData: form,
          result: response.data,
        },
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Risk calculation failed");
    } finally {
      setLoading(false); // 🔥 STOP LOADING
    }
  };

  const [errors, setErrors] = useState({
    age: "",
    bmi: "",
  });

  return (
    <>
      <div className="body">
        <div className="mainDiv">
          <div className="containers">
            <div className="containers1">
              <button
                className="backBtn"
                onClick={() => {
                  window.location.href = "/";
                }}
              >
                ← Back To Home
              </button>
              <h1 className="implantH1">Patient Data Input</h1>
              <p className="container1p1">
                Enter patient demographics, fracture characteristics, and
                surgical parameters
              </p>
            </div>

            <div className="containers2">
              <div>
                <h3>Patient Demographics</h3>
                <p>Basic patient information</p>
              </div>

              <div className="inputDiv">
                <div className="ageDiv">
                  <label htmlFor="age">Age(Years)</label>
                  <input
                    type="number"
                    id="age"
                    value={form.age}
                    onChange={(e) => {
                      const value = e.target.value;

                      setForm({ ...form, age: value });

                      if (value === "") {
                        setErrors({ ...errors, age: "Age is required" });
                      } else if (Number(value) < 18 || Number(value) > 120) {
                        setErrors({
                          ...errors,
                          age: "Age must be between 18 and 120 years",
                        });
                      } else {
                        setErrors({ ...errors, age: "" });
                      }
                    }}
                  />

                  {errors.age && <p style={{ color: "red" }}>{errors.age}</p>}
                </div>

                <div className="genderDiv">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    value={form.gender}
                    onChange={(e) =>
                      setForm({ ...form, gender: e.target.value })
                    }
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="bmiDiv">
                  <label htmlFor="bmi">Bmi(kg/m²)</label>
                  <input
                    type="number"
                    id="bmi"
                    value={form.bmi}
                    onChange={(e) => {
                      const value = e.target.value;

                      setForm({ ...form, bmi: value });

                      if (value === "") {
                        setErrors({ ...errors, bmi: "BMI is required" });
                      } else if (Number(value) < 10 || Number(value) > 60) {
                        setErrors({
                          ...errors,
                          bmi: "BMI must be between 10 and 60",
                        });
                      } else {
                        setErrors({ ...errors, bmi: "" });
                      }
                    }}
                  />

                  {errors.bmi && <p style={{ color: "red" }}>{errors.bmi}</p>}
                </div>

                <div className="sideDiv">
                  <label htmlFor="side">Side</label>
                  <select
                    id="side"
                    value={form.side}
                    onChange={(e) => setForm({ ...form, side: e.target.value })}
                  >
                    <option value="Right">Right</option>
                    <option value="Left">left</option>
                  </select>
                </div>

                <div className="modeOfInjuringDiv">
                  <label htmlFor="modeOfInjuring">Mode Of Injuring</label>
                  <select
                    id="modeOfInjuring"
                    value={form.modeOfInjuring}
                    onChange={(e) =>
                      setForm({ ...form, modeOfInjuring: e.target.value })
                    }
                  >
                    <option value="Fall">Fall</option>
                    <option value="Road Traffic Accident">
                      Road Traffic Accident
                    </option>
                    <option value="Assault">Assault</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* <div className="containers3">
              <div>
                <div>
                  <h3>Fracture Characteristics</h3>
                  <p>Fracture pattern and stability assessment</p>
                </div>

                <div className="inputDiv">
                  <div className="classification">
                    <label htmlFor="ao/ota">AO/OTA Classification</label>
                    <select
                      name="aoota"
                      id="ao/ota"
                      value={form.aoota}
                      onChange={(e) =>
                        setForm({ ...form, aoota: e.target.value })
                      }
                    >
                      <option value="31-A1">
                        31-A1(Simple pertrochantaric)
                      </option>
                      <option value="31-A2">
                        31-A2(multifragmentary perthochantaric)
                      </option>
                      <option value="31-A3">31-A3(intertrochantaric)</option>
                    </select>
                  </div>

                  <div className="stability">
                    <label htmlFor="stability">Stability Status</label>
                    <select
                      value={form.stability}
                      onChange={(e) =>
                        setForm({ ...form, stability: e.target.value })
                      }
                    >
                      <option value="Stable">Stable</option>
                      <option value="Unstable">Unstable</option>
                    </select>
                  </div>

                  <div>
                    <div className="medialCalcar">
                      <div>
                        <label>Medial Calcar Comminution</label>
                        <p>Loss of medial cortical support</p>
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div className="medialToggle">
                          <label className="switch">
                            <input
                              type="checkbox"
                              onChange={() =>
                                setForm({
                                  ...form,
                                  calcar: form.calcar === "Yes" ? "No" : "yes",
                                })
                              }
                            />
                            <span className="slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div>
                      <label>
                        Leteral Wall Thickness(mm): {form.lateralWall}
                      </label>
                    </div>
                    <div>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={form.lateralWall}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            lateralWall: Number(e.target.value),
                          })
                        }
                        className="LeteralRange"
                        style={{
                          background: `linear-gradient(
                           to right,
                           #2563eb 0%,
                           #2563eb ${(form.lateralWall / 50) * 100}%,
                           #e5e7eb ${(form.lateralWall / 50) * 100}%,
                           #e5e7eb 100%
                         )`,
                          padding: "0px",
                        }}
                      />
                    </div>
                    <div>
                      <p>Critical threshold: 20mm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            {/* <div className="containers4">
              <div>
                <div>
                  <h3>Surgical Parameters</h3>
                  <p>Intraoperative measurements and implant details</p>
                </div>
                <div className="inputDiv">
                  <div>
                    <label htmlFor="Reduction">Reduction quality</label>
                    <select
                      name="reduction"
                      id="reduction"
                      value={form.reduction}
                      onChange={(e) =>
                        setForm({ ...form, reduction: e.target.value })
                      }
                    >
                      <option value="Good">Good</option>
                      <option value="Acceptable">Acceptable</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>

                  <div className="tip-Apex">
                    <div>
                      <label>Tip-Apex Distance (mm): {form.tad}</label>
                    </div>
                    <div>
                      <input
                        type="range"
                        min={apexMin}
                        max={apexMax}
                        className="apexRange"
                        style={{
                          background: `linear-gradient(
                          to right,
                          #2563eb 0%,
                          #2563eb ${((form.tad - apexMin) / (apexMax - apexMin)) * 100}%,
                          #e5e7eb ${((form.tad - apexMin) / (apexMax - apexMin)) * 100}%,
                          #e5e7eb 100%
                        )`,
                          padding: "0",
                        }}
                        value={form.tad}
                        onChange={(e) =>
                          setForm({ ...form, tad: Number(e.target.value) })
                        }
                      />
                    </div>

                    <div>
                      <p>{"Optimal: <20mm, Critical: >25mm"}</p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="legScrew">
                      Leg Screw Position(Cleveland Zone)
                    </label>
                    <input
                      type="text"
                      name="legScrew"
                      value={form.legScrew}
                      onChange={(e) =>
                        setForm({ ...form, legScrew: e.target.value })
                      }
                      placeholder="e.g, Center-Center,Inferior-Center"
                      id="legScrew"
                    />
                    <p>AP and lateral views</p>
                  </div>

                  <div>
                    <div>
                      <label htmlFor="Neak-Shaft">
                        Neak-Shaft Angle(°):{form.neckShaftAngle}
                      </label>
                    </div>
                    <div>
                      <input
                        type="range"
                        min={angleMin}
                        max={angleMax}
                        className="apexRange"
                        style={{
                          background: `linear-gradient(
                           to right,
                           #2563eb 0%,
                           #2563eb ${((form.neckShaftAngle - angleMin) / (angleMax - angleMin)) * 100}%,
                           #e5e7eb ${((form.neckShaftAngle - angleMin) / (angleMax - angleMin)) * 100}%,
                           #e5e7eb 100%
                         )`,
                          padding: "0",
                        }}
                        value={form.neckShaftAngle}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            neckShaftAngle: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <p>Normal range: 125-135°</p>
                    </div>
                  </div>

                  <div>
                    <div>
                      <label htmlFor="naillength">
                        Nail Length(mm): {form.nailLength}
                      </label>
                    </div>
                    <div>
                      <input
                        type="range"
                        min={nailLengthMin}
                        max={nailLengthMax}
                        step={"10"}
                        className="apexRange"
                        style={{
                          background: `linear-gradient(
                           to right,
                           #2563eb 0%,
                           #2563eb ${((form.nailLength - nailLengthMin) / (nailLengthMax - nailLengthMin)) * 100}%,
                           #e5e7eb ${((form.nailLength - nailLengthMin) / (nailLengthMax - nailLengthMin)) * 100}%,
                           #e5e7eb 100%
                         )`,

                          padding: "0",
                        }}
                        value={form.nailLength}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            nailLength: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <p>Standard lengths: 170, 200, 240, 280, 340mm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}

            <div className="imgUpload">
              <label htmlFor="imgUpload" className="uploadBox">
                <span>📷 Upload Image</span>
                <small>PNG, JPG up to 5MB</small>
              </label>
              <input
                type="file"
                name="imgUpload"
                id="imgUpload"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>

            <div className="containers5">
              <div>
                <button
                  className="cancle"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  Cancle
                </button>
              </div>
              <div>
                <button
                  className={`calculate_risk ${loading ? "loadingBtn" : ""}`}
                  onClick={handleCalculateRisk}
                  disabled={loading}
                >
                      <img className="img" src={loading ? loader : calculator} alt="" />
                      {loading ? "Calculating..." : "Calculate Risk"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Implant;
