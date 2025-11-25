import React, { useState } from 'react';
import { Upload, FileText, Plus, Loader2, X } from 'lucide-react';
import { createDocument } from '../../api/Document/document';
import Input from '../../components/input/Input';
import DefaultButton from '../../components/Button/DefaultButton';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const type = {
  values: ["jpg", "png", "gif", "pdf", "txt", "docx", "doc", "xlsx", "xls"]
};
const typeOptions = Array.isArray(type?.values) ? type.values : [];

const status = {
  values: ["en_attente", "au_service", "termine"]
}
const statusOptions = Array.isArray(status?.values) ? status.values : []

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
      className="fixed inset-0 bg-[#24344d]/60 backdrop-blur-sm flex items-start justify-center p-4 z-50 overflow-auto thin-scrollbar"
    >
      <form
        onSubmit={handleCreateDocSubmit}
        className="w-full max-w-4xl bg-[#f5ece3] p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#c4beaf]/30 relative mt-10 mb-10 "
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 rounded-xl bg-white/80 text-[#2d466e] hover:bg-white hover:shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-[#2d466e] to-[#24344d]rounded-lg  mb-5 shadow-lg">
            <FileText className="w-8 h-8 text-[#f5ece3]" />
          </div>
          <h2 className="text-3xl font-bold text-[#24344d] mb-2 font-necoBlack">Nouveau Document</h2>
          <p className="text-[#73839e] text-base font-necoMedium">Remplissez les informations du document</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <Input
              id="reference"
              label="Reference"
              placeholder="Ex: DOC-2024-001"
              type="text"
              value={formData.reference}
              required={true}
              sx={{ 
                width: "100%", 
                backgroundColor: "white",
                borderRadius: "12px",
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: '#2d466e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2d466e',
                  },
                }
              }}
              onChange={handleInputChange("reference")}
            />
          </div>

          <div className="space-y-2">
            <Input
              id="objet"
              label="Objet"
              placeholder="Objet du document"
              type="text"
              value={formData.objet}
              sx={{ 
                width: "100%", 
                backgroundColor: "white",
                borderRadius: "12px",
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: '#2d466e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2d466e',
                  },
                }
              }}
              onChange={handleInputChange("objet")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#24344d] block font-dropline">Type de fichier</label>
            <Autocomplete
              sx={{ 
                width: "100%", 
                backgroundColor: "white",
                borderRadius: "12px",
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: '#2d466e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2d466e',
                  },
                }
              }}
              disablePortal
              options={typeOptions}
              getOptionLabel={(option) => option}
              renderInput={(params) => <TextField {...params} placeholder="Sélectionner le type" />}
              value={formData.type}
              onChange={(event, newValue) => {
                setFormData(prev => ({
                  ...prev,
                  type: newValue
                }));
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#24344d] block font-dropline">Statut</label>
            <Autocomplete
              sx={{ 
                width: "100%", 
                backgroundColor: "white",
                borderRadius: "12px",
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: '#2d466e',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2d466e',
                  },
                }
              }}
              disablePortal
              options={statusOptions}
              getOptionLabel={(option) => option}
              renderInput={(params) => <TextField {...params} placeholder="Sélectionner le statut" />}
              value={formData.status}
              onChange={(event, newValue) => {
                setFormData(prev => ({
                  ...prev,
                  status: newValue
                }));
              }}
            />
          </div>

          <div className="sm:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-[#24344d] block font-dropline">Contenu du document</label>
            <textarea
              rows={5}
              value={formData.corps}
              onChange={handleInputChange("corps")}
              placeholder="Saisissez le contenu ou la description du document..."
              className="w-full px-5 py-4 font-eirene border border-[#c4beaf] rounded-lg bg-white text-[#24344d] placeholder-[#73839e] focus:ring-2 focus:ring-[#2d466e] focus:border-transparent resize-none transition-all duration-200 shadow-sm"
            />
          </div>

          <div className="sm:col-span-2 space-y-2">
            <label className="text-sm font-semibold text-[#24344d] block font-dropline">Pièce jointe</label>

            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center shadow-sm
                ${dragActive 
                  ? "border-[#2d466e] bg-[#2d466e]/5 shadow-md" 
                  : "border-[#c4beaf] bg-white"}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />

              {!pieceJointe ? (
                <div className="space-y-3">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-linear-to-br from-[#2d466e] to-[#73839e] rounded-xl mb-2">
                    <Upload className="w-7 h-7 text-[#f5ece3]" />
                  </div>
                  <div>
                    <p className="text-[#24344d] font-medium text-base mb-1 font-necoMedium">
                      Glissez-déposez votre fichier ici
                    </p>
                    <p className="text-[#73839e] text-sm font-necoMedium">
                      ou cliquez pour parcourir vos fichiers
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 text-[#2d466e] bg-[#2d466e]/5 py-4 px-6 rounded-xl">
                  <div className="p-2 bg-[#2d466e] rounded-lg">
                    <FileText className="w-5 h-5 text-[#f5ece3]" />
                  </div>
                  <span className="font-medium text-base">{pieceJointe.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPieceJointe(null);
                    }}
                    className="ml-2 p-1.5 rounded-lg bg-white hover:bg-red-50 text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>


        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 font-dropline uppercase bg-linear-to-r from-[#2d466e] to-[#24344d] text-[#f5ece3] rounded-xl text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin " />
                Création en cours...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Créer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormDocument;