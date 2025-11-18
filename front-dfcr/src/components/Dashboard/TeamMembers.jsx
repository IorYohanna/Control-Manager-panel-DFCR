import React, { useState } from "react";
import { User2Icon, X } from "lucide-react";

const TeamMembers = ({ users }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Card principale */}
      <div className="col-span-1 md:col-span-2 relative group">
        <div className="backdrop-blur-xl bg-white/30 rounded-3xl p-8 shadow-2xl shadow-[#2d466e]/5 border border-white/50 hover:border-white/60 transition-all duration-500 hover:shadow-[#2d466e]/10 overflow-hidden">
          <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl text-[#2d466e] tracking-tight font-dropline">Équipe</h3>
              <span className="text-sm font-necoblack text-[#2d466e]">{users.length} membres</span>
            </div>

            {/* Liste des 4 premiers membres */}
            <div className="space-y-3">
              {users.slice(0, 2).map((user, idx) => (
                <div key={idx} className="relative hover:scale-[1.02] cursor-pointer hover:bg-white/20 rounded-2xl transition-all duration-100">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-2xl backdrop-blur-sm bg-linear-to-br from-[#f5ece3]/80 to-white/80 border-2 border-white/60 shadow-lg flex items-center justify-center overflow-hidden">
                      {user.photoProfil ? (
                        <img
                          src={`data:image/jpeg;base64,${user.photoProfil}`}
                          alt={user.fullName || `${user.username} ${user.surname}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML = '<span class="text-3xl text-gray-500"><User2Icon/></span>';
                          }}
                        />
                      ) : (
                        <span className="text-3xl text-gray-400"><User2Icon/></span>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="flex flex-col">
                      <p className="text-sm font-dropline text-[#2d466e]">{user.fullName || `${user.username} ${user.surname}`}</p>
                      <p className="text-xs text-[#73839e] font-eirene mt-0.5">{user.fonction || "Membre"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bouton Voir plus */}
            {users.length > 3 && (
              <button
                onClick={() => setIsOpen(true)}
                className="w-full mt-3 group/btn relative overflow-hidden backdrop-blur-md bg-white text-[#2d466e] py-2 rounded-2xl transition-all duration-100 border border-[#2d466e]/20 hover:border-[#2d466e]/30 shadow-md"
              >
                <span className="relative flex items-center justify-center gap-2">
                  Voir tous les membres
                  <span className="text-xs backdrop-blur-sm bg-white/40 px-2 py-1 rounded-full">{users.length}</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 w-11/12 max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl shadow-[#2d466e]/20 border border-white/20">
            {/* Header modal */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl text-white font-dropline">Tous les membres</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-[#1c2b44] font-bold text-lg"
              >
                <X/>
              </button>
            </div>

            {/* Liste complète */}
            <div className="space-y-3">
              {users.map((user, idx) => (
                <div key={idx} className="flex items-center gap-4 px-2 py-1 hover:bg-white/20 rounded-2xl transition-all">
                  <div className="w-12 h-12 rounded-2xl backdrop-blur-sm bg-linear-to-br from-[#f5ece3]/80 to-white/80 border-2 border-white/60 shadow-lg flex items-center justify-center overflow-hidden">
                    {user.photoProfil ? (
                      <img
                        src={`data:image/jpeg;base64,${user.photoProfil}`}
                        alt={user.fullName || `${user.username} ${user.surname}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = '<span class="text-3xl text-gray-500"><User2Icon/></span>';
                        }}
                      />
                    ) : (
                      <span className="text-3xl text-gray-400"><User2Icon/></span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm font-dropline text-white">{user.fullName || `${user.username} ${user.surname}`}</p>
                    <p className="text-xs text-white font-eirene">{user.fonction || "Membre"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeamMembers;
