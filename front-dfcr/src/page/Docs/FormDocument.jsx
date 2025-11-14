import React, { useState } from 'react';
import { Upload, FileText, Plus, Loader2, X } from 'lucide-react';
import { createDocument } from '../../api/Document/document';
import Input from '../../components/input/Input';
import DefaultButton from '../../components/Button/DefaultButton';

const FormDocument = ({ onClose }) => {
  const [formData, setFormData] = useState({
    reference: "",
    objet: "",
    corps: "",
    type: "",
    status: ""
  });

  const [pieceJointe, setPieceJointe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setPieceJointe(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPieceJointe(e.target.files[0]);
    }
  };

  const handleCreateDocSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (pieceJointe) data.append("pieceJointe", pieceJointe);

    try {
      const response = await createDocument(data);
      console.log("Création réussie : ", response);

      if (onClose) onClose();
    } catch (err) {
      console.warn("Erreur création document: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center p-2 z-50 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <form
        onSubmit={handleCreateDocSubmit}
        className="w-full max-w-3xl bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 relative mt-10 mb-10"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {/* Bouton fermer */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* En-tête */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Nouveau Document</h2>
          <p className="text-gray-500 text-sm">Remplissez les informations du document</p>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <Input
              id="reference"
              label="Reference"
              placeholder="Entrez La reference"
              type="text"
              value={formData.reference}
              required={true}
              sx={{ width: "100%", background: "#e0e0e0" }}
              onChange={handleInputChange("reference")}
            />
          </div>

          <div className="space-y-2">
            <Input
              id="objet"
              label="Objet"
              placeholder="Entrez l'objet du doc"
              type="text"
              value={formData.objet}
              sx={{ width: "100%", background: "#e0e0e0" }}
              onChange={handleInputChange("objet")}
            />
          </div>

          <div className="space-y-2">
            <Input
              id="type"
              label="Type"
              placeholder="Entrez le type"
              type="text"
              value={formData.type}
              required={true}
              sx={{ width: "100%", background: "#e0e0e0" }}
              onChange={handleInputChange("type")}
            />
          </div>

          <div className="space-y-2">
            <Input
              id="status"
              label="Status"
              placeholder="en_attente / au_service / termine"
              type="text"
              value={formData.status}
              required={true}
              sx={{ width: "100%", background: "#e0e0e0" }}
             onChange={handleInputChange("status")}
            />
          </div>

          {/* Corps */}
          <div className="sm:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700">Contenu / Corps de Lettre</label>
            <textarea
              rows={4}
              value={formData.corps}
              onChange={handleInputChange("corps")}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Upload */}
          <div className="sm:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700">Pièce jointe</label>

            <div
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition 
                ${dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />

              {!pieceJointe && (
                <>
                  <Upload className="mx-auto w-8 h-8 text-blue-500 mb-2" />
                  <p className="text-gray-600 text-sm">Glissez-déposez ou cliquez pour importer</p>
                </>
              )}

              {pieceJointe && (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <FileText className="w-4 h-4" />
                  {pieceJointe.name}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <DefaultButton
            bgColor="#24344D"
            text="#F5ECE3"
            label={loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Création...
              </>
            ) : (
              <>
                <Plus className=" w-4 h-4 mr-2" />
                Créer
              </>
            )}

          />
        </div>
      </form>
    </div>
  );
};

export default FormDocument;
