import { FileText, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Input, Select, Textarea } from "./Base";
import { MultiSelectServices } from "./Multiservices";
import { MultiSelectEmployes } from "./MultiSelectEmployes";

export const ActionForm = ({ action, formData, setFormData, serviceUsers }) => {
  const [allServices, setAllServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  useEffect(() => {
    if (action === 'send-to-service' || action === 'directeur-reject') {
      fetchAllServices();
    }
  }, [action]);

  const fetchAllServices = async () => {
    setLoadingServices(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/services/names', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const servicesFormatted = data.map(service => {
          if (typeof service === 'object' && service.idService && service.serviceName) {
            return service;
          }
          return {
            idService: service,
            serviceName: service
          };
        });
        setAllServices(servicesFormatted);
      } else {
        console.error('Erreur lors du chargement des services');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des services:', error);
    } finally {
      setLoadingServices(false);
    }
  };

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

  const formatUserDisplay = (user) => {
    const name = user.surname || user.username || 'Sans nom';
    return `${name} (${user.matricule}) - ${user.fonction}`;
  };

  return (
    <div className="space-y-4 p-5 bg-linear-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-200 thin-scrollbar">
      <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
        <FileText size={16} className="text-blue-zodiac" />
        Paramètres de l'action
      </h3>

      <div className="space-y-4">
        {needsServiceSelection && (
          loadingServices ? (
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
              Chargement des services...
            </div>
          ) : (
            <MultiSelectServices
              label="Services"
              required
              selectedServices={formData.serviceIds || []}
              onServicesChange={(services) => updateField('serviceIds', services)}
              allServices={allServices}
            />
          )
        )}

        {needsEmployeSelection && (
          serviceUsers.length > 0 ? (
            <MultiSelectEmployes
              label="Employés"
              required
              selectedEmployes={formData.employeMatricules || []}
              onEmployesChange={(employes) => updateField('employeMatricules', employes)}
              serviceUsers={serviceUsers}
            />
          ) : (
            <div>
              <Input
                label="Matricules des employés (séparés par des virgules)"
                required
                type="text"
                value={(formData.employeMatricules || []).join(', ')}
                onChange={(e) => {
                  const matricules = e.target.value.split(',').map(m => m.trim()).filter(m => m);
                  updateField('employeMatricules', matricules);
                }}
                placeholder="ex: 001, 002, 003"
              />
              <p className="text-xs text-gray-500 mt-1">
                Aucun employé trouvé dans le service. Séparez les matricules par des virgules.
              </p>
            </div>
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
                    {formatUserDisplay(user)}
                  </option>
                ))}
            </Select>
          ) : (
            <div>
              <Input
                label="Matricule du chef"
                required
                type="text"
                value={formData.chefMatricule || ''}
                onChange={(e) => updateField('chefMatricule', e.target.value)}
                placeholder="Matricule du chef"
              />
              <p className="text-xs text-gray-500 mt-1">
                Aucun chef trouvé dans le service. Veuillez saisir le matricule manuellement.
              </p>
            </div>
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
            <option value="TRES_URGENT">Très Urgent</option>
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