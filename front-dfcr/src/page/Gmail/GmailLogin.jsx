import React, { useState, useEffect } from 'react';
import { Mail, LogIn, Loader2, AlertCircle } from 'lucide-react';

const GmailLogin = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkInitialAuth();
  }, []);

  const checkInitialAuth = async () => {
    try {
      // Vérifier si on revient de l'OAuth Google
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('gmailLoginSuccess');

      if (success === 'true') {
        // Nettoyer l'URL
        window.history.replaceState({}, '', window.location.pathname);
        onLoginSuccess(true);
        return;
      }

      // Sinon, vérifier le statut d'authentification
      const response = await fetch('http://localhost:8080/api/auth/gmail/status');
      const data = await response.json();
      
      if (data.authenticated) {
        onLoginSuccess(true);
      }
    } catch (err) {
      console.error("Erreur vérification auth:", err);
      // Ne pas afficher d'erreur si pas encore connecté
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/auth/gmail/url');
      const data = await response.json();
      window.location.href = data.url;
    } catch (err) {
      setError("Erreur lors de la connexion à Gmail. Veuillez réessayer.");
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
          <p className="text-[#73839E]">Connectez-vous pour accéder à vos emails</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 text-xl leading-none">
              ×
            </button>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-[#2D466E] text-white py-4 rounded-lg hover:bg-[#24344D] transition-all font-medium flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Connexion...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Se connecter avec Google
            </>
          )}
        </button>

        <p className="mt-6 text-center text-xs text-[#73839E]">
          Autorise l'application à accéder à vos emails en lecture seule
        </p>
      </div>
    </div>
  );
};

export default GmailLogin;