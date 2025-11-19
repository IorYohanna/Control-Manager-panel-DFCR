import React, { useState, useEffect } from 'react';
import { Search, Plus, RefreshCw, Folder, FileText, Clock, Calendar, User, Trash2, Edit, FolderOpen, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Dossier/Button';
import { DossierCard } from '../../components/Dossier/DossierCard';
import { CreateDossierModal } from '../../components/Dossier/CreateDossierModal';

const API_BASE_URL = 'http://localhost:8080';

const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

const DossierManagement = () => {
  const [dossiers, setDossiers] = useState([]);
  const [filteredDossiers, setFilteredDossiers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadDossiers();
  }, []);

  useEffect(() => {
    filterDossiers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dossiers, searchTerm]);

  const loadDossiers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/dossiers`, {
        method: 'GET',
        headers: getAuthHeader()
      });

      if (response.ok) {
        const data = await response.json();
        setDossiers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Erreur chargement dossiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterDossiers = () => {
    if (!searchTerm.trim()) {
      setFilteredDossiers(dossiers);
      return;
    }

    const filtered = dossiers.filter(dossier =>
      dossier.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDossiers(filtered);
  };

  const handleDossierClick = (dossier) => {
    console.log('Dossier sélectionné:', dossier);
    // Navigation vers les documents du dossier
  };

  return (
    <div className=" w-full p-6 rounded-lg">

      <div className="bg-linear-to-r from-[#2d466e] to-[#24344d] rounded-lg p-4 mb-4 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-necoBlack font-bold text-white ml-4">Mes Dossiers</h1>
          </div>
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={loadDossiers}
            disabled={loading}
          />
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Rechercher un dossier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-sm text-white font-medium px-5 py-3 pl-12 border-2 border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all placeholder-white/60"
            />
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 mb-6 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderOpen size={24} className="text-[#2d466e]" />
          <h2 className="text-xl font-eirene capitalize font-bold text-[#24344d]">
            {filteredDossiers.length} dossier{filteredDossiers.length > 1 ? 's' : ''}
          </h2>
        </div>

        <div className="flex gap-3">

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowCreateModal(true)}
          >
            Nouveau Dossier
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#2d466e] border-t-transparent" />
        </div>
      ) : filteredDossiers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
          <Folder size={64} className="mx-auto text-[#c4beaf] mb-4" />
          <h3 className="text-xl font-bold text-[#24344d] mb-2">Aucun dossier</h3>
          <p className="text-[#73839e] mb-6">Commencez par créer votre premier dossier</p>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowCreateModal(true)}
          >
            Créer un dossier
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredDossiers.map((dossier) => (
            <DossierCard
              key={dossier.id}
              dossier={dossier}
              onClick={handleDossierClick}
            />
          ))}
        </div>
      )}



      {showCreateModal && (
        <CreateDossierModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadDossiers}
        />
      )}
    </div>
  );
};

export default DossierManagement;