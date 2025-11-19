import React, { useState, useEffect } from 'react';
import { FilterBar, Header, ObjectSearch, SearchBar, ViewSwitcher } from './Header';
import { DocumentsTable, Pagination } from './Documents';
import { DocumentModal } from './Modal';
import { fetchCompleteUserProfile } from '../../api/User/profileinfo';
import { Button } from './Base';
import { Plus, RefreshCw, Upload } from 'lucide-react';
import FormDocument from '../Docs/FormDocument';
import DossierManagement from '../Dossier/Dossier';

const API_BASE_URL = 'http://localhost:8080';

const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

const safeJsonParse = async (response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('Erreur parsing JSON:', text.substring(0, 200));
    throw new Error('Réponse invalide du serveur : ', err);
  }
};

const documentAPI = {
  getAll: () => fetch(`${API_BASE_URL}/documents`, {
    method: 'GET', headers: getAuthHeader()
  }),
  search: (keyword) => fetch(`${API_BASE_URL}/documents/search?keyword=${encodeURIComponent(keyword)}`, {
    method: 'GET', headers: getAuthHeader()
  })
};

const WorkflowManagement = () => {
  const [currentView, setCurrentView] = useState('documents'); // 'documents' ou 'dossiers'
  const [currentUser, setCurrentUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [modalTab, setModalTab] = useState('details');
  const [serviceUsers, setServiceUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [referenceSearch, setReferenceSearch] = useState('');
  const [objetSearch, setObjetSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [photo, setPhoto] = useState();
  const [showForm, setShowForm] = useState(false);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadUserProfile();
    if (currentView === 'documents') {
      loadDocuments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  useEffect(() => {
    if (currentView === 'documents') {
      filterDocuments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents, activeFilter, referenceSearch, objetSearch, currentView]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const { userData, photoUrl } = await fetchCompleteUserProfile();

      setCurrentUser(userData);
      if (userData.serviceName) loadServiceUsers(userData.serviceName);

      if (photoUrl) {
        setPhoto(photoUrl);
      }
    } catch (err) {
      console.error("Erreur lors du chargement du profil :", err);
    }
  };

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const res = await documentAPI.getAll();

      if (res.ok) {
        const data = await safeJsonParse(res);
        const cleanDocuments = Array.isArray(data) ? data.map(doc => ({
          reference: doc.reference || '',
          objet: doc.objet || '',
          corps: doc.corps || '',
          type: doc.type || '',
          status: doc.status || '',
          updateTime: doc.updateTime || new Date().toLocaleString(),
          creatorMatricule: doc.creatorMatricule || doc.creator?.matricule || '',
          creatorName: doc.creatorName || doc.creator?.username || '',
          creatorUsername: doc.creatorUsername || doc.creator?.name || ''
        })) : [];
        setDocuments(cleanDocuments);
      }
    } catch (err) {
      console.error('Erreur chargement documents:', err);
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

  const filterDocuments = () => {
    let filtered = [...documents];

    if (activeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === activeFilter);
    }

    if (referenceSearch.trim()) {
      filtered = filtered.filter(doc =>
        doc.reference.toLowerCase().includes(referenceSearch.toLowerCase())
      );
    }

    if (objetSearch.trim()) {
      filtered = filtered.filter(doc =>
        doc.objet.toLowerCase().includes(objetSearch.toLowerCase())
      );
    }

    setFilteredDocuments(filtered);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    if (currentView === 'documents') {
      filterDocuments();
    }
    // Pour les dossiers, la recherche est gérée dans DossierManagement
  };

  const handleRefresh = () => {
    loadUserProfile();
    if (currentView === 'documents') {
      loadDocuments();
    }
  };

  const handleSelectDocument = (doc, tab = 'details') => {
    setSelectedDocument(doc);
    setModalTab(tab);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDocument(null);
    setModalTab('details');
  };

  const handleActionComplete = () => {
    if (currentView === 'documents') {
      loadDocuments();
    }
  };

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

  return (
    <div className="w-full bg-white m-6 rounded-2xl">
      <div className="relative bg-linear-to-r from-[#2d466e] to-[#24344d] rounded-t-2xl px-8 py-6">
        <Header currentUser={currentUser} photo={photo}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <ObjectSearch
                objetSearch={objetSearch}
                setObjetSearch={setObjetSearch}
                onSearch={handleSearch}
                currentView={currentView}
              />
            </div>
            <ViewSwitcher 
              currentView={currentView} 
              onViewChange={setCurrentView} 
            />
          </div>
        </Header>
      </div>

      {currentView === 'documents' ? (
        <>
          <div className="px-8 py-6 bg-beige-creme/50 border-b flex items-center justify-between border-[#c4beaf]/20">
            <FilterBar 
              activeFilter={activeFilter} 
              setActiveFilter={setActiveFilter} 
              currentView={currentView}
            />
            <button
              onClick={handleRefresh}
              className="p-3 bg-white hover:bg-blue-zodiac/10 text-blue-zodiac rounded-xl transition-all duration-200 backdrop-blur-sm"
              title="Actualiser"
            >
              <RefreshCw size={20} />
            </button>
          </div>

          <div className="px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <SearchBar
                  referenceSearch={referenceSearch}
                  setReferenceSearch={setReferenceSearch}
                  onSearch={handleSearch}
                  currentView={currentView}
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                icon={Plus}
                onClick={() => setShowForm(true)}
                className="bg-linear-to-r font-necoMedium from-[#2d466e] to-[#24344d] hover:from-[#24344d] hover:to-[#2d466e] text-[#f5ece3] shadow-lg hover:shadow-lg transition-all duration-300 px-6 py-3 rounded-xl font-semibold"
              >
                Importer
              </Button>
            </div>
          </div>

          <div className="px-8 pb-8">
            <DocumentsTable
              documents={paginatedDocuments}
              onSelectDocument={handleSelectDocument}
              loading={loading}
            />

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>

          {showForm && (
            <FormDocument onClose={() => setShowForm(false)} />
          )}

          {showModal && selectedDocument && (
            <DocumentModal
              document={selectedDocument}
              onClose={handleCloseModal}
              currentUser={currentUser}
              serviceUsers={serviceUsers}
              onActionComplete={handleActionComplete}
              initialTab={modalTab}
            />
          )}
        </>
      ) : (
        <DossierManagement />
      )}
    </div>
  );
};

export default WorkflowManagement;