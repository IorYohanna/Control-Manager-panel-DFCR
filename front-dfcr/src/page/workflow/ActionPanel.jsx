import React, { useState } from "react";
import { Send, Users, Check, X, Clock, RefreshCw } from "lucide-react";

const ActionPanel = ({ currentUser, document, services, employes, onAction }) => {
  const [selectedService, setSelectedService] = useState("");
  const [selectedEmploye, setSelectedEmploye] = useState("");
  const [typeWorkflow, setTypeWorkflow] = useState("POUR_ACTION");
  const [remarque, setRemarque] = useState("");

  const isDirecteur = currentUser.fonction === "Directeur";
  const isChefService = currentUser.fonction === "Chef de Service";
  const isEmploye = currentUser.fonction === "Employé";

  const canSendToService = isDirecteur && document.status === "EN_ATTENTE";
  const canAssignToEmploye = isChefService && (document.status === "EN_ATTENTE" || document.status === "A_FAIRE");
  const canStartWork = isEmploye && document.status === "A_FAIRE";
  const canFinishWork = isEmploye && document.status === "EN_PROGRESSION";
  const canValidateOrReject = isChefService && document.status === "TERMINE";
  const canDirecteurValidate = isDirecteur && document.status === "TERMINE";

  if (!canSendToService && !canAssignToEmploye && !canStartWork && !canFinishWork && !canValidateOrReject && !canDirecteurValidate) {
    return (
      <div className="bg-gray-50 rounded-xl shadow-sm p-8 text-center">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">Aucune action disponible pour le moment</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Disponibles</h3>

      {/* DIRECTEUR : Envoyer au service */}
      {canSendToService && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Type de transmission</label>
          <select
            className="w-full border border-gray-300 rounded-lg p-3"
            value={typeWorkflow}
            onChange={(e) => setTypeWorkflow(e.target.value)}
          >
            <option value="POUR_ACTION">Pour Action</option>
            <option value="POUR_SUIVI">Pour Suivi</option>
            <option value="POUR_INFORMATION">Pour Information</option>
          </select>

          <label className="block text-sm font-medium text-gray-700">Sélectionner le service</label>
          <select
            className="w-full border border-gray-300 rounded-lg p-3"
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
          >
            <option value="">-- Choisir un service --</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.nom}</option>
            ))}
          </select>

          <label className="block text-sm font-medium text-gray-700">Remarque</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3"
            rows={3}
            placeholder="Ajouter une remarque..."
            value={remarque}
            onChange={(e) => setRemarque(e.target.value)}
          />

          <button
            onClick={() => onAction("sendToService", { reference: document.reference, serviceId: selectedService, typeWorkflow, remarque })}
            disabled={!selectedService}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" /> Envoyer au service
          </button>
        </div>
      )}

      {/* CHEF SERVICE : Assigner à un employé */}
      {canAssignToEmploye && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Assigner à un employé</label>
          <select
            className="w-full border border-gray-300 rounded-lg p-3"
            value={selectedEmploye}
            onChange={(e) => setSelectedEmploye(e.target.value)}
          >
            <option value="">-- Choisir un employé --</option>
            {employes.map((emp) => (
              <option key={emp.matricule} value={emp.matricule}>{emp.name}</option>
            ))}
          </select>

          <label className="block text-sm font-medium text-gray-700">Instructions</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3"
            rows={3}
            placeholder="Instructions pour l'employé..."
            value={remarque}
            onChange={(e) => setRemarque(e.target.value)}
          />

          <button
            onClick={() => onAction("assignToEmploye", { reference: document.reference, employeMatricule: selectedEmploye, remarque })}
            disabled={!selectedEmploye}
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5" /> Assigner le document
          </button>
        </div>
      )}

      {/* EMPLOYÉ : Commencer / Terminer le travail */}
      {canStartWork && (
        <button
          onClick={() => onAction("startWork", { reference: document.reference })}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" /> Commencer le traitement
        </button>
      )}

      {canFinishWork && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Commentaire de fin</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3"
            rows={3}
            placeholder="Résumé du travail effectué..."
            value={remarque}
            onChange={(e) => setRemarque(e.target.value)}
          />
          <button
            onClick={() => onAction("finishWork", { reference: document.reference, remarque })}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" /> Marquer comme terminé
          </button>
        </div>
      )}

      {/* CHEF SERVICE : Valider / Refuser */}
      {canValidateOrReject && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Remarque</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3"
            rows={3}
            placeholder="Commentaire sur le travail..."
            value={remarque}
            onChange={(e) => setRemarque(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onAction("chefValidate", { reference: document.reference, remarque })}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" /> Valider
            </button>
            <button
              onClick={() => onAction("chefReject", { reference: document.reference, remarque })}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" /> Refuser
            </button>
          </div>
        </div>
      )}

      {/* DIRECTEUR : Valider / Refuser final */}
      {canDirecteurValidate && (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Décision finale</label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3"
            rows={3}
            placeholder="Commentaire final..."
            value={remarque}
            onChange={(e) => setRemarque(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onAction("directeurValidateComplet", { reference: document.reference, remarque })}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 font-medium flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" /> Valider (Complet)
            </button>
            <button
              onClick={() => onAction("directeurRejectIncomplet", { reference: document.reference, remarque })}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-medium flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" /> Refuser (Incomplet)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionPanel;
