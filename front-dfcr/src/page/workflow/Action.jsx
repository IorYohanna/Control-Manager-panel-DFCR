import { FileText } from "lucide-react";
import { Input, Select, Textarea } from "./Base";

export const ActionForm = ({ action, formData, setFormData, serviceUsers }) => {
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const needsServiceSelection = ['send-to-service', 'directeur-reject'].includes(action);
  const needsEmployeSelection = ['assign-to-employe', 'chef-reject'].includes(action);
  const needsChefSelection = ['finish-work'].includes(action);
  const needsDirecteurSelection = ['chef-validate'].includes(action);
  const needsRemarque = !['start-work'].includes(action);
  const needsTypeWorkflow = ['send-to-service'].includes(action);
  const needsDirecteurValidation = ['directeur-validate'].includes(action);

  return (
    <div className="space-y-4 p-5 bg-linear-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
        <FileText size={16} className="text-blue-zodiac" />
        Paramètres de l'action
      </h3>

      <div className="space-y-4">
        {needsServiceSelection && (
          <Input
            label="ID du Service"
            required
            type="text"
            value={formData.serviceId || ''}
            onChange={(e) => updateField('serviceId', e.target.value)}
            placeholder="Entrez l'ID du service"
          />
        )}

        {needsEmployeSelection && (
          serviceUsers.length > 0 ? (
            <Select
              label="Employé"
              required
              value={formData.employeMatricule || ''}
              onChange={(e) => updateField('employeMatricule', e.target.value)}
            >
              <option value="">-- Sélectionner un employé --</option>
              {serviceUsers
                .filter(u => u.fonction?.toLowerCase().includes('employe'))
                .map(user => (
                  <option key={user.matricule} value={user.matricule}>
                    {user.username} - {user.matricule}
                  </option>
                ))}
            </Select>
          ) : (
            <Input
              label="Matricule de l'employé"
              required
              type="text"
              value={formData.employeMatricule || ''}
              onChange={(e) => updateField('employeMatricule', e.target.value)}
              placeholder="ex: 001"
            />
          )
        )}

        {needsChefSelection && (
          serviceUsers.length > 0 ? (
            <Select
              label="Chef de Service"
              required
              value={formData.chefMatricule || ''}
              onChange={(e) => updateField('chefMatricule', e.target.value)}
            >
              <option value="">-- Sélectionner un chef --</option>
              {serviceUsers
                .filter(u => u.fonction?.toLowerCase().includes('chef'))
                .map(user => (
                  <option key={user.matricule} value={user.matricule}>
                    {user.username} - {user.matricule}
                  </option>
                ))}
            </Select>
          ) : (
            <Input
              label="Matricule du chef"
              required
              type="text"
              value={formData.chefMatricule || ''}
              onChange={(e) => updateField('chefMatricule', e.target.value)}
              placeholder="Matricule du chef"
            />
          )
        )}

        {needsDirecteurSelection && (
          <Input
            label="Directeur"
            required
            type="text"
            value={formData.directeurMatricule || ''}
            onChange={(e) => updateField('directeurMatricule', e.target.value)}
            placeholder="Matricule du directeur"
          />
        )}

        {needsTypeWorkflow && (
          <Select
            label="Type de Workflow"
            required
            value={formData.typeWorkflow || ''}
            onChange={(e) => updateField('typeWorkflow', e.target.value)}
          >
            <option value="">-- Sélectionner --</option>
            <option value="NORMAL">Normal</option>
            <option value="URGENT">Urgent</option>
            <option value="PRIORITAIRE">Prioritaire</option>
          </Select>
        )}

        {needsDirecteurValidation && (
          <Select
            label="Décision du Directeur"
            required
            value={formData.decision || ''}
            onChange={(e) => updateField('decision', e.target.value)}
          >
            <option value="">-- Choisir une décision --</option>
            <option value="APPROUVE">Approuver le document</option>
            <option value="REJETE">Rejeter le document</option>
          </Select>
        )}

        {needsRemarque && (
          <Textarea
            label="Remarque"
            value={formData.remarque || ''}
            onChange={(e) => updateField('remarque', e.target.value)}
            placeholder="Ajouter une remarque ou des instructions..."
            rows={4}
          />
        )}
      </div>
    </div>
  );
};