import React, { useEffect } from 'react';

export default function GmailCallback() {
  useEffect(() => {
    // Ferme automatiquement la popup après le callback OAuth
    if (window.opener) {
      // Notifie la fenêtre parente que l'authentification est réussie
      window.opener.postMessage({ type: 'gmail-auth-success' }, window.location.origin);
      window.close();
    } else {
      // Si ce n'est pas une popup (cas rare), redirige vers la page email
      window.location.href = '/home/email';
    }
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <p>Authentification réussie...</p>
        <p style={{ fontSize: '14px', color: '#666' }}>Cette fenêtre va se fermer automatiquement.</p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}