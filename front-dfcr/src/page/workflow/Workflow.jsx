import React, { useState, useEffect } from 'react';
import { FilterBar, Header, SearchBar } from './Header';
import { DocumentsTable, Pagination } from './Documents';
import { DocumentModal } from './Modal';
import { fetchCompleteUserProfile } from '../../api/User/profileinfo';
import { Button } from './Base';
import { Plus } from 'lucide-react';
import FormDocument from '../Docs/FormDocument';

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
    loadDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents, activeFilter, referenceSearch, objetSearch]);

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

    // Filtre par statut
    if (activeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === activeFilter);
    }

    // Filtre par référence
    if (referenceSearch.trim()) {
      filtered = filtered.filter(doc =>
        doc.reference.toLowerCase().includes(referenceSearch.toLowerCase())
      );
    }

    // Filtre par objet
    if (objetSearch.trim()) {
      filtered = filtered.filter(doc =>
        doc.objet.toLowerCase().includes(objetSearch.toLowerCase())
      );
    }

    setFilteredDocuments(filtered);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    filterDocuments();
  };

  const handleRefresh = () => {
    loadUserProfile();
    loadDocuments();
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
    loadDocuments();
  };

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

  return (
    <div className="w-full rounded-2xl m-6 bg-white/90 p-8">
      <div className="mx-auto">

        <Header currentUser={currentUser} photo={photo} onRefresh={handleRefresh} />

        <FilterBar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        <div className='grid grid-cols-3 gap-4' >
          <SearchBar
            className="col-span-2"
            referenceSearch={referenceSearch}
            setReferenceSearch={setReferenceSearch}
            objetSearch={objetSearch}
            setObjetSearch={setObjetSearch}
            onSearch={handleSearch}
            onClose={handleCloseModal}
          />
          <div className='col-span-1'>
            <Button className='bg-linear-to-r from-gray-100 to-blue-zodiac' icon={Plus} onClick={() => setShowForm(true)}>
              Importer
            </Button>
          </div>
        </div>



        <DocumentsTable
          documents={paginatedDocuments}
          onSelectDocument={handleSelectDocument}
          loading={loading}
        />
        {showForm && (
          <div className="mb-6">
            <FormDocument onClose={() => setShowForm(false)} />
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
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
      </div>
    </div>
  );
};

export default WorkflowManagement;