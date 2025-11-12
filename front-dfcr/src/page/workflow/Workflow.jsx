import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, XCircle, Clock, FileText, Users, User, ArrowRight, History, AlertCircle, Filter, Search } from 'lucide-react';

// Configuration API
const API_BASE_URL = 'http://localhost:8080';

// Utilitaires API
const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

// Fonction helper pour parser les réponses JSON de manière sécurisée
const safeJsonParse = async (response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('Erreur parsing JSON:', text.substring(0, 200));
    throw new Error('Réponse invalide du serveur', err);
  }
};

// Services API
const workflowAPI = {
  sendToService: (data) =>
    fetch(`${API_BASE_URL}/workflow/send-to-service`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data)
    }),

  assignToEmploye: (data) =>
    fetch(`${API_BASE_URL}/workflow/assign-to-employe`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data)
    }),

  startWork: (data) =>
    fetch(`${API_BASE_URL}/workflow/start-work`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data)
    }),

  finishWork: (data) =>
    fetch(`${API_BASE_URL}/workflow/finish-work`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data)
    }),

  chefValidate: (data) =>
    fetch(`${API_BASE_URL}/workflow/chef-validate`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data)
    }),

  chefReject: (data) =>
    fetch(`${API_BASE_URL}/workflow/chef-reject`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data)
    }),

  directeurValidate: (data) =>
    fetch(`${API_BASE_URL}/workflow/directeur-validate`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data)
    }),

  directeurReject: (data) =>
    fetch(`${API_BASE_URL}/workflow/directeur-reject`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data)
    }),

  getHistory: (reference) =>
    fetch(`${API_BASE_URL}/workflow/history/${reference}`, {
      method: 'GET',
      headers: getAuthHeader()
    })
};

