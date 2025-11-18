import { Search, Grid3x3, List, X, Download, Eye, Folder, Image, FileText, File, Sheet, MoreVertical, Info, Calendar, Clock, Star, Users, ChevronRight } from "lucide-react";

// DriveHeader Component - Copie exacte de Google Drive
// eslint-disable-next-line no-unused-vars
export function DriveHeader({ currentFolder, onSearch, onLogout, viewMode, setViewMode }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-2 rounded-t-2xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/img/drive.png" alt="Drive" className="w-10 h-10" />
          <p className="font-necoBlack text-2xl text-light-blue">Google Drive</p>
        </div>
        
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
            <input
              type="text"
              placeholder="Rechercher dans Drive"
              onChange={onSearch}
              className="w-full pl-12 pr-4 py-3 bg-[#f1f3f4] hover:bg-white hover:shadow-md focus:bg-white focus:shadow-md rounded-full text-sm text-gray-800 placeholder-gray-600 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-full transition-colors ${
              viewMode === 'grid' 
                ? 'bg-[#e8f0fe] text-light-blue' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Vue grille"
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 rounded-full transition-colors ${
              viewMode === 'list' 
                ? 'bg-[#e8f0fe] text-light-blue' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Vue liste"
          >
            <List className="w-5 h-5" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-1"></div>
          
          <button
            onClick={onLogout}
            className="px-5 py-2 text-md font-necoMedium text-dark-blue hover:bg-dark-blue hover:text-white rounded-xl transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
