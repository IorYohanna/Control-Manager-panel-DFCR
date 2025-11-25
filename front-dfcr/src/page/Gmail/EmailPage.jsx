import React, { useState, useEffect } from 'react';
import EmailLogin from '../../components/Gmail/EmailLogin';
import EmailHeader from '../../components/Gmail/List/EmailHeader'; 
import EmailList from '../../components/Gmail/List/EmailList';  
import EmailViewer from '../../components/Gmail/List/EmailViewer';

import * as GmailAPI from '../../api/Email/gmail'
import { Mail } from 'lucide-react';

export default function GmailPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState(10);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    async function init() {
      const result = await GmailAPI.checkAuth();

      if (!result.authenticated) {
        localStorage.removeItem("gmail_auth");
        setIsAuthenticated(false);
        return;
      }

      // Si oui
      localStorage.setItem("gmail_auth", "true");
      setIsAuthenticated(true);
      await loadEmails();
    }

    init();
}, []);

  // ============ Gestion du Login avec Popup ============
  const handleLogin = async () => {
    try {
      const data = await GmailAPI.getLoginUrl();

      const width = 600;
      const height = 700;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      // ✅ Crée d'abord le listener
      const handleMessage = async (event) => {
        if (event.origin !== window.location.origin) return;
        if (event.data.type === 'gmail-auth-success') {
          window.removeEventListener('message', handleMessage);
          const authData = await GmailAPI.checkAuth();
          if (authData.authenticated) {
            setIsAuthenticated(true);
            await loadEmails();
          }
          localStorage.getItem("gmail_auth", "true")
        }
      };

      window.addEventListener('message', handleMessage);

      // Puis ouvre la popup
      const popup = window.open(
        data.url,
        'GmailOAuth',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
      );

      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        window.removeEventListener('message', handleMessage);
        alert('Veuillez autoriser les popups pour vous connecter à Gmail');
        return;
      }

      // Timeout de sécurité pour fermer la popup au cas où
      const popupChecker = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(popupChecker);
          window.removeEventListener('message', handleMessage);
        }
      }, 500);

    } catch (error) {
      console.error('Erreur de connexion:', error);
      alert('Erreur de connexion à Gmail');
    }
  };


  const loadEmails = async (isInitial = true) => {
    setLoading(true);
    try {
      const data = await GmailAPI.fetchEmails(displayLimit);
      if (isInitial) setEmails(data);
      setHasMore(data.length >= displayLimit);
    } catch {
      alert('Erreur lors du chargement des emails');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreEmails = async () => {
    setLoading(true);
    try {
      const currentLength = emails.length;
      const data = await GmailAPI.fetchEmails(currentLength + 10);

      const existingIds = new Set(emails.map(e => e.id));
      const newEmails = data.filter(e => !existingIds.has(e.id));

      setEmails(prev => [...prev, ...newEmails]);
      setDisplayLimit(prev => prev + 10);
      setHasMore(data.length >= currentLength + 10);
    } catch {
      alert('Erreur lors du chargement de plus d\'emails');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await GmailAPI.logout();
      setIsAuthenticated(false);
      setEmails([]);
      setSelectedEmail(null);
    } finally {
      setLogoutLoading(false);
    }
  };

  const filteredEmails = emails.filter(email =>
    email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.snippet?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) return <EmailLogin handleLogin={handleLogin} />;

  return (
    <div className="flex-1 min-h-screen flex flex-col p-4 md:p-6 w-[75%]">
      <EmailHeader
        loading={loading}
        logoutLoading={logoutLoading}
        loadEmails={loadEmails}
        handleLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        displayLimit={displayLimit}
      />

      <div className="flex flex-1 overflow-hidden bg-[#f5ece3] rounded-bl-2xl rounded-br-2xl">

        {/* LISTE DES EMAILS */}
        <div className={`transition-all duration-300
            ${selectedEmail ? "hidden sm:hidden md:flex md:w-1/3" : "flex w-full md:w-1/3"}`}>
          <EmailList
            emails={filteredEmails}
            loading={loading}
            selectedEmail={selectedEmail}
            setSelectedEmail={setSelectedEmail}
            loadMoreEmails={loadMoreEmails}
            hasMore={hasMore}
            extractSenderName={GmailAPI.extractSenderName}
            formatDate={GmailAPI.formatDate}
          />
        </div>

        {/* VIEWER OU PLACEHOLDER */}
        <div className={`flex-1 transition-all duration-300
            ${selectedEmail ? "w-full md:flex" : "hidden md:flex"}`}>
          {selectedEmail ? (
            <EmailViewer
              email={selectedEmail}
              extractSenderName={GmailAPI.extractSenderName}
              formatDate={GmailAPI.formatDate}
              getEmailBody={GmailAPI.getEmailBody}
              close={() => setSelectedEmail(null)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gray-200 rounded-tr-2xl rounded-br-2xl">
              <Mail className="w-16 h-16 mb-4 text-gray-800" />
              <h2 className="text-xl mb-1 text-gray-800 font-necoMedium">Sélectionnez un email</h2>
              <p className="text-md text-gray-600 font-eirene">
                Cliquez sur un email dans la liste à gauche pour voir son contenu.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}