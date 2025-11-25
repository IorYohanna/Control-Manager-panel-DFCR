import { useState } from "react";
import { Button } from "./Button";

const API_BASE_URL = 'http://localhost:8080';

const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});


export const CreateDossierModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/dossiers`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Erreur création dossier:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-[#24344d] mb-6">Nouveau Dossier</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#24344d] mb-2">
              Nom du dossier <span className="text-red-500">*</span>
            </label>
            <input
              type="text" // pas number pour un titre
              required
              value={formData.title} // lire formData.title
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} // mettre à jour title
              className="w-full px-4 py-3 border-2 border-[#c4beaf]/30 rounded-xl focus:ring-2 focus:ring-[#2d466e] focus:border-transparent transition-all outline-none"
              placeholder="Ex: Projets 2024"
            />

          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="flex-1"
            >
              Créer le dossier
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};