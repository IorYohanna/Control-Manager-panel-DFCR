import React, { useState } from "react";
import { User2Icon, X } from "lucide-react";

const TeamMembers = ({ users }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Fonction utilitaire pour gérer l'affichage de l'avatar
  // eslint-disable-next-line no-unused-vars
  const renderAvatar = (user) => {
    if (user.photoProfil) {
      return (
        <img
          src={`data:image/jpeg;base64,${user.photoProfil}`}
          alt={user.fullName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none'; // Cache l'image cassée
            e.target.nextSibling.style.display = 'block'; // Montre l'icône de fallback
          }}
        />
      );
    }
    return <span className="text-2xl text-gray-400"><User2Icon /></span>;
  };

  return (
    <>
      {/* Card principale - Modifiée pour col-span-1 et h-full */}
      <div className="col-span-1 h-full relative group">
        <div className="h-full flex flex-col backdrop-blur-xl bg-[#f5ece3]/70 rounded-xl p-6 lg:p-8 shadow-lg border border-white/50 hover:border-white/60 transition-all duration-500 hover:shadow-xl">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl text-[#2d466e] font-bold font-dropline">Équipe</h3>
            <span className="text-xs font-necoblack bg-white/40 px-2 py-1 rounded-full text-[#2d466e]">{users.length}</span>
          </div>

          {/* Liste des 4 premiers membres - Flex-1 pour occuper l'espace */}
          <div className="space-y-3 flex-1">
            {users.length === 0 ? (
                 <div className="flex items-center justify-center h-32 text-[#73839e] text-sm font-eirene">
                    Aucun membre
                 </div>
            ) : (
                users.slice(0, 4).map((user, idx) => (
                <div key={idx} className="group/item relative hover:bg-white/40 rounded-lg transition-all duration-200 p-2 -mx-2 cursor-default">
                    <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-lg backdrop-blur-sm bg-white/60 border border-white/60 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                        {user.photoProfil ? (
                            <>
                                <img
                                    src={`data:image/jpeg;base64,${user.photoProfil}`}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {e.currentTarget.style.display='none';}}
                                />
                                {/* Fallback caché par défaut, visible si img error */}
                                <User2Icon className="hidden w-6 h-6 text-gray-400 absolute" />
                            </>
                        ) : (
                            <User2Icon className="w-6 h-6 text-gray-400"/>
                        )}
                    </div>

                    {/* Infos */}
                    <div className="flex flex-col min-w-0">
                        <p className="text-sm font-bold text-[#2d466e] truncate font-dropline">
                            {user.fullName || `${user.username} ${user.surname}`}
                        </p>
                        <p className="text-[11px] text-[#73839e] font-eirene truncate opacity-80 group-hover/item:opacity-100">
                            {user.fonction || "Membre"}
                        </p>
                    </div>
                    </div>
                </div>
                ))
            )}
          </div>

          {/* Bouton Voir plus (Stick au bas) */}
          {users.length > 4 && (
            <button
              onClick={() => setIsOpen(true)}
              className="w-full mt-4 text-xs font-medium text-[#2d466e] py-3 rounded-xl border border-[#2d466e]/10 hover:bg-white/40 transition-colors"
            >
              Voir les {users.length - 4} autres
            </button>
          )}
        </div>
      </div>

      {/* Modal inchangé mais nettoyé */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d466e]/20 backdrop-blur-sm p-4">
          <div className="bg-[#2d466e] rounded-3xl p-6 md:p-8 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-white font-dropline">L'équipe au complet</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                <X size={20}/>
              </button>
            </div>

            <div className="grid gap-3">
              {users.map((user, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                   <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden text-white">
                      {user.photoProfil ? (
                           <img src={`data:image/jpeg;base64,${user.photoProfil}`} className="w-full h-full object-cover" alt=""/>
                      ) : <User2Icon size={18}/>}
                   </div>
                   <div>
                      <p className="text-sm font-bold text-white">{user.fullName || user.username}</p>
                      <p className="text-xs text-white/60">{user.fonction || "Membre"}</p>
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