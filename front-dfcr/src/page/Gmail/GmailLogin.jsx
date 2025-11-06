import React, { useState, useEffect } from "react";
import { Mail, LogIn, Loader2, AlertCircle } from "lucide-react";

const GmailLogin = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkInitialAuth();
  }, []);

  const checkInitialAuth = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get("gmailLoginSuccess");

      if (success === "true") {
        window.history.replaceState({}, "", window.location.pathname);
        onLoginSuccess(true);
        return;
      }

      const response = await fetch("http://localhost:8080/api/auth/gmail/status", {
        credentials: "include"
      });
      const data = await response.json();

      if (data.authenticated) {
        onLoginSuccess(true);
      }
    } catch (err) {
      console.error("Erreur vérification auth:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/api/auth/gmail/url");
      const data = await response.json();
      window.location.href = data.url;
    } catch (err) {
      setError("Erreur lors de la connexion à Gmail.");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#73839E] to-[#F5ECE3] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#2D466E] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#73839E] to-[#F5ECE3] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#2D466E] to-[#24344D] rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#2D466E] mb-2">Connexion Gmail</h1>
          <p className="text-[#73839E]">Accédez à vos emails</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-[#2D466E] text-white py-4 rounded-lg hover:bg-[#24344D] transition flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
        >
          <LogIn className="w-5 h-5" />
          Se connecter avec Google
        </button>
      </div>
    </div>
  );
};

export default GmailLogin;
