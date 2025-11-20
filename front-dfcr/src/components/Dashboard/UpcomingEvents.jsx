import React, { useState } from "react";
import { Calendar, X, Clock } from "lucide-react";

export const UpcomingEvents = ({ upcomingEvents = [], todayEvents = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const now = new Date();

  // --- Fonctions Utilitaires ---

  // Sécurise le parsing des dates pour éviter les erreurs "Invalid Date"
  const parseDate = (dateString) => {
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? new Date() : d; 
  };

  const formatDate = (dateString) => {
    return parseDate(dateString).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  const formatTime = (dateString) => {
    return parseDate(dateString).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  const getEventStatus = (event) => {
    if (!event?.startTime) return { isToday: false, isTomorrow: false };
    
    const eventDate = parseDate(event.startTime);
    const isToday = todayEvents.some((e) => e.idEvent === event.idEvent);
    const isTomorrow = eventDate.toDateString() === new Date(now.getTime() + 86400000).toDateString();
    return { isToday, isTomorrow };
  };

  // --- RENDER ---

  return (
    <>
      {/* Card Principale */}
      <div className="col-span-1 h-full relative group">
        <div className="h-full flex flex-col backdrop-blur-xl bg-[#f5ece3]/50 rounded-[32px] p-6 lg:p-8 shadow-lg border border-white/50 hover:border-white/60 transition-all duration-500 hover:shadow-xl">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl text-[#2d466e] font-bold font-dropline">
              Agenda
            </h3>
            <span className="text-xs font-necoblack bg-white/40 px-2 py-1 rounded-full text-[#2d466e]">
              {upcomingEvents.length}
            </span>
          </div>

          {/* Liste des événements (Aperçu) */}
          <div className="flex-1 space-y-3">
            {!upcomingEvents || upcomingEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[150px] text-[#73839e] opacity-60">
                <Calendar className="w-10 h-10 mb-2 stroke-1" />
                <p className="text-sm font-eirene">Rien de prévu</p>
              </div>
            ) : (
              upcomingEvents.slice(0, 3).map((event) => {
                if (!event) return null;

                const { isToday } = getEventStatus(event);
                const dateObj = parseDate(event.startTime);

                return (
                  <div key={event.idEvent || Math.random()} className="group/item relative bg-white/30 hover:bg-white/60 rounded-2xl p-3 transition-all duration-200 border border-white/20">
                    <div className="flex justify-between items-start gap-3">
                      
                      {/* Date Box */}
                      <div className="flex flex-col items-center justify-center bg-white/60 rounded-xl w-12 h-12 shrink-0 shadow-sm">
                        <span className="text-[10px] uppercase font-bold text-[#73839e] leading-none">
                            {dateObj.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')}
                        </span>
                        <span className="text-lg font-bold text-[#2d466e] leading-none mt-0.5">
                            {dateObj.getDate()}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#2d466e] truncate pr-2 leading-tight">
                          {event.title || "Événement sans titre"}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-[#73839e]">
                            <Clock className="w-3 h-3" />
                            <p className="text-xs font-medium">
                                {formatTime(event.startTime)}
                            </p>
                        </div>
                      </div>

                      {isToday && <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" title="Aujourd'hui"></div>}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bouton "Voir tout" */}
          {upcomingEvents.length > 3 && (
            <button
              onClick={() => setIsOpen(true)}
              className="w-full mt-4 text-xs font-medium text-[#2d466e] py-3 rounded-xl border border-[#2d466e]/10 hover:bg-white/40 transition-colors"
            >
              Voir tout l'agenda
            </button>
          )}
        </div>
      </div>

      {/* --- MODAL (Fenêtre qui s'ouvre) --- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d466e]/20 backdrop-blur-sm p-4">
          {/* Container Modal */}
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-[#2d466e] font-dropline">Agenda complet</h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 bg-gray-100 rounded-full text-[#2d466e] hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Liste Complète */}
            <div className="space-y-2">
              {upcomingEvents.map((event) => {
                 const dateObj = parseDate(event.startTime);
                 return (
                    <div key={event.idEvent || Math.random()} className="flex gap-4 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors overflow-hidden thin-scrollbar">
                        <div className="flex flex-col items-center justify-center text-[#2d466e] font-bold w-12 h-12 bg-gray-50 rounded-xl">
                          <span className="text-xl leading-none">{dateObj.getDate()}</span>
                          <span className="text-[10px] uppercase text-gray-400 leading-none mt-1">
                            {dateObj.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#2d466e] truncate">{event.title}</p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                             <Clock size={14} />
                             <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                          </div>
                          {event.description && (
                              <p className="text-xs text-gray-400 mt-1 line-clamp-1">{event.description}</p>
                          )}
                        </div>
                    </div>
                 );
              })}
            </div>

          </div>
        </div>
      )}
    </>
  );
};