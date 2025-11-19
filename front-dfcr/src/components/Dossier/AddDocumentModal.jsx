import { useState, useEffect } from "react";
import { X } from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

const getAuthHeader = () => ({
  "Authorization": `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export const AddDocumentModal = ({ dossierId, onClose, onSuccess }) => {
  const [documents, setDocuments] = useState([]);
  const [selectedRef, setSelectedRef] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    const response = await fetch(`${API_BASE_URL}/documents`, {
      headers: getAuthHeader(),
    });
    if (response.ok) {
      setDocuments(await response.json());
    }
  };

  const addDocument = async () => {
    if (!selectedRef) return alert("Sélectionne un document");

    const response = await fetch(
      `${API_BASE_URL}/dossiers/${dossierId}/add-document/${selectedRef}`,
      {
        method: "POST",
        headers: getAuthHeader(),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Erreur ajout document:", response.status, text);
      alert(`Erreur ajout document : ${response.status}`);
      return;
    }

    onSuccess();
    onClose();
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#24344d]">Ajouter un document</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <select
          value={selectedRef}
          onChange={(e) => setSelectedRef(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        >
          <option value="">Sélectionne un document</option>
          {documents.map((d) => (
            <option key={d.reference} value={d.reference}>
              {d.name} — {d.reference}
            </option>
          ))}
        </select>

        <button
          className="w-full bg-[#2d466e] hover:bg-[#1f3450] text-white py-3 rounded-lg"
          onClick={addDocument}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
};
