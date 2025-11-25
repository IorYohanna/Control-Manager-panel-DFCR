import { useEffect, useState } from "react";
import { FileText, Calendar, Filter, CheckCircle2, SearchX } from "lucide-react";
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

  // Années disponibles (2 avant, 1 après pour rester compact)
  const availableYears = Array.from(
    { length: 4 }, 
    (_, i) => currentDate.getFullYear() - 2 + i
  );

  useEffect(() => {
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
        console.error("Erreur chargement docs:", e);
        setError("Impossible de charger les données");
        setDocs([]);
      } finally {
        // Petit délai artificiel pour éviter le flash si l'API est trop rapide (optionnel)
        setTimeout(() => setLoading(false), 300);
      }
    }
    fetchDocs();
  }, [idService, month, year, useFilter]);

  // --- RENDER ---

  return (
    <div className="col-span-1 md:col-span-2 h-full flex flex-col relative group">
      <div className="h-full flex flex-col backdrop-blur-xl bg-[#f5ece3]/70 rounded-xl p-6 lg:p-8 shadow-lg border border-white/50 hover:border-white/60 transition-all duration-100 hover:shadow-xl">
        
        {/* Header & Filtres */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl text-[#2d466e] font-bold font-dropline flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Validations
            </h3>
            <p className="text-xs text-[#73839e] font-eirene mt-1">
               {useFilter 
                  ? `Archives : ${monthNames[month - 1]} ${year}` 
                  : "Derniers documents validés"}
            </p>
          </div>

          {/* Bouton Toggle Filtre */}
          <button
            onClick={() => setUseFilter(!useFilter)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              useFilter 
                ? "bg-[#2d466e] text-white border-[#2d466e]" 
                : "bg-white/40 text-[#2d466e] border-white/60 hover:bg-white/60"
            }`}
          >
            <Filter className="w-3 h-3" />
            {useFilter ? "Filtres actifs" : "Filtrer"}
          </button>
        </div>

        {/* Zone de contrôles des filtres (Affichage conditionnel) */}
        {useFilter && (
          <div className="mb-6 p-3 bg-white/40 rounded-lg border border-white/40 animate-in fade-in slide-in-from-top-2 duration-100">
            <div className="flex flex-wrap items-center gap-2">
              <Calendar className="text-[#2d466e] w-4 h-4 ml-1" />
              
              {/* Select Mois */}
              <div className="relative">
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="appearance-none bg-white px-3 py-1.5 pr-8 rounded-lg text-sm font-medium text-[#2d466e] focus:outline-none focus:ring-2 focus:ring-[#2d466e]/20 cursor-pointer hover:bg-gray-50"
                >
                  {monthNames.map((name, i) => (
                    <option key={i} value={i + 1}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Select Année */}
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="appearance-none bg-white px-3 py-1.5 pr-8 rounded-lg text-sm font-medium text-[#2d466e] focus:outline-none focus:ring-2 focus:ring-[#2d466e]/20 cursor-pointer hover:bg-gray-50"
                >
                  {availableYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => { setUseFilter(false); setMonth(currentDate.getMonth() + 1); setYear(currentDate.getFullYear()); }}
                className="ml-auto text-xs text-[#2d466e] hover:underline px-2"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        )}

        {/* Contenu Principal (Liste ou Loading) */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-[200px]">
          
          {/* SKELETON LOADING */}
          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-white/30 rounded-lg border border-white/20"></div>
              ))}
            </div>
          ) : error ? (
            /* ERROR STATE */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-red-50/50 rounded-lg border border-red-100">
              <p className="text-red-500 font-bold text-sm">{error}</p>
            </div>
          ) : docs.length === 0 ? (
            /* EMPTY STATE */
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
              <div className="w-16 h-16 bg-[#2d466e]/5 rounded-full flex items-center justify-center mb-3">
                <SearchX className="w-8 h-8 text-[#2d466e]" />
              </div>
              <p className="text-[#2d466e] font-medium text-sm">Aucun document trouvé</p>
              <p className="text-[#73839e] text-xs">Essayez de changer la période</p>
            </div>
          ) : (
            /* LISTE DES DOCUMENTS */
            <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-[#2d466e]/10 scrollbar-track-transparent hover:scrollbar-thumb-[#2d466e]/20">
              {docs.map((d, index) => (
                <div
                  key={index}
                  className="group/card relative bg-white/40 hover:bg-white/80 rounded-lg p-4 border border-white/40 hover:border-white/80 transition-all duration-200 hover:shadow-sm hover:-translate-x-1"
                >
                  <div className="flex justify-between items-start gap-3">
                    
                    {/* Icone & Info */}
                    <div className="flex items-start gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#2d466e] shadow-sm shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      
                      <div className="min-w-0">
                        <h4 className="text-[#2d466e] font-bold text-sm truncate pr-2 leading-tight">
                          {d.reference || "Sans référence"}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                             <span className="text-[10px] font-bold bg-[#2d466e]/5 text-[#2d466e] px-2 py-0.5 rounded-md border border-[#2d466e]/10">
                                {d.type || "Document"}
                             </span>
                             <span className="text-[11px] text-[#73839e] truncate">
                                par {d.creatorName?.split(' ')[0]}
                             </span>
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-bold text-[#73839e] uppercase bg-white/50 px-2 py-1 rounded-lg">
                        {new Date(d.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};