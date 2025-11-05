import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./page/Auth/Signup";
import Login from "./page/Auth/Login";
import Verify from "./page/Auth/Verify";
import FormDocument from "./page/Docs/FormDocument";
import Workflow from "./page/workflow/Workflow";
import MainLayout from "./layout/mainLayout";
import Calendar from "./page/Event/Calendar";
import HomePage from "./page/Event/HomePage";
import EmailPage from "./page/Gmail/EmailPage";

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

        <Route path="/calendar" element={<Calendar />} />

        <Route path="/home" element={<MainLayout/>}>
          <Route index element={<HomePage/>}/>
          <Route path="/home/email" element={<EmailPage/>} />
        </Route> 
      </Routes>
    </Router>
  );
}

export default App;