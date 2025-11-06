import React, { useState, useEffect } from 'react';
import { Mail, Inbox, Star, Send, FileText, Trash2, LogOut, RefreshCw, Search, Menu, ChevronLeft, ChevronRight, User } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';

export default function GmailPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState(10);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur revient après OAuth
    const params = new URLSearchParams(window.location.search);
    const loginSuccess = params.get('gmailLoginSuccess');
    
    if (loginSuccess === 'true') {
      setIsAuthenticated(true);
      window.history.replaceState({}, '', '/');
      loadEmails();
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/gmail/url`);
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      alert('Erreur de connexion');
    }
  };

  const loadEmails = async (isInitial = true) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/gmail/messages?maxResults=10`);
      const data = await response.json();
      
      if (isInitial) {
        setEmails(data);
        setDisplayLimit(10);
      }
      
      setHasMore(data.length >= 10);
    } catch (error) {
      console.error('Erreur lors du chargement des emails:', error);
      alert('Erreur lors du chargement des emails');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreEmails = async () => {
    setLoading(true);
    try {
      const currentLength = emails.length;
      const response = await fetch(`${API_BASE_URL}/gmail/messages?maxResults=${currentLength + 10}`);
      const data = await response.json();
      
      // Ajouter seulement les nouveaux emails (ceux qui ne sont pas déjà dans la liste)
      const existingIds = new Set(emails.map(e => e.id));
      const newEmails = data.filter(email => !existingIds.has(email.id));
      
      setEmails(prevEmails => [...prevEmails, ...newEmails]);
      setDisplayLimit(prev => prev + 10);
      setHasMore(data.length >= currentLength + 10);
    } catch (error) {
      console.error('Erreur lors du chargement de plus d\'emails:', error);
      alert('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmails([]);
    setSelectedEmail(null);
    // Optionnel: appeler un endpoint backend pour supprimer les tokens
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (days < 7) {
      return date.toLocaleDateString('fr-FR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    }
  };

  const extractSenderName = (from) => {
    if (!from) return 'Inconnu';
    const match = from.match(/^"?([^"<]+)"?\s*<?/);
    return match ? match[1].trim() : from.split('<')[0].trim();
  };

  const getEmailBody = (body) => {
    if (!body) return '';
    // Nettoyer le HTML basique
    return body.replace(/<[^>]*>/g, '').substring(0, 500);
  };

  const filteredEmails = emails.filter(email => 
    email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.snippet?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedEmails = filteredEmails;
  const canLoadMore = hasMore;

  // Page de connexion
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Gmail Clone</h1>
            <p className="text-gray-600">Connectez-vous avec votre compte Google</p>
          </div>
          
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Se connecter avec Google
          </button>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Accédez à vos emails Gmail en toute sécurité</p>
          </div>
        </div>
      </div>
    );
  }

  // Interface Gmail
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-full">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-medium text-gray-700">Gmail</span>
          </div>
        </div>
        
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans les e-mails"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={loadEmails} className="p-2 hover:bg-gray-100 rounded-full" title="Actualiser">
            <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-2xl font-medium hover:bg-blue-700 transition mb-4 shadow-md">
              + Nouveau message
            </button>
            
            <nav className="space-y-1">
              <a href="#" className="flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-600 rounded-r-full font-medium">
                <Inbox className="w-5 h-5" />
                <span>Boîte de réception</span>
                <span className="ml-auto text-sm">{emails.length}</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-r-full">
                <Star className="w-5 h-5" />
                <span>Suivis</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-r-full">
                <Send className="w-5 h-5" />
                <span>Envoyés</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-r-full">
                <FileText className="w-5 h-5" />
                <span>Brouillons</span>
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-r-full">
                <Trash2 className="w-5 h-5" />
                <span>Corbeille</span>
              </a>
            </nav>
          </aside>
        )}

        {/* Liste des emails */}
        <main className="flex-1 flex overflow-hidden">
          <div className={`${selectedEmail ? 'w-1/3' : 'w-full'} border-r border-gray-200 bg-white overflow-y-auto`}>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Mail className="w-16 h-16 mb-4 text-gray-300" />
                <p className="text-lg">Aucun e-mail</p>
              </div>
            ) : (
              <div>
                {displayedEmails.map((email) => (
                  <div
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:shadow-md transition ${
                      selectedEmail?.id === email.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {extractSenderName(email.from).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-gray-900 truncate">
                              {extractSenderName(email.from)}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              {formatDate(email.date)}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-800 truncate mb-1">
                            {email.subject || '(Aucun objet)'}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {email.snippet}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {canLoadMore && (
                  <div className="p-4 text-center border-t border-gray-100">
                    <button
                      onClick={loadMoreEmails}
                      disabled={loading}
                      className="px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Chargement...
                        </span>
                      ) : (
                        'Voir plus (+10 emails)'
                      )}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      {emails.length} email{emails.length > 1 ? 's' : ''} chargé{emails.length > 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Détail de l'email */}
          {selectedEmail && (
            <div className="flex-1 bg-white overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex-1">
                    {selectedEmail.subject || '(Aucun objet)'}
                  </h2>
                  <button
                    onClick={() => setSelectedEmail(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {extractSenderName(selectedEmail.from).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {extractSenderName(selectedEmail.from)}
                        </p>
                        <p className="text-sm text-gray-600">{selectedEmail.from}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(selectedEmail.date)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <div className="text-gray-800 whitespace-pre-wrap">
                    {getEmailBody(selectedEmail.body) || selectedEmail.snippet}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}