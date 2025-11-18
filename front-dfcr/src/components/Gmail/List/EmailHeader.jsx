import { Mail, LogOut, RefreshCw, Search, Loader2 } from 'lucide-react';

export default function EmailHeader({
  loading,
  logoutLoading,
  loadEmails,
  handleLogout,
  searchQuery,
  setSearchQuery,
  displayLimit
}) {
  return (
    <header className="bg-[#f5ece3] border-b border-[#73839e]/30 px-4 py-3 flex flex-col md:flex-row items-center justify-between rounded-tl-2xl rounded-tr-2xl shadow-sm w-full gap-3 md:gap-0">
      
      {/* Logo + titre */}
      <div className="flex items-center gap-3 md:gap-5 flex-1">
        <Mail className="w-8 h-8 md:w-10 md:h-10 p-1 text-[#2d466e]" />
        <span className="text-lg md:text-xl font-semibold text-[#2d466e] whitespace-nowrap">
          Gmail
        </span>
         {/* Badge du displayLimit */}

        <div className="px-4 py-0.5 bg-white text-light-blue text-sm font-medium rounded-full shadow-sm">
          {displayLimit} emails
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex-1 max-w-full md:max-w-2xl mx-0 md:mx-4 relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#73839e] w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 py-2 bg-white text-gray-400 rounded-xl transition-all text-sm md:text-base"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-3 mt-2 md:mt-0 flex-shrink-0">
        <button
          onClick={loadEmails}
          className="p-2 rounded-full hover:bg-[#73839e]/20 transition"
        >
          <RefreshCw className={`w-5 h-5 text-[#2d466e] ${loading ? "animate-spin" : ""}`} />
        </button>

        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-xl bg-[#2d466e] text-white hover:bg-[#2d466e]/80 transition shadow-sm text-sm md:text-base"
        >
          {logoutLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut />}
          <span className="truncate">Déconnexion</span>
        </button>
      </div>
    </header>
  );
}
