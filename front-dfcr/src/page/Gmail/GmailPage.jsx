import React, { useState, useEffect } from "react";
import GmailLogin from "./GmailLogin"
import EmailDisplay from "./EmailDisplay";

export default function GmailPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifie si l’utilisateur revient de Google OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("gmailLoginSuccess");

    if (success === "true") {
      window.history.replaceState({}, "", window.location.pathname);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <>
      {!isAuthenticated ? (
        <GmailLogin onLoginSuccess={handleLoginSuccess} />
      ) : (
        <EmailDisplay onLogout={handleLogout} />
      )}
    </>
  );
}
