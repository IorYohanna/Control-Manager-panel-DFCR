import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Folder, FilePlus, FileText } from "lucide-react";
import { AddDocumentModal } from "../../components/Dossier/AddDocumentModal";

const API_BASE_URL = "http://localhost:8080";

const getAuthHeader = () => ({
  "Authorization": `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export default function DossierDetails() {
  const { id } = useParams();
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadDossier();
  }, []);

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
      console.error("Erreur chargement dossier :", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-12 w-12 border-4 border-[#24344d] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full">
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow">
        <div className="flex items-center gap-3">
          <Folder size={30} className="text-[#2d466e]" />
          <h2 className="text-2xl font-bold text-[#24344d] capitalize">
            {dossier.title}
          </h2>
        </div>

        <button
          className="bg-[#2d466e] hover:bg-[#1f3450] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <FilePlus size={18} /> Ajouter un document
        </button>
      </div>

      {/* DOCUMENT LIST */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dossier.documents?.length > 0 ? (
          dossier.documents.map((doc) => (
            <div
              key={doc.reference}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-[#73839e]" size={24} />
                <div>
                  <h4 className="font-semibold text-[#24344d]">{doc.reference}</h4>
                  <p className="text-sm text-[#73839e]">{doc.reference}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-[#73839e] mt-10">
            Aucun document dans ce dossier.
          </p>
        )}
      </div>

      {showAddModal && (
        <AddDocumentModal
          dossierId={id}
          onClose={() => setShowAddModal(false)}
          onSuccess={loadDossier}
        />
      )}
    </div>
  );
}
