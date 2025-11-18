import { useEffect, useState } from "react";
import { getWorkflowsService } from "../../api/Dashboard/dashboard";

export default function WorkflowDashboard({ idService }) {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Statistiques
  const [stats, setStats] = useState({
    total: 0,
    enAttente: 0,
    enRetard: 0,
    auService: 0,
  });

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        setLoading(true);
        const data = await getWorkflowsService(idService, "au_service"); // tu peux changer le status
        setWorkflows(data);

        // Calcul des stats
        const total = data.length;
        const enAttente = data.filter(wf => wf.status === "en_attente").length;
        const termine = data.filter(wf => wf.status === "termine").length
        const enRetard = data.filter(wf => wf.status === "en_retard").length;
        const auService = data.filter(wf => wf.status === "au_service").length;

        setStats({ total, enAttente, enRetard, auService });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkflows();
  }, [idService]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;

  return (
    <div className="p-4 space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3>Total Workflows</h3>
          <p className="text-xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h3>En Attente</h3>
          <p className="text-xl font-bold">{stats.enAttente}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h3>En Retard</h3>
          <p className="text-xl font-bold">{stats.enRetard}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h3>Au Service</h3>
          <p className="text-xl font-bold">{stats.auService}</p>
        </div>
      </div>

      {/* Tableau des workflows */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Référence</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Action</th>
            <th className="border px-4 py-2">Statut</th>
            <th className="border px-4 py-2">Acteur</th>
            <th className="border px-4 py-2">Fonction</th>
            <th className="border px-4 py-2">Remarque</th>
            <th className="border px-4 py-2">Créé le</th>
          </tr>
        </thead>
        <tbody>
          {workflows.map((wf, idx) => (
            <tr key={idx} className="text-center">
              <td className="border px-4 py-2">{wf.reference}</td>
              <td className="border px-4 py-2">{wf.typeWorkflow}</td>
              <td className="border px-4 py-2">{wf.action}</td>
              <td className="border px-4 py-2">{wf.status}</td>
              <td className="border px-4 py-2">{wf.matriculeActeur}</td>
              <td className="border px-4 py-2">{wf.acteurFonction}</td>
              <td className="border px-4 py-2">{wf.remarque}</td>
              <td className="border px-4 py-2">{new Date(wf.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
