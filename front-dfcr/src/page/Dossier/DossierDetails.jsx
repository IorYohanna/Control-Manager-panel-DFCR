import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Folder,
  FilePlus,
  FileText,
  Calendar,
  User,
  ChevronLeft,
  Trash2
} from "lucide-react";
import { AddDocumentModal } from "../../components/Dossier/AddDocumentModal";
import { fectUserData } from "../../api/User/currentUser";
import { API_BASE_URL, downloadDocument, getAuthHeader } from "../../api/Document/document";
import { DocumentTable, DossierStatsCards, SearchBar } from "../../components/Dossier/DossierDetails";


export default function DossierDetails() {
  const { id } = useParams();
  const [dossier, setDossier] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadingRef, setDownloadingRef] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadDossier();
    loadDocuments();
    loadUserStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDocuments(documents);
    } else {
      const filtered = documents.filter(doc =>
        doc.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.objet.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDocuments(filtered);
    }
  }, [searchQuery, documents]);

  const loadUserStats = async () => {
    try {
      const userData = await fectUserData();
      setUserStats(userData);
    } catch (err) {
      console.error("Erreur chargement stats utilisateur:", err);
    }
  };

  const loadDossier = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/dossiers/${id}`, {
        method: "GET",
        headers: getAuthHeader(),
      });

      if (response.ok) {
        const data = await response.json();
        setDossier(data);
      }
    } catch (err) {
      console.error("Erreur chargement dossier:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/dossiers/${id}/documents`, {
        method: "GET",
        headers: getAuthHeader(),
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
        setFilteredDocuments(data);
      }
    } catch (err) {
      console.error("Erreur chargement documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (reference, event) => {
    event.stopPropagation();
    setDownloadingRef(reference);

    try {
      await downloadDocument(reference);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setDownloadingRef(null);
    }
  };

  const handleDeleteDossier = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/dossiers/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      if (response.ok) {
        navigate('/home/workflow');
      } else {
        alert('Erreur lors de la suppression du dossier');
      }
    } catch (err) {
      console.error("Erreur suppression dossier:", err);
      alert('Erreur lors de la suppression du dossier');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const getDocumentTypeCount = () => {
    const typeCount = {};
    documents.forEach(doc => {
      const type = doc.type || 'Document';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    return typeCount;
  };

  const getRecentDocumentsCount = () => {
    const today = new Date();
    const thisMonth = documents.filter(doc => {
      if (!doc.updatedTime) return false;
      const docDate = new Date(doc.updatedTime);
      return docDate.getMonth() === today.getMonth() &&
        docDate.getFullYear() === today.getFullYear();
    });
    return thisMonth.length;
  };

  if (loading && !dossier) {
    return (
      <div className="flex justify-center items-center py-20 bg-[#f5ece3] min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-[#2d466e] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const stats = [
    {
      icon: FileText,
      value: documents.length,
      label: "Total Documents",
      color: "#2d466e",
      bgColor: "#e8edf5"
    },
    {
      icon: Calendar,
      value: getRecentDocumentsCount(),
      label: "Mis à jour ce mois",
      color: "#73839e",
      bgColor: "#f0f3f7"
    },
    {
      icon: User,
      value: userStats?.documentCount || 0,
      label: "Mes documents",
      color: "#000000",
      bgColor: "#f5ece3"
    }
  ];

  const returnHome = () => {
    navigate('/home/workflow');
  }

  return (
    <div className="w-full m-6 rounded-lg p-4 md:p-8 bg-[#f5ece3] overflow-auto thin-scrollbar">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-6">
            <ChevronLeft
              className="bg-blue-zodiac text-white rounded-full p-1 cursor-pointer hover:bg-[#24344d] transition"
              onClick={returnHome}
              size={28}
            />
            <Folder size={26} className="text-[#2d466e] ml-4" />
            <h1 className="text-xl sm:text-2xl font-necoBlack uppercase font-bold text-[#24344d]">
              {dossier?.title}
            </h1>
            <div className="mt-2 sm:mt-0 sm:ml-auto flex items-center gap-3">
              {dossier?.createdAt && (
                <p className="text-sm bg-[#2d466e] text-white px-3 py-1 rounded-full">
                  {new Date(dossier.createdAt).toLocaleDateString()}
                </p>
              )}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200"
                title="Supprimer le dossier"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>

        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => (
            <DossierStatsCards key={index} {...stat} />
          ))}
        </div>


        <div>
          <div className="bg-white rounded-xl shadow-sm border border-[#c4beaf]/30 p-4 mb-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#2d466e] hover:bg-[#24344d] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm"
            >
              <FilePlus size={16} />
              Ajouter un document
            </button>
          </div>

        </div>
        <div className="overflow-x-auto">
          <DocumentTable
            documents={filteredDocuments}
            searchQuery={searchQuery}
            downloadingRef={downloadingRef}
            onDownload={handleDownload}
            loading={loading}
          />
        </div>

      </div>


      {showAddModal && (
        <AddDocumentModal
          dossierId={id}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            loadDocuments();
            loadUserStats();
            setShowAddModal(false);
          }}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 font-necoBlack">Supprimer le dossier</h3>
            </div>

            <p className="text-gray-600 mb-6 font-eirene">
              Êtes-vous sûr de vouloir supprimer le dossier <strong className="font-dropline capitalize">"{dossier?.title}"</strong> ?
              Cette action est irréversible et supprimera également tous les documents associés.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteDossier}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700f font-necoMedium cursor-pointer text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Supprimer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}