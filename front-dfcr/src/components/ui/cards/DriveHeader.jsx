import { Search, Grid, List, Upload, Outdent } from "lucide-react";

export function DriveHeader({ currentFolder, onSearch, onLogout, viewMode, setViewMode }) {
  return (
    <div className=" border-b rounded-t-2xl border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="/img/google-drive.png" alt="Drive" className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-gray-800">{currentFolder.name}</h1>
        </div>
        

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              onChange={onSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-light-blue"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <Grid className="w-5 h-5"/>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100 text-black'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>


          <button
            onClick={onLogout}
            className="flex gap-2 items-center px-4 py-2 text-gray-600 hover:bg-white font-necoBlack text-xl rounded-lg"
          >
            <img src="/img/se-deconnecter.png" alt="" className="w-4 h-4"/>
            Déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
          