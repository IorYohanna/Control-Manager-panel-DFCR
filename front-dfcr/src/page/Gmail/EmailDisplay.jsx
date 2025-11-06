import React, { useState, useEffect } from 'react';
import { Mail, Clock, Inbox, Loader2, LogOut, AlertCircle } from 'lucide-react';
import { getEmails } from '../../api/Email/email';

// Sous-composants
const SidebarHeader = ({ emailsCount, onLogout, isLoggingOut }) => (
  <div className="p-6 border-b border-[#73839E]">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-[#2D466E] to-[#24344D] rounded-xl flex items-center justify-center">
          <Mail className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-[#2D466E]">Boîte de réception</h1>
      </div>
      <button
        onClick={onLogout}
        disabled={isLoggingOut}
        className="p-2 hover:bg-[#73839E]/10 rounded-lg transition-colors disabled:opacity-50"
        title="Déconnexion"
      >
        {isLoggingOut ? (
          <Loader2 className="w-5 h-5 text-[#73839E] animate-spin" />
        ) : (
          <LogOut className="w-5 h-5 text-[#73839E]" />
        )}
      </button>
    </div>
    <div className="flex items-center gap-2 px-4 py-2 bg-[#2D466E] text-white rounded-lg">
      <Inbox className="w-4 h-4" />
      <span className="text-sm font-medium">{emailsCount} messages</span>
    </div>
  </div>
);

const EmailItem = ({ email, selectedEmail, onSelect, getAvatarColor, getInitials, formatDate }) => {
  const isSelected = selectedEmail?.id === email.id;
  const itemClasses = `p-4 border-b border-[#73839E]/30 cursor-pointer transition-all ${
    isSelected ? 'bg-[#73839E]/20 border-l-4 border-l-[#24344D]' : 'hover:bg-[#73839E]/10'
  }`;

  return (
    <div onClick={() => onSelect(email)} className={itemClasses}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 ${getAvatarColor(email.from)} rounded-full flex items-center justify-center flex-shrink-0`}>
          <span className="text-white text-sm font-semibold">{getInitials(email.from)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-[#2D466E] truncate">{email.from}</span>
            <span className="text-xs text-[#73839E] ml-2 flex-shrink-0">{formatDate(email.date)}</span>
          </div>
          <h3 className="text-sm font-medium text-[#2D466E] mb-1 truncate">{email.subject}</h3>
          <p className="text-xs text-[#73839E] line-clamp-2">{email.snippet}</p>
        </div>
      </div>
    </div>
  );
};

const EmailContent = ({ email, getAvatarColor, getInitials, formatDate }) => {
  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-20 h-20 bg-[#F5ECE3] rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-10 h-10 text-[#73839E]" />
          </div>
          <h3 className="text-lg font-bold text-[#2D466E] mb-2">Aucun email sélectionné</h3>
          <p className="text-[#73839E]">Sélectionnez un email dans la liste pour le lire</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Email Header */}
      <div className="bg-white border-b border-[#73839E]/30 p-8">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 ${getAvatarColor(email.from)} rounded-full flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-semibold">{getInitials(email.from)}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-[#2D466E] mb-2">{email.subject}</h2>
            <div className="flex items-center gap-4 text-sm text-[#73839E] flex-wrap">
              <div>
                <span className="font-medium text-[#2D466E]">{email.from}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDate(email.date)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Body */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-3xl mx-auto p-8">
          <div className="prose prose-gray max-w-none">
            {email.body.split('\n').map((line, i) =>
              line.trim() ? (
                <p key={i} className="text-[#2D466E] leading-relaxed mb-4">{line}</p>
              ) : (
                <div key={i} className="h-2" />
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Composant principal
const EmailDisplay = ({ onLogout }) => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getEmails();
      setEmails(data);
    } catch (err) {
      setError("Erreur lors de la récupération des emails");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch('http://localhost:8080/api/auth/gmail/logout', { method: 'POST' });
      onLogout();
    } catch (err) {
      setError("Erreur lors de la déconnexion");
      setIsLoggingOut(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      if (days === 0) return "Aujourd'hui";
      if (days === 1) return "Hier";
      if (days < 7) return `Il y a ${days} jours`;
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    } catch {
      return dateString;
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = ['bg-[#2D466E]', 'bg-[#24344D]', 'bg-[#73839E]', 'bg-[#5a729b]'];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#73839E] to-[#F5ECE3] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#2D466E] animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-r from-[#73839E] to-[#F5ECE3] p-4">
      <div className="flex h-full rounded-2xl overflow-hidden shadow-[4px_4px_20px_rgba(0,0,0,0.08)]">
        {/* Sidebar */}
        <div className="w-80 bg-[#F5ECE3] border-r-2 border-[#73839E]/20 flex flex-col">
          <SidebarHeader 
            emailsCount={emails.length} 
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
          />
          
          {error && (
            <div className="p-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 text-xl leading-none">
                  ×
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {emails.length === 0 ? (
              <div className="p-8 text-center text-[#73839E]">
                <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Aucun email trouvé</p>
              </div>
            ) : (
              emails.map(email => (
                <EmailItem
                  key={email.id}
                  email={email}
                  selectedEmail={selectedEmail}
                  onSelect={setSelectedEmail}
                  getAvatarColor={getAvatarColor}
                  getInitials={getInitials}
                  formatDate={formatDate}
                />
              ))
            )}
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 flex flex-col">
          <EmailContent
            email={selectedEmail}
            getAvatarColor={getAvatarColor}
            getInitials={getInitials}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailDisplay;