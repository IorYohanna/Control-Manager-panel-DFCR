import React from 'react';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Zap, Users, Calendar, Activity } from 'lucide-react';

const toDate = (str) => new Date(str);
const now = new Date()



const formatDate = (dateStr) => {
    const d = toDate(dateStr);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (dateStr) => {
    const d = toDate(dateStr);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

// ✅ Loading Spinner
export const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-[#f5ece3] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#2d466e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl font-semibold text-[#2d466e]">Chargement...</p>
      </div>
    </div>
  );
};

// ✅ Service Header
export const ServiceHeader = ({ serviceName }) => {
  return (
    <div className="mt-25 flex items-center justify-between">
      <h1 className="text-5xl font-bold text-[#2d466e] mb-3 tracking-tight">
        {serviceName}
      </h1>
      <p className="text-[#73839e] text-lg">Dashboard de pilotage et suivi</p>
    </div>
  );
};

// ✅ Recent Activity
export const RecentActivity = ({ activities }) => {
  return (
    <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#2d466e]/10">
      <div className="flex items-center mb-7">
        <div className="p-3 bg-linear-to-br from-[#2d466e] to-[#3d5680] rounded-xl mr-3">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-[#2d466e]">Activité Récente</h3>
      </div>
      
      {activities.length === 0 ? (
        <p className="text-[#73839e] text-center py-12 font-medium">Aucune activité récente</p>
      ) : (
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 pb-5 border-b-2 border-[#f5ece3] last:border-0">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#2d466e] to-[#73839e] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md">
                {activity.user.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#2d466e] font-medium">
                  <span className="font-bold">{activity.user}</span>
                  {' '}{activity.action}{' '}
                  <span className="font-bold text-[#73839e]">{activity.item}</span>
                </p>
                <p className="text-xs text-[#73839e] mt-1.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};