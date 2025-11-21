import { RefreshCw, Search, Folder, FileText } from "lucide-react";
import { SearchInput, TabButton } from "./Base";

export const Header = ({ currentUser, photo, children }) => (
  <div className="space-y-4">
    <div className="flex flex-col md:flex-row md:gap-60 items-center justify-between">
      <div className="flex-1">
        {children}
      </div>
      <div className="flex items-center">
        {currentUser && (
          <div className="flex items-center gap-6 pl-4">
            <div className="rounded-full overflow-hidden ring-2 ring-[#f5ece3]">
              <img src={photo} alt={currentUser.username} className="w-10 h-10 md:w-12 md:h-12 object-cover" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-[#f5ece3] text-sm capitalize font-necoMedium">
                {currentUser.username} {currentUser.surname}
              </div>
              <div className="text-xs text-white uppercase font-necoMedium">
                {currentUser.fonction}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export const ViewSwitcher = ({ currentView, onViewChange }) => {
  const views = [
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'dossiers', label: 'Dossiers', icon: Folder }
  ];

  return (
    <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20 overflow-x-auto">
      {views.map((view) => {
        const Icon = view.icon;
        return (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${currentView === view.id
              ? 'bg-white text-[#24344d] shadow-md'
              : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
          >
            <Icon size={18} />
            {view.label}
          </button>
        );
      })}
    </div>
  );
};

export const FilterBar = ({ activeFilter, setActiveFilter, currentView }) => {
  const documentFilters = [
    { id: 'all', label: 'Tous' },
    { id: 'en_attente', label: 'En Attente' },
    { id: 'au_service', label: 'Au Service' },
    { id: 'termine', label: 'Terminés' },
    { id: 'validation_directeur', label: 'En Validation' },
    { id: 'complet', label: 'Complet' },
  ];

  const dossierFilters = [
    { id: 'all', label: 'Tous les dossiers' },
    { id: 'recent', label: 'Récents' },
    { id: 'archived', label: 'Archivés' },
  ];

  const filters = currentView === 'documents' ? documentFilters : dossierFilters;

  return (
    <div className="flex flex-wrap gap-3">
      <p className="mt-1 font-necoBlack text-2xl text-blue-zodiac mr-4">
        {currentView === 'documents' ? 'Documents' : 'Dossiers'}
      </p>
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`px-3 py-2 rounded-lg font-semibold text-xs md:text-sm font-eirene
            ${activeFilter === filter.id
              ? `bg-linear-to-r from-[#73839e] to-[#2d466e] text-white shadow-lg`
              : 'bg-white text-[#73839e] hover:bg-[#f5ece3] border border-[#c4beaf]/30'
            }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export const SearchBar = ({ referenceSearch, setReferenceSearch, onSearch, currentView }) => {
  const placeholder = currentView === 'documents'
    ? "Rechercher par référence..."
    : "Rechercher un dossier...";

  return (
    <div className="w-full font-necoMedium text-xs sm:text-sm">
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={referenceSearch}
          onChange={(e) => setReferenceSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          className="w-full bg-beige-creme/50 font-necoMedium text-[#24344d] font-medium px-5 py-3 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d466e] focus:border-transparent transition-all placeholder-[#73839e]"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <Search size={24} className="text-[#24344d]" />
        </div>
      </div>
    </div>
  );
};

export const ObjectSearch = ({ objetSearch, setObjetSearch, onSearch, currentView }) => {
  const placeholder = currentView === 'documents'
    ? "Rechercher par objet, contenu ou description..."
    : "Rechercher par nom ou description du dossier...";

  return (
    <div className="w-full font-necoMedium text-xs sm:text-sm">
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={objetSearch}
          onChange={(e) => setObjetSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          className="w-full bg-white truncate font-necoMedium backdrop-blur-sm text-[#f5ece3] font-medium px-5 py-3 border-2 border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f5ece3] focus:border-transparent transition-all placeholder-[#c4beaf]"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <Search size={24} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};