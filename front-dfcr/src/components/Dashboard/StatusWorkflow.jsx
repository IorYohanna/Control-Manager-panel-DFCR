import { Clock, CheckCircle, XCircle, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/Dashboard/dashboard";

export const StatusWorkflow = ({ idService }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const data = await getDashboardStats(idService);
        setStats(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les statistiques");
      } finally {
        setLoading(false);
      }
    }
    if (idService) fetchStats();
  }, [idService]);

  // 1. SKELETON LOADER (Meilleure UX pendant l'attente)
  if (loading) return (
    <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-[#2d466e] rounded-lg p-8 shadow-lg border-2 border-[#2d466e]/10 animate-pulse h-80">
      <div className="h-6 w-48 bg-white/10 rounded mb-8"></div>
      <div className="h-16 w-24 bg-white/10 rounded mb-10"></div>
      <div className="grid grid-cols-3 gap-5">
        <div className="h-24 bg-white/10 rounded-lg"></div>
        <div className="h-24 bg-white/10 rounded-lg"></div>
        <div className="h-24 bg-white/10 rounded-lg"></div>
      </div>
    </div>
  );

  if (error) return <div className="col-span-2 p-4 text-red-500 bg-red-50 rounded-lg">{error}</div>;
  if (!stats) return null;

  const docsStats = {
    total: stats.totalWorkflows || 0,
    pending: stats.enAttente || 0,
    auService: stats.auService || 0,
    enTraitement: (stats.enTraitement || 0) + (stats.assigne || 0),
  };

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-[#2d466e] rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#2d466e]/10 flex flex-col justify-between">

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-eirene text-white flex items-center gap-2 opacity-90">
          <FileText className="w-5 h-5 opacity-70" /> Statut des Suivis des Documents
        </h3>
      </div>

      <div className="flex items-end mb-8 px-2">
        <h2 className="text-[56px] font-bold leading-none text-white tracking-tight">
          {docsStats.total}
        </h2>
        <div className="ml-4 mb-2">
          <p className="text-sm font-eirene text-[#becce4] leading-tight">
            Documents <br /> gérés au total
          </p>
        </div>
        <div className="ml-auto h-1 w-24 bg-white/10 rounded-full mb-4"></div>
      </div>

      <div className="grid grid-cols-3 gap-4 sm:gap-5">
        <div className="flex flex-col items-center bg-linear-to-br from-[#f5ece3] to-white p-3 rounded-lg shadow-sm hover:-translate-y-1 transition-transform duration-300 cursor-default group">
          <Clock className="w-6 h-6 mt-1 mb-1 group-hover:scale-110 transition-transform" />
          <h1 className="text-3xl font-necomedium text-[#2d466e]">{docsStats.pending}</h1>
          <p className="text-[11px] font-eirene text-gray-500 font-medium uppercase tracking-wide">En Attente</p>
        </div>

        <div className="flex flex-col items-center bg-linear-to-br from-[#f5ece3] to-white p-3 rounded-lg shadow-sm hover:-translate-y-1 transition-transform duration-300 cursor-default group">
          <CheckCircle className="w-6 h-6 mt-1 mb-1 group-hover:scale-110 transition-transform" />
          <h1 className="text-3xl font-necomedium text-[#2d466e]">{docsStats.auService}</h1>
          <p className="text-[11px] font-eirene text-gray-500 font-medium uppercase tracking-wide">Au Service</p>
        </div>

        <div className="flex flex-col items-center bg-linear-to-br from-[#f5ece3] to-white p-3 rounded-lg shadow-sm hover:-translate-y-1 transition-transform duration-300 cursor-default group">
          <XCircle className="w-6 h-6 mt-1 mb-1 group-hover:scale-110 transition-transform" />
          <h1 className="text-3xl font-necomedium text-[#2d466e]">{docsStats.enTraitement}</h1>
          <p className="text-[11px] font-eirene text-gray-500 font-medium uppercase tracking-wide">Traitement</p>
        </div>

      </div>
    </div>
  );
};


