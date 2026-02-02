import React from "react";
import Home from "./pfnclass1/Home";
import Implant from "./pfnclass2/Implant";
import Result from "./pfnclass3/Result"
import { Routes, Route } from "react-router-dom";

function App() {
  return (

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/implant" element={<Implant />} />
        <Route path="/Result" element={<Result/>} />
      </Routes>

  );
}

export default App;