const documentAPI = {
  getAll: () =>
    fetch(`${API_BASE_URL}/documents`, {
      method: 'GET',
      headers: getAuthHeader()
    }),

  getByReference: (reference) =>
    fetch(`${API_BASE_URL}/documents/${reference}`, {
      method: 'GET',
      headers: getAuthHeader()
    }),

  search: (keyword) =>
    fetch(`${API_BASE_URL}/documents/search?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET',
      headers: getAuthHeader()
    })
};

// Composant principal
const WorkflowManagement = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [serviceUsers, setServiceUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('documents');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [error, setError] = useState(null);

  // Chargement initial
  useEffect(() => {
    loadUserProfile();
    loadDocuments();
  }, []);

  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Non authentifié');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/current-user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await safeJsonParse(res);
        setCurrentUser(data);

        // Charger les utilisateurs du service si disponible
        if (data.serviceName) {
          loadServiceUsers(data.serviceName);
        }
      } else {
        setError('Erreur de chargement du profil');
      }
    } catch (err) {
      console.error('Erreur chargement profil:', err);
      setError(err.message);
    }
  };

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await documentAPI.getAll();

      if (res.ok) {
        const data = await safeJsonParse(res);

        // Nettoyer les données pour éviter les références circulaires
        const cleanDocuments = Array.isArray(data) ? data.map(doc => ({
          reference: doc.reference || '',
          objet: doc.objet || '',
          corps: doc.corps || '',
          type: doc.type || '',
          status: doc.status || '',
          creatorMatricule: doc.creatorMatricule || doc.creator?.matricule || '',
          creatorName: doc.creatorName || doc.creator?.username || '',
          creatorUsername: doc.creatorUsername || doc.creator?.name || ''
        })) : [];

        setDocuments(cleanDocuments);
      } else {
        setError('Erreur de chargement des documents');
      }
    } catch (err) {
      console.error('Erreur chargement documents:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadServiceUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/current-user/service/info`, {
        headers: getAuthHeader()
      });

      if (res.ok) {
        const data = await safeJsonParse(res);
        setServiceUsers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadDocuments();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await documentAPI.search(searchTerm);

      if (res.ok) {
        const data = await safeJsonParse(res);
        const cleanDocuments = Array.isArray(data) ? data.map(doc => ({
          reference: doc.reference || '',
          objet: doc.objet || '',
          corps: doc.corps || '',
          type: doc.type || '',
          status: doc.status || '',
          creatorMatricule: doc.creatorMatricule || doc.creator?.matricule || '',
          creatorName: doc.creatorName || doc.creator?.username || '',
          creatorUsername: doc.creatorUsername || doc.creator?.name || ''
        })) : [];

        setDocuments(cleanDocuments);
      }
    } catch (err) {
      console.error('Erreur recherche:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    if (filterStatus === 'all') return true;
    return doc.status === filterStatus;
  });

  // Fonction pour déterminer les actions disponibles selon le rôle
  const getAvailableActions = () => {
    if (!currentUser || !selectedDocument) return [];

    const fonction = (currentUser.fonction || '').toLowerCase().trim();
    const status = (selectedDocument.status || '').toLowerCase().trim();

    console.log('Fonction:', fonction, 'Status:', status); // Debug

    // Directeur
    if (fonction.includes('directeur') || fonction.includes('director')) {
      if (status === 'en_attente' || status === 'nouveau' || status === 'enattente') {
        return ['send-to-service'];
      }
      if (status === 'validation_directeur' || status === 'validationdirecteur') {
        return ['directeur-validate', 'directeur-reject'];
      }
    }

    // Chef de service
    if (fonction.includes('chef') || fonction.includes('manager')) {
      if (status === 'au_service' || status === 'auservice' || status === 'recu_service') {
        return ['assign-to-employe'];
      }
      if (status === 'termine' || status === 'fini' || status === 'complete') {
        return ['chef-validate', 'chef-reject'];
      }
    }

    // Employé
    if (fonction.includes('employe') || fonction.includes('employé') || fonction.includes('employee')) {
      if (status === 'assigne' || status === 'assigné' || status === 'assigned') {
        return ['start-work'];
      }
      if (status === 'en_traitement' || status === 'entraitement' || status === 'traitement' || status === 'in_progress') {
        return ['finish-work'];
      }
    }

    return [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FileText className="text-blue-600" size={32} />
                Gestion des Workflows
              </h1>
              <p className="text-gray-600 mt-2">
                Gérez le cycle de vie de vos documents
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  loadUserProfile();
                  loadDocuments();
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
                title="Rafraîchir les données"
              >
                🔄 Actualiser
              </button>
              {currentUser && (
                <div className="text-right bg-blue-50 px-4 py-3 rounded-lg">
                  <div className="text-xs text-gray-500">Connecté en tant que</div>
                  <div className="font-semibold text-gray-800">{currentUser.username}</div>
                  <div className="text-sm text-blue-600 font-medium">{currentUser.fonction}</div>
                  {currentUser.service && (
                    <div className="text-xs text-gray-500 mt-1">
                      Service: {currentUser.service.serviceName || currentUser.service.serviceId}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message d'erreur global */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'documents'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
          >
            <FileText className="inline mr-2" size={18} />
            Documents
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'workflow'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            disabled={!selectedDocument}
          >
            <ArrowRight className="inline mr-2" size={18} />
            Actions Workflow
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            disabled={!selectedDocument}
          >
            <History className="inline mr-2" size={18} />
            Historique
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des documents */}
          <div className="lg:col-span-1">
            <DocumentList
              documents={filteredDocuments}
              selectedDocument={selectedDocument}
              onSelectDocument={setSelectedDocument}
              loading={loading}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearch={handleSearch}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-2">
            {activeTab === 'documents' && (
              <DocumentDetails document={selectedDocument} />
            )}
            {activeTab === 'workflow' && (
              <WorkflowActions
                document={selectedDocument}
                currentUser={currentUser}
                serviceUsers={serviceUsers}
                availableActions={getAvailableActions()}
                onActionComplete={loadDocuments}
              />
            )}
            {activeTab === 'history' && (
              <WorkflowHistory document={selectedDocument} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Liste des documents
const DocumentList = ({ documents, selectedDocument, onSelectDocument, loading, searchTerm, setSearchTerm, onSearch, filterStatus, setFilterStatus }) => {
  const statusColors = {
    'nouveau': 'bg-blue-100 text-blue-800',
    'en_attente': 'bg-yellow-100 text-yellow-800',
    'au_service': 'bg-purple-100 text-purple-800',
    'assigne': 'bg-indigo-100 text-indigo-800',
    'en_traitement': 'bg-orange-100 text-orange-800',
    'termine': 'bg-green-100 text-green-800',
    'complet' : 'bg-pink-100 text-pink-800',
    'validation_directeur': 'bg-teal-100 text-teal-800',
    'refuse': 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Documents</h2>

      {/* Recherche */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            placeholder="Rechercher..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={onSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Filtre */}
      <div className="mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tous les statuts</option>
          <option value="nouveau">Nouveau</option>
          <option value="en_attente">En attente</option>
          <option value="au_service">Au service</option>
          <option value="assigne">Assigné</option>
          <option value="en_traitement">En traitement</option>
          <option value="termine">Terminé</option>
          <option value="complet">Complet</option>
        </select>
      </div>

      {/* Liste */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">Chargement...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 text-gray-300" />
            Aucun document trouvé
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.reference}
              onClick={() => onSelectDocument(doc)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedDocument?.reference === doc.reference
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
            >
              <div className="font-semibold text-gray-800 mb-1">{doc.reference}</div>
              <div className="text-sm text-gray-600 mb-2 truncate">{doc.objet}</div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[doc.status] || 'bg-gray-100 text-gray-800'}`}>
                {doc.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Composant Détails du document
const DocumentDetails = ({ document }) => {
  if (!document) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <FileText size={64} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Sélectionnez un document pour voir les détails</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Détails du Document</h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-600">Référence</label>
          <div className="text-lg text-gray-800 mt-1">{document.reference}</div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600">Objet</label>
          <div className="text-lg text-gray-800 mt-1">{document.objet}</div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600">Corps</label>
          <div className="text-gray-700 mt-1 p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
            {document.corps}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">Type</label>
            <div className="text-gray-800 mt-1">{document.type}</div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">Statut</label>
            <div className="text-gray-800 mt-1">{document.status}</div>
          </div>
        </div>

        {document.creatorMatricule && (
          <div>
            <label className="text-sm font-semibold text-gray-600">Créateur</label>
            <div className="text-gray-800 mt-1">
              {document.creatorName} ({document.creatorMatricule})
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant Actions Workflow
const WorkflowActions = ({ document, currentUser, serviceUsers, availableActions, onActionComplete }) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  if (!document) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <AlertCircle size={64} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Sélectionnez un document pour effectuer des actions</p>
      </div>
    );
  }

  const handleActionSubmit = async () => {
    if (!selectedAction) return;

    setLoading(true);
    setMessage(null);

    try {
      let payload = {
        reference: document.reference,
        ...formData
      };

      let response;

      switch (selectedAction) {
        case 'send-to-service':
          payload.directeurMatricule = currentUser.matricule;
          response = await workflowAPI.sendToService(payload);
          break;
        case 'assign-to-employe':
          payload.chefMatricule = currentUser.matricule;
          response = await workflowAPI.assignToEmploye(payload);
          break;
        case 'start-work':
          payload.employeMatricule = currentUser.matricule;
          response = await workflowAPI.startWork(payload);
          break;
        case 'finish-work':
          payload.employeMatricule = currentUser.matricule;
          response = await workflowAPI.finishWork(payload);
          break;
        case 'chef-validate':
          payload.chefMatricule = currentUser.matricule;
          response = await workflowAPI.chefValidate(payload);
          break;
        case 'chef-reject':
          payload.chefMatricule = currentUser.matricule;
          response = await workflowAPI.chefReject(payload);
          break;
        case 'directeur-validate':
          payload.directeurMatricule = currentUser.matricule;
          response = await workflowAPI.directeurValidate(payload);
          break;
        case 'directeur-reject':
          payload.directeurMatricule = currentUser.matricule;
          response = await workflowAPI.directeurReject(payload);
          break;
        default:
          throw new Error('Action non reconnue');
      }

      if (response.ok) {
        const data = await safeJsonParse(response);
        setMessage({ type: 'success', text: data.message || 'Action effectuée avec succès' });
        setFormData({});
        setSelectedAction('');
        setTimeout(() => onActionComplete(), 1500);
      } else {
        const errorText = await response.text();
        setMessage({ type: 'error', text: errorText || 'Erreur lors de l\'action' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const actionLabels = {
    'send-to-service': 'Envoyer au Service',
    'assign-to-employe': 'Assigner à un Employé',
    'start-work': 'Commencer le Traitement',
    'finish-work': 'Terminer le Traitement',
    'chef-validate': 'Valider le Document',
    'chef-reject': 'Refuser le Document',
    'directeur-validate': 'Valider Complet',
    'directeur-reject': 'Refuser (Incomplet)'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Actions Workflow</h2>

      {availableActions.length === 0 ? (
        <div className="text-center py-8">
          <Clock size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Aucune action disponible pour ce document</p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left max-w-md mx-auto">
            <p className="text-sm text-gray-600 mb-2"><strong>Informations de debug:</strong></p>
            <p className="text-xs text-gray-500">• Votre rôle: <span className="font-semibold">{currentUser?.fonction || 'Non défini'}</span></p>
            <p className="text-xs text-gray-500">• Statut du document: <span className="font-semibold">{document.status || 'Non défini'}</span></p>
            <p className="text-xs text-gray-500 mt-2">• Matricule: {currentUser?.matricule}</p>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-600 mb-1">Actions selon le rôle:</p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• <strong>Directeur:</strong> nouveau/en_attente → Envoyer au service</li>
                <li>• <strong>Chef:</strong> au_service → Assigner | termine → Valider/Refuser</li>
                <li>• <strong>Employé:</strong> assigne → Commencer | en_traitement → Terminer</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Sélection action */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Choisir une action
            </label>
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setFormData({});
                setMessage(null);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Sélectionner --</option>
              {availableActions.map(action => (
                <option key={action} value={action}>{actionLabels[action]}</option>
              ))}
            </select>
          </div>

          {/* Formulaire selon l'action */}
          {selectedAction && (
            <ActionForm
              action={selectedAction}
              formData={formData}
              setFormData={setFormData}
              currentUser={currentUser}
              serviceUsers={serviceUsers}
            />
          )}

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
              {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
              {message.text}
            </div>
          )}

          {/* Bouton submit */}
          {selectedAction && (
            <button
              onClick={handleActionSubmit}
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Traitement...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Exécuter l'action
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Composant Formulaire d'action
const ActionForm = ({ action, formData, setFormData, currentUser, serviceUsers }) => {
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const needsServiceSelection = ['send-to-service', 'directeur-reject'].includes(action);
  const needsEmployeSelection = ['assign-to-employe', 'chef-reject'].includes(action);
  const needsChefSelection = ['finish-work'].includes(action);
  const needsDirecteurSelection = ['chef-validate'].includes(action);
  const needsRemarque = !['start-work'].includes(action);
  const needsTypeWorkflow = ['send-to-service'].includes(action);
  const needsDirecteurValidation = ['directeur-validate'].includes(action); 
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-700">Paramètres de l'action</h3>

      {needsServiceSelection && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            ID du Service <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.serviceId || ''}
            onChange={(e) => updateField('serviceId', e.target.value)}
            placeholder="Entrez l'ID du service"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {currentUser?.service?.idService && `Votre service: ${currentUser.service.idService}`}
          </p>
        </div>
      )}

      {needsEmployeSelection && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Employé <span className="text-red-500">*</span>
          </label>
          {serviceUsers.length > 0 ? (
            <select
              value={formData.employeMatricule || ''}
              onChange={(e) => updateField('employeMatricule', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Sélectionner un employé --</option>
              {serviceUsers
                .filter(u => u.fonction?.toLowerCase().includes('employe'))
                .map(user => (
                  <option key={user.matricule} value={user.matricule}>
                    {user.username} - {user.matricule}
                  </option>
                ))}
            </select>
          ) : (
            <input
              type="text"
              value={formData.employeMatricule || ''}
              onChange={(e) => updateField('employeMatricule', e.target.value)}
              placeholder="Matricule de l'employé"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          )}
        </div>
      )}

      {needsChefSelection && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Chef de Service <span className="text-red-500">*</span>
          </label>
          {serviceUsers.length > 0 ? (
            <select
              value={formData.chefMatricule || ''}
              onChange={(e) => updateField('chefMatricule', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">-- Sélectionner un chef --</option>
              {serviceUsers
                .filter(u => u.fonction?.toLowerCase().includes('chef'))
                .map(user => (
                  <option key={user.matricule} value={user.matricule}>
                    {user.username} - {user.matricule}
                  </option>
                ))}
            </select>
          ) : (
            <input
              type="text"
              value={formData.chefMatricule || ''}
              onChange={(e) => updateField('chefMatricule', e.target.value)}
              placeholder="Matricule du chef"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          )}
        </div>
      )}

      {needsDirecteurSelection && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Directeur <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.directeurMatricule || ''}
            onChange={(e) => updateField('directeurMatricule', e.target.value)}
            placeholder="Matricule du directeur"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      )}

      {needsTypeWorkflow && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Type de Workflow <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.typeWorkflow || ''}
            onChange={(e) => updateField('typeWorkflow', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Sélectionner --</option>
            <option value="NORMAL">Normal</option>
            <option value="URGENT">Urgent</option>
            <option value="PRIORITAIRE">Prioritaire</option>
          </select>
        </div>
      )}

      {/* ✅ Nouvelle section pour validation du directeur */}
      {needsDirecteurValidation && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Décision du Directeur <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.decision || ''}
            onChange={(e) => updateField('decision', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">-- Choisir une décision --</option>
            <option value="APPROUVE">Approuver le document</option>
            <option value="REJETE">Rejeter le document</option>
          </select>
        </div>
      )}

      {needsRemarque && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Remarque {needsRemarque && <span className="text-gray-400">(optionnel)</span>}
          </label>
          <textarea
            value={formData.remarque || ''}
            onChange={(e) => updateField('remarque', e.target.value)}
            placeholder="Ajouter une remarque ou des instructions..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      )}
    </div>
  );
};


// Composant Historique
const WorkflowHistory = ({ document }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (document) {
      loadHistory();
    }
  }, [document]);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await workflowAPI.getHistory(document.reference);
      if (res.ok) {
        const data = await safeJsonParse(res);
        setHistory(data.workflows || []);
      } else {
        setError('Impossible de charger l\'historique');
      }
    } catch (err) {
      console.error('Erreur chargement historique:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!document) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <History size={64} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Sélectionnez un document pour voir l'historique</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Historique du Workflow</h2>
        <button
          onClick={loadHistory}
          disabled={loading}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-semibold"
        >
          Actualiser
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Chargement...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <History size={48} className="mx-auto text-gray-300 mb-4" />
          <p>Aucun historique disponible</p>
          <p className="text-sm text-gray-400 mt-2">
            Les actions effectuées sur ce document apparaîtront ici
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>

          <div className="space-y-6">
            {history.map((item, index) => (
              <div key={index} className="relative pl-16">
                {/* Timeline dot */}
                <div className="absolute left-6 top-2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow"></div>

                {/* Content card */}
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-gray-800 text-lg">
                      {item.action || 'Action'}
                    </div>
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {item.timestamp || new Date().toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <User size={16} />
                    <span>Par: <strong>{item.acteur?.username || item.acteur?.name || 'N/A'}</strong></span>
                    {item.acteur?.matricule && (
                      <span className="text-gray-400">({item.acteur.matricule})</span>
                    )}
                  </div>

                  {item.remarque && (
                    <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">
                        Remarque
                      </div>
                      <div className="text-sm text-gray-700">
                        {item.remarque}
                      </div>
                    </div>
                  )}

                  {item.statut && (
                    <div className="mt-2 inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                      Statut: {item.statut}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowManagement;