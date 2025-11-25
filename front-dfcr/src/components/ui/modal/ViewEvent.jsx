import React from 'react';
import { X, Edit, Trash2, FileText, Clock, User } from 'lucide-react';

const ModalView = ({ open, formData, close, onEditMode,onDeleteMode }) => {
  if (!open) return null;

  const { idEvent, title, color, email, service, description, startTime, endTime, allDay } = formData;
  console.log(idEvent)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-75">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={close}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#f5ece3] rounded-3xl shadow-2xl overflow-y-auto animate-in zoom-in-95 duration-75">
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 border-b border-[#2d466e]/10">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-4 h-4 rounded-full shadow"
              style={{ backgroundColor: color || '#2d466e' }}
            />
            <h2 className="text-2xl font-bold text-[#2d466e]">{title}</h2>
          </div>
          <button
            onClick={close}
            className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full text-[#73839e] hover:bg-white/50 hover:text-[#2d466e] transition-all duration-75"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 flex flex-col gap-6">
          {/* Creator Info */}
          <div className="bg-white/60 backdrop-blur-md rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <User size={16} className="text-[#73839e]" />
              <span className="text-xs font-semibold text-[#73839e] uppercase tracking-wider">
                Créateur
              </span>
            </div>
            <p className="ml-5 text-[#2d466e] text-sm">
              {email} | {service}
            </p>
          </div>

          {/* Time Info */}
          <div className="bg-white/60 backdrop-blur-md rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Clock size={16} className="text-[#73839e]" />
              <span className="text-xs font-semibold text-[#73839e] uppercase tracking-wider">
                Horaire
              </span>
            </div>
            <div className="ml-5 flex flex-col gap-1">
              <p className="text-[#2d466e] text-sm">
                <strong>Début:</strong>{' '}
                {new Date(startTime).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
              <p className="text-[#2d466e] text-sm">
                <strong>Fin:</strong>{' '}
                {new Date(endTime).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
          </div>

          {/* Description */}
          {description && (
            <div className="bg-white/60 backdrop-blur-md rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <FileText size={16} className="text-[#73839e]" />
                <span className="text-xs font-semibold text-[#73839e] uppercase tracking-wider">
                  Description
                </span>
              </div>
              <p className="ml-5 text-[#2d466e] text-sm leading-relaxed">{description}</p>
            </div>
          )}

          {/* All Day */}
          {allDay && (
            <div className="flex justify-center pt-1">
              <span className="bg-[#2d466e] text-[#f5ece3] text-sm font-medium px-4 py-2 rounded-full">
                Toute la journée
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 pt-4 border-t border-[#2d466e]/10 flex items-center gap-3">
          <button
            onClick={close}
            className="px-6 py-2 rounded-full text-[#73839e] font-medium hover:bg-white/50 transition-all duration-75"
          >
            Fermer
          </button>

          <div className="flex-1" />

          <button
            onClick={onEditMode}
            className="px-6 py-2 rounded-full bg-[#2d466e] text-[#f5ece3] font-medium shadow-lg shadow-[#2d466e]/30 hover:bg-[#1f2f4d] transition-all duration-75 flex items-center gap-2"
          >
            <Edit size={16} /> Modifier
          </button>

          <button
            onClick={onDeleteMode}
            className="px-6 py-2 rounded-full border-2 border-red-600 text-red-600 font-medium hover:bg-red-50 transition-all duration-75 flex items-center gap-2"
          >
            <Trash2 size={16} /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalView;
