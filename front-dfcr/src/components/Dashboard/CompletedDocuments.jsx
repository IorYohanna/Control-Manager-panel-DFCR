import { useEffect, useState } from "react";
import { FileText, Calendar, Loader2, Filter, TrendingUp } from "lucide-react";
import { getCompletedDocuments } from "../../api/Dashboard/dashboard";

export const CompletedDocuments = ({ idService }) => {
  const currentDate = new Date();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [error, setError] = useState(null);
  const [useFilter, setUseFilter] = useState(false);

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  // Générer les années disponibles (5 ans avant et après l'année actuelle)
  const availableYears = Array.from(
    { length: 11 }, 
    (_, i) => currentDate.getFullYear() - 5 + i
  );

  async function fetchDocs() {
    if (!idService) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getCompletedDocuments(
        idService, 
        useFilter ? month : null, 
        useFilter ? year : null
      );
      setDocs(data || []);
    } catch (e) {
      console.error("Erreur de chargement:", e);
      setError("Impossible de charger les documents complétés");
      setDocs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDocs();
  }, [idService, month, year, useFilter]);

  const resetFilter = () => {
    setMonth(currentDate.getMonth() + 1);
    setYear(currentDate.getFullYear());
    setUseFilter(false);
  };

  return (
    <div className="col-span-1 md:col-span-3 bg-linear-to-br from-[#2d466e] to-[#1e2f4d] rounded-3xl p-6 shadow-2xl border border-white/10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
            <FileText className="text-white w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Documents Complétés</h3>
            <p className="text-white/60 text-sm">
              {useFilter 
                ? `${monthNames[month - 1]} ${year}` 
                : "Tous les documents"}
            </p>
          </div>
        </div>

        {/* Toggle Filter */}
        <button
          onClick={() => setUseFilter(!useFilter)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
            useFilter 
              ? "bg-white text-[#2d466e]" 
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          <Filter className="w-4 h-4" />
          {useFilter ? "Filtrage actif" : "Filtrer par période"}
        </button>
      </div>

      {/* Filtres de date */}
      {useFilter && (
        <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex flex-wrap items-center gap-3">
            <Calendar className="text-white/60 w-5 h-5" />
            
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="bg-white/10 text-white px-4 py-2 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none transition-all"
            >
              {monthNames.map((name, i) => (
                <option key={i} value={i + 1} className="text-black bg-white">
                  {name}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-white/10 text-white px-4 py-2 rounded-xl border border-white/20 focus:border-white/40 focus:outline-none transition-all"
            >
              {availableYears.map((y) => (
                <option key={y} value={y} className="text-black bg-white">
                  {y}
                </option>
              ))}
            </select>

            <button
              onClick={resetFilter}
              className="ml-auto text-white/60 hover:text-white text-sm underline transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      )}

      {/* Statistiques */}
      {!loading && docs.length > 0 && (
        <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
          <TrendingUp className="text-green-400 w-5 h-5" />
          <span className="text-white font-semibold text-lg">{docs.length}</span>
          <span className="text-white/70">document{docs.length > 1 ? 's' : ''} complété{docs.length > 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-white">
          <Loader2 className="animate-spin w-10 h-10 mb-3" />
          <p className="text-white/60">Chargement des documents...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-300">
          {error}
        </div>
      )}

      {/* Aucune donnée */}
      {!loading && !error && docs.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-white/40 w-10 h-10" />
          </div>
          <p className="text-white/60 text-lg">
            {useFilter 
              ? `Aucun document complété en ${monthNames[month - 1]} ${year}`
              : "Aucun document complété disponible"}
          </p>
        </div>
      )}

      {/* Liste des docs */}
      {!loading && !error && docs.length > 0 && (
        <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {docs.map((d, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                {/* Informations du document */}
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold text-lg mb-1">
                        {d.reference}
                      </h4>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-white/10 px-3 py-1 rounded-full text-white/80">
                          {d.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Métadonnées */}
                <div className="text-right sm:text-left sm:min-w-[180px]">
                  <p className="text-white/80 font-medium mb-1">
                    {d.creatorName}
                  </p>
                  <p className="text-white/60 text-xs">
                    📅 {new Date(d.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};