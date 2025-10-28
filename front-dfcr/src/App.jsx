import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./page/Auth/Signup";
import Login from "./page/Auth/Login";
import Verify from "./page/Auth/Verify";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </Router>
  );
}

export default App;
