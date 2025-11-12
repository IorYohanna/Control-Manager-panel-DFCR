import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./page/Auth/Signup";
import Login from "./page/Auth/Login";
import Verify from "./page/Auth/Verify";
import FormDocument from "./page/Docs/FormDocument";
import MainLayout from "./layout/mainLayout";
import HomePage from "./page/Event/HomePage";
import UserSettings from "./page/User/UserSettings";
import GoogleDriveViewer from "./page/Docs/GoogleDriveViewer";
import { GoogleOAuthProvider } from "@react-oauth/google";
import EmailPage from "./page/Gmail/EmailPage";
import Dashboard from "./page/DashBoard/Dashboard";
import WorkflowManagement from "./page/workflow/Workflow";
import Historique from "./page/Docs/Historique";
import Chat from "./page/Chat/Chat";

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            ⚠️ Configuration manquante
          </h1>
          <p className="text-gray-700">
            Le Client ID Google n'est pas configuré.<br />
            Créez un fichier <code className="bg-gray-100 px-2 py-1 rounded">.env</code> avec :
          </p>
          <pre className="mt-4 bg-gray-100 p-4 rounded text-left text-sm">
            VITE_GOOGLE_CLIENT_ID=votre_client_id.apps.googleusercontent.com
          </pre>
        </div>
      </div>
    );
  }

  return (
    < >
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/document" element={<FormDocument />} />
          <Route path="/historique" element={<Historique/>} />
          <Route path="/chat" element={<Chat/>}/>
        


          <Route path="/home" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/home/user-settings" element={<UserSettings />} />
            <Route path="/home/online-drive" element={<GoogleOAuthProvider clientId={clientId} >
              <GoogleDriveViewer />
            </GoogleOAuthProvider>
            } />
            <Route path="/home/drive" element={<GoogleDriveViewer />} />
            <Route path="/home/email" element={<EmailPage/>} />
            <Route path="/home/dashboard" element={<Dashboard/>} />
            <Route path="/home/workflow" element={<WorkflowManagement/>} />
            <Route path="/home/chat" element={<Chat/>} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;