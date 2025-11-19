import { FileText, Clock, CheckCircle, AlertCircle, XCircle, Award } from "lucide-react";
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

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;
  if (!stats) return <div>Aucune donnée disponible</div>;

  const docsStats = {
    total: stats.totalWorkflows,
    pending: stats.enAttente,
    auService: stats.auService,
    assigne: stats.assigne,
    enTraitement: stats.enTraitement,
    termine: stats.termine,
    validationDirecteur: stats.validationDirecteur,
    complet: stats.complet,
  };

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-[#141f31] rounded-4xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#2d466e]/10">
      <div className="flex items-center justify-between ">

        <h3 className="text-xl font-eirene text-white flex items-center">
          Statut des Workflows
        </h3>
      </div>

      <div className="flex items-center justify-between px-5 text-white mb-8">
        <div className="flex items-center">
          <h2 className="text-[48px] font-bold leading-none">
            {docsStats.total}
          </h2>
          <p className="ml-3 text-[12px] font-eirene opacity-80 leading-tight text-[#becce4]">
            Nombre total <br/> de documents
          </p>
        </div>

        <div className="flex items-center">
          <h2 className="text-[48px] font-bold leading-none">
            {docsStats.total}
          </h2>
          <p className="ml-3 text-[11px] font-eirene opacity-80 leading-tight text-[#becce4]">
            Nombre total <br/> de documents
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-5">
        <div className="flex flex-col items-center bg-linear-to-br from-[#f5ece3] to-white p-2 w-full rounded-2xl">
          <Clock className="w-6 h-6 text-black mt-2" />
          <h1 className="text-[35px] font-necomedium">{docsStats.pending}</h1>
          <p className="text-[12px] font-eirene ">En Attente</p>
        </div>
        <div className="flex flex-col items-center bg-linear-to-br from-[#f5ece3] to-white p-2 w-full rounded-2xl">
          <CheckCircle className="w-6 h-6 text-black mt-2" />
          <h1 className="text-[35px] font-necomedium">{docsStats.auService}</h1>
          <p className="text-[12px] font-eirene ">Au Service</p>
        </div>
        <div className="flex flex-col items-center bg-linear-to-br from-[#f5ece3] to-white p-2 w-full rounded-2xl">
          <XCircle className="w-6 h-6 text-black mt-2" />
          <h1 className="text-[35px] font-necomedium">{docsStats.enTraitement}</h1>
          <p className="text-[12px] font-eirene ">En Traitement</p>
        </div>
        
      </div>

      {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        <div className="bg-linear-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 border-2 border-amber-200/50 hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <Clock className="w-6 h-6 text-amber-600" />
            <span className="text-3xl font-bold text-amber-700">{docsStats.pending}</span>
          </div>
          <p className="text-sm text-amber-800 mt-3 font-semibold">En Attente</p>
        </div>

        <div className="bg-linear-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border-2 border-green-200/50 hover:border-green-300 transition-all">
          <div className="flex items-center justify-between">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <span className="text-3xl font-bold text-green-700">{docsStats.auService}</span>
          </div>
          <p className="text-sm text-green-800 mt-3 font-semibold">Au Service</p>
        </div>

        <div className="bg-linear-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border-2 border-blue-200/50 hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <AlertCircle className="w-6 h-6 text-blue-600" />
            <span className="text-3xl font-bold text-blue-700">{docsStats.assigne}</span>
          </div>
          <p className="text-sm text-blue-800 mt-3 font-semibold">Assignés</p>
        </div>

        <div className="bg-linear-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 border-2 border-purple-200/50 hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <XCircle className="w-6 h-6 text-purple-600" />
            <span className="text-3xl font-bold text-purple-700">{docsStats.enTraitement}</span>
          </div>
          <p className="text-sm text-purple-800 mt-3 font-semibold">En Traitement</p>
        </div>

        <div className="bg-linear-to-br from-pink-50 to-pink-100/50 rounded-2xl p-6 border-2 border-pink-200/50 hover:border-pink-300 transition-all">
          <div className="flex items-center justify-between">
            <CheckCircle className="w-6 h-6 text-pink-600" />
            <span className="text-3xl font-bold text-pink-700">{docsStats.termine}</span>
          </div>
          <p className="text-sm text-pink-800 mt-3 font-semibold">Terminés</p>
        </div>

        <div className="bg-linear-to-br from-yellow-50 to-yellow-100/50 rounded-2xl p-6 border-2 border-yellow-200/50 hover:border-yellow-300 transition-all">
          <div className="flex items-center justify-between">
            <Award className="w-6 h-6 text-yellow-600" />
            <span className="text-3xl font-bold text-yellow-700">{docsStats.complet}</span>
          </div>
          <p className="text-sm text-yellow-800 mt-3 font-semibold">Complet</p>
        </div>
      </div> */}
    </div>
  );
};


