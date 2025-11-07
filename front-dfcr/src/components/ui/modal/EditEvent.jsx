import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, FileText, Check } from 'lucide-react';

const ModalEdit = ({ open, isEdit, formData, close, onEdit, onCreate }) => {
  const [localData, setLocalData] = useState(formData);

  useEffect(() => {
    if (open) {
      setLocalData(formData);
    }
  }, [open, formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      onEdit(localData);
    } else {
      onCreate(localData);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-75">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={close}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#f5ece3] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-75">
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 border-b border-[#2d466e]/10">
          <div>
            <h2 className="text-2xl font-bold text-[#2d466e] mb-2">
              {isEdit ? "Modifier l'événement" : "Créer un événement"}
            </h2>
            <p className="text-sm text-[#73839e] font-medium">
              Un événement à faire savoir!
            </p>
          </div>
          
          <button
            onClick={close}
            className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full text-[#73839e] hover:bg-white/50 hover:text-[#2d466e] transition-all duration-75"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Title */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 transition-all duration-75 hover:bg-white/70">
              <label className="block text-sm font-semibold text-[#73839e] mb-3">
                Titre de l'événement
              </label>
              <input
                type="text"
                value={localData.title}
                onChange={(e) => setLocalData({ ...localData, title: e.target.value })}
                className="w-full bg-transparent text-lg font-medium text-[#2d466e] border-b-2 border-[#73839e] focus:border-[#2d466e] outline-none transition-colors duration-75 pb-2"
                placeholder="Entrez le titre..."
                required
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Time */}
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 transition-all duration-75 hover:bg-white/70">
                <label className="flex items-center gap-2 text-sm font-semibold text-[#73839e] mb-3">
                  <Clock size={16} />
                  Début
                </label>
                <input
                  type="datetime-local"
                  value={localData.startTime}
                  onChange={(e) => setLocalData({ ...localData, startTime: e.target.value })}
                  className="w-full bg-transparent text-[#2d466e] border-b-2 border-[#73839e] focus:border-[#2d466e] outline-none transition-colors duration-75 pb-2"
                  required
                />
              </div>

              {/* End Time */}
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 transition-all duration-75 hover:bg-white/70">
                <label className="flex items-center gap-2 text-sm font-semibold text-[#73839e] mb-3">
                  <Clock size={16} />
                  Fin
                </label>
                <input
                  type="datetime-local"
                  value={localData.endTime}
                  onChange={(e) => setLocalData({ ...localData, endTime: e.target.value })}
                  className="w-full bg-transparent text-[#2d466e] border-b-2 border-[#73839e] focus:border-[#2d466e] outline-none transition-colors duration-75 pb-2"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 transition-all duration-75 hover:bg-white/70">
              <label className="flex items-center gap-2 text-sm font-semibold text-[#73839e] mb-3">
                <FileText size={16} />
                Description
              </label>
              <textarea
                value={localData.description}
                onChange={(e) => setLocalData({ ...localData, description: e.target.value })}
                rows={4}
                className="w-full bg-transparent text-[#2d466e] border-b-2 border-[#73839e] focus:border-[#2d466e] outline-none transition-colors duration-75 pb-2 resize-none"
                placeholder="Ajoutez une description..."
              />
            </div>

            {/* All Day Checkbox */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-5 transition-all duration-75 hover:bg-white/70">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={localData.allDay}
                    onChange={(e) => setLocalData({ ...localData, allDay: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-6 h-6 border-2 border-[#2d466e] rounded-md peer-checked:bg-[#2d466e] transition-all duration-75 flex items-center justify-center">
                    {localData.allDay && <Check size={16} className="text-[#f5ece3]" />}
                  </div>
                </div>
                <span className="text-[#2d466e] font-medium group-hover:text-[#1f2f4d] transition-colors duration-75">
                  Événement toute la journée
                </span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-8 pb-8 pt-4 border-t border-[#2d466e]/10 flex items-center gap-4">
          <button
            type="button"
            onClick={close}
            className="px-6 py-3 rounded-full text-[#73839e] font-medium hover:bg-white/50 transition-all duration-75"
          >
            Annuler
          </button>
          
          <div className="flex-1" />
          
          <button
            onClick={handleSubmit}
            className="px-8 py-3 rounded-full bg-[#2d466e] text-[#f5ece3] font-medium shadow-lg shadow-[#2d466e]/30 hover:bg-[#1f2f4d] hover:shadow-xl hover:shadow-[#2d466e]/40 transition-all duration-75transform hover:scale-105"
          >
            {isEdit ? 'Enregistrer les modifications' : "Créer l'événement"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEdit;