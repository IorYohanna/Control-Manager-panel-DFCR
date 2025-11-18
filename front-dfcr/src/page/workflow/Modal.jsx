import { BaggageClaim, Calendar, CheckCircle, Clock, History, Printer, Send, User, Workflow, WorkflowIcon, XCircle, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Select, StatusBadge, TabButton } from "./Base";
import { ActionForm } from "./Action";
import { Print, Work } from "@mui/icons-material";

const safeJsonParse = async (response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('Erreur parsing JSON:', text.substring(0, 200));
    throw new Error('Réponse invalide du serveur : ', err);
  }
};

const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

const API_BASE_URL = 'http://localhost:8080';


const workflowAPI = {
  sendToService: (data) => fetch(`${API_BASE_URL}/workflow/send-to-service`, {
    method: 'POST', headers: getAuthHeader(), body: JSON.stringify(data)
  }),
  assignToEmploye: (data) => fetch(`${API_BASE_URL}/workflow/assign-to-employe`, {
    method: 'POST', headers: getAuthHeader(), body: JSON.stringify(data)
  }),
  startWork: (data) => fetch(`${API_BASE_URL}/workflow/start-work`, {
    method: 'POST', headers: getAuthHeader(), body: JSON.stringify(data)
  }),
  finishWork: (data) => fetch(`${API_BASE_URL}/workflow/finish-work`, {
    method: 'POST', headers: getAuthHeader(), body: JSON.stringify(data)
  }),
  chefValidate: (data) => fetch(`${API_BASE_URL}/workflow/chef-validate`, {
    method: 'POST', headers: getAuthHeader(), body: JSON.stringify(data)
  }),
  chefReject: (data) => fetch(`${API_BASE_URL}/workflow/chef-reject`, {
    method: 'POST', headers: getAuthHeader(), body: JSON.stringify(data)
  }),
  directeurValidate: (data) => fetch(`${API_BASE_URL}/workflow/directeur-validate`, {
    method: 'POST', headers: getAuthHeader(), body: JSON.stringify(data)
  }),
  directeurReject: (data) => fetch(`${API_BASE_URL}/workflow/directeur-reject`, {
    method: 'POST', headers: getAuthHeader(), body: JSON.stringify(data)
  }),
  getHistory: (reference) => fetch(`${API_BASE_URL}/workflow/history/${reference}`, {
    method: 'GET', headers: getAuthHeader()
  })
};

