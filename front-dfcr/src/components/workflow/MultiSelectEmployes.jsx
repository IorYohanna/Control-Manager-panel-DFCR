import { X } from "lucide-react";
import { useState } from "react";

export const MultiSelectEmployes = ({ label, required, selectedEmployes, onEmployesChange, serviceUsers }) => {
  const [currentEmploye, setCurrentEmploye] = useState('');

  const addEmploye = () => {
    if (currentEmploye && !selectedEmployes.includes(currentEmploye)) {
      onEmployesChange([...selectedEmployes, currentEmploye]);
      setCurrentEmploye('');
    }
  };

  const removeEmploye = (matricule) => {
    onEmployesChange(selectedEmployes.filter(m => m !== matricule));
  };

  const formatUserDisplay = (user) => {
    const name = user.surname || user.username || 'Sans nom';
    return `${name} (${user.matricule}) - ${user.fonction}`;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="flex gap-2 mb-2">
        <select
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={currentEmploye}
          onChange={(e) => setCurrentEmploye(e.target.value)}
        >
          <option value="">-- Sélectionner un employé --</option>
          {serviceUsers
            .filter(u => u.fonction?.toLowerCase().includes('employe') ||
              u.fonction?.toLowerCase().includes('employé'))
            .map(user => (
              <option 
                key={user.matricule} 
                value={user.matricule}
                disabled={selectedEmployes.includes(user.matricule)}
              >
                {formatUserDisplay(user)}
              </option>
            ))}
        </select>
        <button
          type="button"
          onClick={addEmploye}
          disabled={!currentEmploye}
          className="px-4 py-2 bg-blue-zodiac text-white rounded-md hover:bg-light-blue disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          Ajouter
        </button>
      </div>

      {selectedEmployes.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedEmployes.map(matricule => {
            const user = serviceUsers.find(u => u.matricule === matricule);
            return (
              <div
                key={matricule}
                className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium"
              >
                <span>{user ? formatUserDisplay(user) : matricule}</span>
                <button
                  type="button"
                  onClick={() => removeEmploye(matricule)}
                  className="hover:bg-green-200 rounded-full p-0.5 transition"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
      
      {selectedEmployes.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          {selectedEmployes.length} employé(s) sélectionné(s)
        </p>
      )}
    </div>
  );
};