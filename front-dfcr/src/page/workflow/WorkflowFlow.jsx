import React from "react";
import { Clock, Check, X, Users, ArrowRight, RefreshCw, Send } from "lucide-react";

const WorkflowFlow = ({ workflows }) => {
  if (!workflows || workflows.length === 0) {
    return (
      <div className="bg-gray-50 rounded-xl shadow-sm p-6 text-center">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">Aucun historique pour ce document</p>
      </div>
    );
  }

  const getIcon = (action) => {
    switch (action) {
      case "RECEVOIR": return <Clock className="w-5 h-5 text-yellow-500" />;
      case "ENVOYER": return <Send className="w-5 h-5 text-blue-500" />;
      case "ASSIGNER": return <Users className="w-5 h-5 text-purple-500" />;
      case "COMMENCER": return <RefreshCw className="w-5 h-5 text-blue-600" />;
      case "FINIR": return <Check className="w-5 h-5 text-green-500" />;
      case "VALIDER": return <Check className="w-5 h-5 text-green-600" />;
      case "REFUSER": return <X className="w-5 h-5 text-red-600" />;
      default: return <ArrowRight className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique du Workflow</h3>
      <ul className="relative border-l border-gray-200 ml-4">
        {workflows.map((wf, idx) => (
          <li key={idx} className="mb-6 ml-6">
            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-white border border-gray-300">
              {getIcon(wf.action)}
            </span>
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-sm font-semibold text-gray-900">{wf.acteur?.name} ({wf.acteur?.fonction})</h4>
              <span className="text-xs text-gray-500">{new Date(wf.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-600">{wf.typeWorkflow} - {wf.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkflowFlow;
