import React from 'react';
import { X } from 'lucide-react';

const ModalDelete = ({ open, formData, close, onDelete }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={close}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#f5ece3] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative px-8 pt-8 pb-4 border-b border-[#2d466e]/10">
          <h2 className="text-2xl font-bold text-[#2d466e]">Supprimer l'événement</h2>
          <button
            onClick={close}
            className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full text-[#73839e] hover:bg-white/50 hover:text-[#2d466e] transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-4">
            <p className="text-[#2d466e] text-sm leading-relaxed">
              Voulez-vous vraiment supprimer{' '}
              <strong className="font-bold">{formData.title}</strong> ?
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 pt-4 border-t border-[#2d466e]/10 flex items-center gap-3">
          <button
            onClick={close}
            className="px-6 py-2 rounded-full text-[#73839e] font-medium hover:bg-white/50 transition-all duration-200"
          >
            Annuler
          </button>

          <div className="flex-1" />

          <button
            onClick={onDelete}
            className="px-6 py-2 rounded-full bg-red-600 text-white font-medium shadow-lg shadow-red-600/30 hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/40 transition-all duration-200"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDelete;
