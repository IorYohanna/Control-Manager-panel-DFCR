import React, { useState } from "react";
import { Calendar, X } from "lucide-react";

export const UpcomingEvents = ({ upcomingEvents, todayEvents }) => {
  const [isOpen, setIsOpen] = useState(false);
  const now = new Date();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventStatus = (event) => {
    const eventDate = new Date(event.startTime);
    const isToday = todayEvents.some((e) => e.idEvent === event.idEvent);

    const isTomorrow =
      eventDate.toDateString() ===
      new Date(now.getTime() + 86400000).toDateString();

    return { isToday, isTomorrow };
  };

  return (
    <>
      {/* Card principale */}
      <div className="col-span-1 md:col-span-2 relative group">
        <div className="backdrop-blur-xl bg-[#f5ece3]/50 rounded-3xl p-8 shadow-2xl shadow-[#2d466e]/5 border border-white/50 hover:border-white/60 transition-all duration-500 hover:shadow-[#2d466e]/10 overflow-hidden">
          <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl text-[#2d466e] tracking-tight font-dropline">
                Événements à venir
              </h3>
              <span className="text-sm font-necoblack text-[#2d466e]">
                {upcomingEvents.length} événements
              </span>
            </div>

            {upcomingEvents.length === 0 ? (
              <p className="text-[#73839e] text-center py-8 font-eirene">
                Aucun événement à venir
              </p>
            ) : (
              <>
                {/* Liste des 2 premiers événements */}
                <div className="space-y-3">
                  {upcomingEvents.slice(0, 2).map((event) => {
                    const { isToday, isTomorrow } = getEventStatus(event);

                    return (
                      <div
                        key={event.idEvent}
                        className="relative hover:scale-[1.02] cursor-pointer hover:bg-white/20 rounded-2xl transition-all duration-100 p-2"
                      >
                        <div className="flex items-center gap-4">
                          {/* Icône Calendar */}
                          <div className="w-14 h-14 rounded-2xl backdrop-blur-sm bg-linear-to-br from-[#f5ece3]/80 to-white/80 border-2 border-white/60 shadow-lg flex items-center justify-center">
                            <Calendar className="w-7 h-7 text-[#2d466e]" />
                          </div>

                          {/* Infos événement */}
                          <div className="flex flex-col flex-1">
                            <p className="text-sm font-dropline text-[#2d466e]">
                              {event.title}
                            </p>
                            <p className="text-xs text-[#73839e] font-eirene mt-0.5">
                              {formatDate(event.startTime)} à {formatTime(event.startTime)}
                            </p>
                          </div>

                          {/* Badge statut */}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-necoblack shadow-sm ${
                              isToday
                                ? "bg-[#2d466e] text-white"
                                : isTomorrow
                                ? "bg-[#73839e] text-white"
                                : "bg-[#f5ece3] text-[#2d466e]"
                            }`}
                          >
                            {isToday
                              ? "Aujourd'hui"
                              : isTomorrow
                              ? "Demain"
                              : "À venir"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bouton Voir plus */}
                {upcomingEvents.length > 2 && (
                  <button
                    onClick={() => setIsOpen(true)}
                    className="w-full mt-3 group/btn relative overflow-hidden backdrop-blur-md bg-white text-[#2d466e] py-2 rounded-2xl transition-all duration-100 border border-[#2d466e]/20 hover:border-[#2d466e]/30 shadow-md"
                  >
                    <span className="relative flex items-center justify-center gap-2">
                      Voir tous les événements
                      <span className="text-xs backdrop-blur-sm bg-white/40 px-2 py-1 rounded-full">
                        {upcomingEvents.length}
                      </span>
                    </span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 w-11/12 max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl shadow-[#2d466e]/20 border border-white/20">
            {/* Header modal */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl text-white font-dropline">
                Tous les événements
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-[#f5ece3] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Liste complète */}
            <div className="space-y-3">
              {upcomingEvents.map((event) => {
                const { isToday, isTomorrow } = getEventStatus(event);

                return (
                  <div
                    key={event.idEvent}
                    className="flex items-center gap-4 px-2 py-2 hover:bg-white/20 rounded-2xl transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl backdrop-blur-sm bg-linear-to-br from-[#f5ece3]/80 to-white/80 border-2 border-white/60 shadow-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-[#2d466e]" />
                    </div>
                    <div className="flex flex-col flex-1">
                      <p className="text-sm font-dropline text-white">
                        {event.title}
                      </p>
                      <p className="text-xs text-white/80 font-eirene">
                        {formatDate(event.startTime)} à {formatTime(event.startTime)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-necoblack shadow-sm ${
                        isToday
                          ? "bg-white text-[#2d466e]"
                          : isTomorrow
                          ? "bg-white/80 text-[#2d466e]"
                          : "bg-white/60 text-[#2d466e]"
                      }`}
                    >
                      {isToday
                        ? "Aujourd'hui"
                        : isTomorrow
                        ? "Demain"
                        : "À venir"}
                    </span>
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