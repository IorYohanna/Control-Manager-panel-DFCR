import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Signup from "./page/Auth/Signup";
import Login from "./page/Auth/Login";
import Verify from "./page/Auth/Verify";
import FormDocument from "./page/Docs/FormDocument";
import MainLayout from "./layout/mainLayout";
import HomePage from "./page/Event/HomePage";
import UserSettings from "./page/User/UserSettings";
import GoogleDriveViewer from "./page/Docs/GoogleDriveViewer";
import EmailPage from "./page/Gmail/EmailPage";
import Dashboard from "./page/DashBoard/Dashboard";
import WorkflowManagement from "./page/workflow/Workflow";
import Historique from "./page/Docs/Historique";
import Chat from "./page/Chat/Chat";
import DossierDetails from "./page/Dossier/DossierDetails";
import DossierManagement from "./page/Dossier/Dossier";

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
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/document" element={<FormDocument />} />
          <Route path="/historique" element={<Historique />} />
          <Route path="/chat" element={<Chat />} />

          <Route path="/home" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="user-settings" element={<UserSettings />} />
            <Route path="online-drive" element={<GoogleDriveViewer />} />
            <Route path="email" element={<EmailPage />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="workflow" element={<WorkflowManagement />} />
            <Route path="chat" element={<Chat />} />
            <Route path="dossier" element={<DossierManagement />} />
            <Route path="dossiers/:id" element={<DossierDetails />} />
          </Route>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
