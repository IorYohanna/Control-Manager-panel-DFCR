import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Folder,
  FilePlus,
  FileText,
  Filter,
  Calendar,
  User,
  ChevronLeft
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
    <div className="w-full m-6 rounded-2xl p-4 md:p-8 bg-[#f5ece3] overflow-auto thin-scrollbar">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-6">
            <ChevronLeft className="bg-blue-zodiac text-white rounded-4xl" onClick={returnHome} />
            <Folder size={26} className="text-[#2d466e]" />
            <h1 className="text-xl sm:text-2xl font-necoBlack uppercase font-bold text-[#24344d]">
              {dossier?.title}
            </h1>
            {dossier.createdAt && (
              <p className="mt-2 sm:mt-0 sm:ml-auto text-sm bg-[#2d466e] text-white px-3 py-1 rounded-full">
                {new Date(dossier.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>

        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {stats.map((stat, index) => (
            <DossierStatsCards key={index} {...stat} />
          ))}
        </div>


        <div className="bg-white rounded-xl shadow-sm border border-[#c4beaf]/30 p-4 mb-4">
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
    </div>
  );
}



