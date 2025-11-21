import { useState } from 'react';
import { Send, Users, Briefcase, Building2, Globe } from 'lucide-react';

export default function AdminNotificationSender() {
  const [mode, setMode] = useState('specific'); // specific, fonction, service, broadcast
  const [userIds, setUserIds] = useState('');
  const [fonction, setFonction] = useState('');
  const [idService, setIdService] = useState('');
  const [type, setType] = useState('INFO');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const sendNotification = async () => {
    setLoading(true);
    setResult(null);
    
    const token = localStorage.getItem("token");
    
    let endpoint = '';
    let body = { type, message };
    
    switch (mode) {
      case 'specific':
        endpoint = '/notifications/send';
        body.userIds = userIds.split(',').map(id => id.trim()).filter(Boolean);
        break;
      case 'fonction':
        endpoint = '/notifications/send-to-fonction';
        body.fonction = fonction;
        break;
      case 'service':
        endpoint = '/notifications/send-to-service';
        body.idService = idService;
        break;
      case 'broadcast':
        endpoint = '/notifications/broadcast';
        break;
      default:
        return;
    }
    
    try {
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        const text = await response.text();
        setResult({ success: true, message: text });
        // Réinitialiser le formulaire
        setUserIds('');
        setMessage('');
      } else {
        const error = await response.text();
        setResult({ success: false, message: error });
      }
    } catch (error) {
      setResult({ success: false, message: 'Erreur de connexion' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Send className="w-6 h-6 text-blue-600" />
            Envoyer une notification
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Envoyez des notifications à un ou plusieurs utilisateurs
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Mode de ciblage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Destinataires
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('specific')}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  mode === 'specific'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Utilisateurs spécifiques</span>
              </button>
              
              <button
                onClick={() => setMode('fonction')}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  mode === 'fonction'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                <span className="font-medium">Par fonction</span>
              </button>
              
              <button
                onClick={() => setMode('service')}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  mode === 'service'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span className="font-medium">Par service</span>
              </button>
              
              <button
                onClick={() => setMode('broadcast')}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  mode === 'broadcast'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Globe className="w-5 h-5" />
                <span className="font-medium">Tous les utilisateurs</span>
              </button>
            </div>
          </div>

          {/* Champs conditionnels */}
          {mode === 'specific' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matricules (séparés par des virgules)
              </label>
              <input
                type="text"
                value={userIds}
                onChange={(e) => setUserIds(e.target.value)}
                placeholder="EMP001, EMP002, EMP003"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Exemple : EMP001, EMP002, EMP003
              </p>
            </div>
          )}

          {mode === 'fonction' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fonction
              </label>
              <select
                value={fonction}
                onChange={(e) => setFonction(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner une fonction</option>
                <option value="Directeur">Directeur</option>
                <option value="Chef de service">Chef de service</option>
                <option value="Employé">Employé</option>
              </select>
            </div>
          )}

          {mode === 'service' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Service
              </label>
              <input
                type="text"
                value={idService}
                onChange={(e) => setIdService(e.target.value)}
                placeholder="SRV001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Type de notification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de notification
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="INFO">Information</option>
              <option value="ASSIGNATION">Assignation</option>
              <option value="TASK_COMPLETED">Tâche complétée</option>
              <option value="MEETING_SCHEDULED">Réunion programmée</option>
              <option value="DOCUMENT_VALIDE">Document validé</option>
              <option value="SYSTEM_MAINTENANCE">Maintenance système</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre message..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Résultat */}
          {result && (
            <div
              className={`p-4 rounded-lg ${
                result.success
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {result.message}
            </div>
          )}

          {/* Bouton d'envoi */}
          <button
            onClick={sendNotification}
            disabled={loading || !message.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Envoyer la notification
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}