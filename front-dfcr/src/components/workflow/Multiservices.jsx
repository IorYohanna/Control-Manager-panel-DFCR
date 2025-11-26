import { X } from "lucide-react";
import { useState } from "react";

export const MultiSelectServices = ({ label, required, selectedServices, onServicesChange, allServices }) => {
  const [currentService, setCurrentService] = useState('');

  const addService = () => {
    if (currentService && !selectedServices.includes(currentService)) {
      onServicesChange([...selectedServices, currentService]);
      setCurrentService('');
    }
  };

  const removeService = (serviceId) => {
    onServicesChange(selectedServices.filter(id => id !== serviceId));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="flex gap-2 mb-2">
        <select
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-zodiac"
          value={currentService}
          onChange={(e) => setCurrentService(e.target.value)}
        >
          <option value="">-- Sélectionner un service --</option>
          {allServices.map((service, index) => (
            <option 
              key={`${service.idService}-${index}`}
              value={service.idService}
              disabled={selectedServices.includes(service.idService)}
            >
              {service.serviceName}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={addService}
          disabled={!currentService}
          className="px-4 py-2 bg-blue-zodiac text-white font-eirene rounded-lg hover:bg-light-blue disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          Ajouter
        </button>
      </div>

      {selectedServices.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedServices.map(serviceId => {
            const service = allServices.find(s => s.idService === serviceId);
            return (
              <div
                key={serviceId}
                className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium"
              >
                <span>{service?.serviceName || serviceId}</span>
                <button
                  type="button"
                  onClick={() => removeService(serviceId)}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
      
      {selectedServices.length > 0 && (
        <p className="text-xs text-gray-500 mt-2">
          {selectedServices.length} service(s) sélectionné(s)
        </p>
      )}
    </div>
  );
};
