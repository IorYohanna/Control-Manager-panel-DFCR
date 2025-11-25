import { Search, Grid3x3, List, X, Download, Eye, Folder, Image, FileText, File, Sheet, MoreVertical, Info, Calendar, Clock, Star, Users, ChevronRight } from "lucide-react";

// DriveHeader Component - Copie exacte de Google Drive
// eslint-disable-next-line no-unused-vars
export function DriveHeader({ currentFolder, onSearch, onLogout, viewMode, setViewMode }) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2 rounded-t-2xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src="/img/drive.png" alt="Drive" className="w-8 h-8 sm:w-10 sm:h-10" />
          <p className="font-necoBlack text-xl sm:text-2xl text-light-blue truncate">Google Drive</p>
        </div>

        <div className="flex-1 max-w-full sm:max-w-2xl w-full mt-2 sm:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            <input
              type="text"
              placeholder="Rechercher dans Drive"
              onChange={onSearch}
              className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 bg-beige-creme hover:bg-white hover:shadow-md focus:bg-white focus:shadow-md rounded-full text-sm text-gray-800 placeholder-gray-600 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 sm:p-2.5 rounded-full transition-colors ${
              viewMode === 'grid' ? 'bg-[#e8f0fe] text-light-blue' : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Vue grille"
          >
            <Grid3x3 className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 sm:p-2.5 rounded-full transition-colors ${
              viewMode === 'list' ? 'bg-[#e8f0fe] text-light-blue' : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Vue liste"
          >
            <List className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1 hidden sm:block"></div>
          <button
            onClick={onLogout}
            className="px-3 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-md font-necoMedium text-dark-blue hover:bg-dark-blue hover:text-white rounded-xl transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}

