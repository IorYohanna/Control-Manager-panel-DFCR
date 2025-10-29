import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./page/Auth/Signup";
import Login from "./page/Auth/Login";
import Verify from "./page/Auth/Verify";
import FormDocument from "./page/Docs/FormDocument";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/document" element={<FormDocument />} />

        <Route>
          <Route/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
