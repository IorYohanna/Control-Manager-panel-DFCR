import { RefreshCw } from "lucide-react";
import { SearchInput, TabButton } from "./Base";

export const Header = ({ currentUser, onRefresh, photo }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="text-2xl font-bold text-gray-800 font-necoBlack uppercase ">Suivi des Documents</h1>
      <p className="text-sm text-gray-500 mt-1 font-necoMedium capitalize">Correction et gestion du cycle de vie des documents</p>
    </div>
    <div className="flex items-center gap-3">
      <button
        onClick={onRefresh}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <RefreshCw size={20} className="text-gray-600" />
      </button>

      {currentUser && (
        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
          <div className="rounded-full flex items-center justify-center">
            <img src={photo} alt="" className="rounded-4xl w-10 h-10" />
          </div>
          <div className="text-left">
            <div className="font-medium text-gray-700 text-sm capitalize font-necoMedium ">{currentUser.username} {currentUser.surname}</div>
            <div className="text-xs text-gray-500 uppercase font-necoMedium">{currentUser.fonction}</div>
          </div>
        </div>
      )}
    </div>
  </div>
);


export const FilterBar = ({ activeFilter, setActiveFilter }) => {
  const filters = [
    { id: 'all', label: 'Tous les documents' },
    { id: 'en_attente', label: 'En Attente' },
    { id: 'au_service', label: 'Au Service' },
    { id: 'termine', label: 'Terminés' },
    { id: 'validation_directeur', label: 'En Validation' },
    { id: 'complet', label: 'Complet' },


  ];

  return (
    <div className="flex gap-2 mb-6">
      {filters.map((filter) => (
        <TabButton
          key={filter.id}
          active={activeFilter === filter.id}
          onClick={() => setActiveFilter(filter.id)}
        >
          {filter.label}
        </TabButton>
      ))}
    </div>
  );
};


export const SearchBar = ({ referenceSearch, setReferenceSearch, objetSearch, setObjetSearch, onSearch }) => (
  <div className="flex gap-4 mb-6">
    <SearchInput
      placeholder="Chercher une Référence"
      value={referenceSearch}
      onChange={(e) => setReferenceSearch(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && onSearch()}
    />
    <SearchInput
      placeholder="Chercher un Objet"
      value={objetSearch}
      onChange={(e) => setObjetSearch(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && onSearch()}
    />

  </div>
);