export const DocumentModal = ({ document, onClose, currentUser, serviceUsers, onActionComplete, initialTab = 'details' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedAction, setSelectedAction] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (activeTab === 'history' && document) {
      loadHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, document]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await workflowAPI.getHistory(document.reference);
      if (res.ok) {
        const data = await safeJsonParse(res);
        setHistory(Array.isArray(data) ? data : data.workflows || []);
      }
    } catch (err) {
      console.error('Erreur historique:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableActions = () => {
    if (!currentUser || !document) return [];

    const fonction = (currentUser.fonction || '').toLowerCase().trim();
    const status = (document.status || '').toLowerCase().trim();

    if (fonction.includes('directeur') || fonction.includes('director')) {
      if (status === 'en_attente' || status === 'nouveau' || status === 'enattente') {
        return ['send-to-service'];
      }
      if (status === 'validation_directeur' || status === 'validationdirecteur') {
        return ['directeur-validate', 'directeur-reject'];
      }
    }

    if (fonction.includes('chef') || fonction.includes('manager')) {
      if (status === 'au_service' || status === 'auservice' || status === 'recu_service') {
        return ['assign-to-employe'];
      }
      if (status === 'termine' || status === 'fini' || status === 'complete') {
        return ['chef-validate', 'chef-reject'];
      }
    }

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

  const handlePrint = async (reference) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/documents/print/${reference}`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      } 

    } catch (error) {
      console.error("Erreur lors de l'impression :", error);
      alert(error.message);
    }
  };

  const handleActionSubmit = async () => {
    if (!selectedAction) return;

    setLoading(true);
    setMessage(null);

    try {
      let payload = { reference: document.reference, ...formData };
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
        setTimeout(() => {
          onActionComplete();
          onClose();
        }, 1500);
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

  const availableActions = getAvailableActions();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-75 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-linear-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800 font-necoBlack">Document: {document.reference}</h2>
            <p className="text-sm text-gray-600 mt-1">{document.objet}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XCircle size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 py-3 border-b border-gray-200 flex gap-2 bg-gray-50">
          <TabButton active={activeTab === 'details'} onClick={() => setActiveTab('details')}>
            Détails
          </TabButton>
          <TabButton active={activeTab === 'actions'} onClick={() => setActiveTab('actions')}>
            Actions Workflow
          </TabButton>
          <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')}>
            Historique
          </TabButton>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          {/* Détails */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase font-necoMedium">Référence</label>
                  <div className="text-gray-800 font-medium mt-1 font-eirene capitalize">{document.reference}</div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase font-necoMedium">Statut</label>
                  <div className="mt-2 font-eirene capitalize">
                    <StatusBadge status={document.status} />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase font-necoMedium">Objet</label>
                <div className="text-gray-800 mt-1 font-eirene capitalize">{document.objet ? document.objet : "Vide"}</div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 font-necoMedium uppercase">Description</label>
                <div className="text-gray-700 mt-2 p-4 rounded-lg border border-gray-200 text-sm font-eirene capitalize">
                  {document.corps ? document.corps : "Vide"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 font-necoMedium uppercase">Type</label>
                  <div className="text-gray-800 mt-1 font-eirene uppercase">{document.type}</div>
                </div>
                {document.creatorName && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 font-necoMedium uppercase">Créateur</label>
                    <div className="text-gray-800 mt-1 text-sm flex items-center gap-2 font-eirene capitalize ">
                      <User size={14} className="text-blue-zodiac" />
                      {document.creatorName}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handlePrint(document.reference)}
                  className="px-4 py-2 bg-transparent text-gray-500 flex gap-2 items-center font-necoMedium rounded border border-blue-zodiac hover:bg-blue-zodiac hover:text-white hover:border-transparent transition"
                >
                <Printer size={16}/>
                  Imprimer
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          {activeTab === 'actions' && (
            <div className="space-y-4">
              {availableActions.length === 0 ? (
                <div className="text-center py-8">
                  <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600 font-medium mb-2">Aucune action disponible</p>
                  <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-4 inline-block">
                    <div>Rôle: <strong>{currentUser?.fonction}</strong></div>
                    <div>Statut: <strong>{document.status}</strong></div>
                  </div>
                </div>
              ) : (
                <>
                  <Select
                    label="Choisir une action"
                    value={selectedAction}
                    onChange={(e) => {
                      setSelectedAction(e.target.value);
                      setFormData({});
                      setMessage(null);
                    }}
                  >
                    <option value="">-- Sélectionner --</option>
                    {availableActions.map(action => (
                      <option key={action} value={action}>{actionLabels[action]}</option>
                    ))}
                  </Select>

                  {selectedAction && (
                    <ActionForm
                      action={selectedAction}
                      formData={formData}
                      setFormData={setFormData}
                      currentUser={currentUser}
                      serviceUsers={serviceUsers}
                    />
                  )}

                  {message && (
                    <div className={`p-4 rounded-lg text-sm ${message.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                      }`}>
                      <div className="flex items-center gap-2">
                        {message.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                        {message.text}
                      </div>
                    </div>
                  )}

                  {selectedAction && (
                    <Button
                      variant="primary"
                      icon={Send}
                      onClick={handleActionSubmit}
                      disabled={loading}
                      loading={loading}
                      className="w-full"
                    >
                      Exécuter l'action
                    </Button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Historique */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-4 text-sm">Chargement de l'historique...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8">
                  <History size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Aucun historique disponible</p>
                  <p className="text-xs text-gray-400 mt-2">Les actions sur ce document apparaîtront ici</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-linear-to-b from-blue-200 via-blue-300 to-transparent"></div>
                  {history.map((item, index) => (
                    <div key={index} className="relative pl-12 pb-6 last:pb-0">
                      <div className="absolute left-2 top-2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-md"></div>
                      <div className="bg-linear-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Zap size={16} className="text-blue-600" />
                            <div className="font-semibold text-gray-800 text-sm">{item.action || 'Action'}</div>
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar size={12} />
                            {item.timestamp || new Date().toLocaleString()}
                          </div>
                        </div>

                        {item.typeWorkflow && (
                          <div className="text-sm  font-medium text-blue-zodiac mb-2">
                            Type: {item.typeWorkflow}
                          </div>
                        )}

                        <div className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                          <User size={12} className="text-blue-600" />
                          Par: <strong>{item.matriculeActeur || item.acteur?.name || 'N/A'}
                          </strong>
                          {item.acteur?.matricule && (
                            <span className="text-gray-400">({item.acteur.matricule})</span>
                          )}
                        </div>

                        <div className="flex gap-2 items-center text-sm text-gray-600" >
                          <User size={12} />
                          <p> Fonction: <strong>{item.acteurFonction}</strong></p>
                        </div>

                        {item.remarque && (
                          <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                            <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Remarque</div>
                            <div className="text-sm text-gray-700">{item.remarque}</div>
                          </div>
                        )}

                        {item.statut && (
                          <div className="mt-2">
                            <StatusBadge status={item.statut} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
