// components/Chat/ChatSidebar.jsx
import { useState, useMemo } from "react";
import { Search, User, Filter, X } from "lucide-react";

export default function ChatSidebar({ users, currentUserMatricule, selectedUserId, onSelectUser }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("Tous");
  const [showFilters, setShowFilters] = useState(false);

  // 1. Extraire les rôles uniques dynamiquement
  const roles = useMemo(() => {
    const allRoles = users.map(u => u.fonction || "Autre");
    return ["Tous", ...new Set(allRoles)];
  }, [users]);

  // 2. Filtrer les utilisateurs
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.surname?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole === "Tous" || user.fonction === selectedRole;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header Sidebar */}
      <div className="p-4 bg-gradient-to-br from-[#2d466e] to-[#3d5680] text-white shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold leading-tight">Mes Messages</h2>
            <p className="text-xs opacity-70">{currentUserMatricule}</p>
          </div>
        </div>

        {/* Search & Filter Toggle */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-70" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm focus:outline-none focus:bg-white/20 transition-all placeholder-white/50"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg border transition-all ${showFilters ? 'bg-white text-[#2d466e] border-white' : 'bg-white/10 border-white/20 hover:bg-white/20'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Zone de filtres (Expandable) */}
        {showFilters && (
          <div className="mt-3 flex flex-wrap gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
            {roles.map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`text-xs px-3 py-1 rounded-full transition-colors border ${
                  selectedRole === role 
                    ? 'bg-white text-[#2d466e] font-bold border-white' 
                    : 'bg-transparent text-white/80 border-white/30 hover:bg-white/10'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Liste Users */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">Aucun utilisateur trouvé</div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.matricule}
              onClick={() => onSelectUser(user.matricule)}
              className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition-all ${
                selectedUserId === user.matricule
                  ? "bg-[#2d466e] text-white shadow-md"
                  : "hover:bg-white/60 text-[#2d466e]"
              }`}
            >
              {/* Avatar Initials */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                 selectedUserId === user.matricule ? "bg-white/20 text-white" : "bg-[#2d466e] text-white"
              }`}>
                {user.surname?.[0]}{user.username?.[0]}
              </div>
              
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">
                  {user.surname} {user.username}
                </p>
                <div className="flex items-center gap-2 text-xs opacity-80">
                  <span className="truncate max-w-[100px]">{user.fonction}</span>
                  <span className="w-1 h-1 rounded-full bg-current opacity-50"></span>
                  <span className="truncate">{user.idService}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}