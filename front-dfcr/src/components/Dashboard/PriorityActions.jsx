import { useEffect, useState } from "react";
import { getDashboardStats } from "../../api/Dashboard/dashboard";
import { Zap } from "lucide-react";

export const PriorityActions = ({ idService }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      if (!idService) return;
      try {
        const data = await getDashboardStats(idService);
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, [idService]);

  if (!stats) return null;

  const priorities = [
    { title: "Documents en attente", count: stats.enAttente, urgent: stats.enAttente > 5 },
    { title: "Documents en retard", count: stats.termine, urgent: stats.termine > 0 },
    { title: "Workflows à valider par le directeur", count: stats.validationDirecteur, urgent: stats.validationDirecteur > 0 },
  ];

  return (
    <div className="md:col-span-2 lg:col-span-1 bg-linear-to-br from-red-50 via-orange-50 to-amber-50 rounded-3xl p-7 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-red-200/50">
      <div className="flex items-center mb-7">
        <div className="p-3 bg-linear-to-br from-red-500 to-orange-500 rounded-xl mr-3 shadow-md">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-[#2d466e]">Actions Prioritaires</h3>
      </div>
      
      <div className="space-y-4">
        {priorities.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border-2 border-red-100 hover:border-red-200 transition-all shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-[#2d466e]">{item.title}</p>
              {item.urgent && (
                <span className="px-3 py-1 bg-linear-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-sm">
                  Urgent
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-[#2d466e]">{item.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
