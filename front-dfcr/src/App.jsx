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
import UserSettings from "./page/User/UserSettings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/document" element={<FormDocument />} />
        <Route path="/workflow" element={<Workflow />} />


        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/email" element={<EmailPage />} />
          <Route path="/user-settings" element={<UserSettings />} />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;