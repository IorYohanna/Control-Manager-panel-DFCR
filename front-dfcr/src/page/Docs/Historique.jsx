import React, { useEffect, useState } from "react";

// Composant React (JavaScript pur) + TailwindCSS pour afficher les documents triés
function Historique({ apiBase = "http://localhost:8080", tokenKey = "token" }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem(tokenKey);
      const res = await fetch(`${apiBase}/documents/historique`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Erreur ${res.status}: ${text}`);
      }

      const data = await res.json();
      const normalized = (Array.isArray(data) ? data : [])
        .map((d) => ({ ...d, createdAt: d.createdAt ? new Date(d.createdAt) : null }))
        .sort((a, b) => {
          if (!a.createdAt && !b.createdAt) return 0;
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return b.createdAt - a.createdAt;
        });

      setDocuments(normalized);
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Historique des documents</h2>
        <button
          onClick={fetchDocuments}
          className="px-3 py-1 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700"
        >
          Actualiser
        </button>
      </div>

      {loading && <div className="p-6 bg-gray-50 rounded-md text-center">Chargement...</div>}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md mb-4">
          {error}
        </div>
      )}
      {!loading && documents.length === 0 && !error && (
        <div className="p-6 bg-gray-50 rounded-md text-center">Aucun document trouvé.</div>
      )}

      <div className="grid gap-4">
        {documents.map((doc) => (
          <article key={doc.reference} className="p-4 bg-white rounded-2xl shadow-sm border">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium">{doc.objet || "(Sans objet)"}</h3>
                <p className="text-sm text-gray-500">Réf: <span className="font-mono">{doc.reference}</span></p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{doc.type}</p>
                <p className="text-xs text-gray-400">{doc.status}</p>
              </div>
            </header>
            <div className="mt-2 text-sm text-gray-700">{doc.corps}</div>
            <footer className="mt-3 text-xs text-gray-500 flex justify-between">
              <span>Créé par: {doc.creatorName || "Inconnu"}</span>
              <span>
                {doc.createdAt ? new Date(doc.createdAt).toLocaleString() : "Date inconnue"}
              </span>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Historique;