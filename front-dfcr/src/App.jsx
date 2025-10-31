import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./page/Auth/Signup";
import Login from "./page/Auth/Login";
import Verify from "./page/Auth/Verify";
import FormDocument from "./page/Docs/FormDocument";
import Workflow from "./page/workflow/Workflow";
import SideBar from "./layout/SideBar";
import MainLayout from "./layout/mainLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/document" element={<FormDocument />} />
        <Route path="/workflow" element={<Workflow />} />
        <Route path="/mainlayout" element={<MainLayout />} />


        <Route>
          <Route />
        </Route> 
      </Routes>
    </Router>
  );
}

export default App;