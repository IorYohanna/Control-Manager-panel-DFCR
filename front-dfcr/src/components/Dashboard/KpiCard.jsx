import React from 'react';
import { Users, Calendar, Activity, TrendingUp, TrendingDown, Target, CheckCircle } from 'lucide-react';

// ✅ KPI Card - Users
export const KpiUser = ({ userCount }) => {
  return (
    <div className="bg-white rounded-3xl p-7 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#2d466e]/10 hover:border-[#2d466e]/30">
      <div className="flex items-start justify-between mb-5">
        <div className="p-4 bg-gradient-to-br from-[#2d466e] to-[#3d5680] rounded-2xl shadow-md">
          <Users className="w-7 h-7 text-white" />
        </div>
        <span className="flex items-center text-sm font-semibold text-[#2d466e] bg-[#2d466e]/10 px-3 py-1.5 rounded-full">
          <Activity className="w-4 h-4 mr-1.5" />
          Actifs
        </span>
      </div>
      <h3 className="text-4xl font-bold text-[#2d466e] mb-2">{userCount || 0}</h3>
      <p className="text-[#73839e] text-sm font-medium">Utilisateurs du service</p>
    </div>
  );
};

// ✅ KPI Card - Events Month
export const KpiEventMonth = ({ monthEventsCount, eventTrend }) => {
  return (
    <div className="bg-white rounded-3xl p-7 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#73839e]/10 hover:border-[#73839e]/30">
      <div className="flex items-start justify-between mb-5">
        <div className="p-4 bg-gradient-to-br from-[#73839e] to-[#5a6b8a] rounded-2xl shadow-md">
          <Calendar className="w-7 h-7 text-white" />
        </div>
        <span className={`flex items-center text-sm font-semibold px-3 py-1.5 rounded-full ${
          eventTrend >= 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
        }`}>
          {eventTrend >= 0 ? <TrendingUp className="w-4 h-4 mr-1.5" /> : <TrendingDown className="w-4 h-4 mr-1.5" />}
          {eventTrend >= 0 ? '+' : ''}{eventTrend}%
        </span>
      </div>
      <h3 className="text-4xl font-bold text-[#2d466e] mb-2">{monthEventsCount}</h3>
      <p className="text-[#73839e] text-sm font-medium">Événements ce mois</p>
    </div>
  );
};

// ✅ KPI Card - Completion Rate
export const KpiCompletionRate = ({ completionRate }) => {
  return (
    <div className="bg-gradient-to-br from-[#2d466e] to-[#3d5680] rounded-3xl p-7 shadow-lg hover:shadow-xl transition-all duration-300 text-white">
      <div className="flex items-start justify-between mb-5">
        <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
          <Target className="w-7 h-7 text-white" />
        </div>
        <span className="flex items-center text-sm font-semibold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <CheckCircle className="w-4 h-4 mr-1.5" />
          Objectif
        </span>
      </div>
      <h3 className="text-4xl font-bold mb-2">{completionRate}%</h3>
      <p className="text-white/80 text-sm font-medium">Taux de complétion</p>
    </div>
  );
};

// ✅ KPI Card - Total Events
export const KpiTotalEvent = ({ totalEvents }) => {
  return (
    <div className="bg-white rounded-3xl p-7 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#2d466e]/10 hover:border-[#2d466e]/30">
      <div className="flex items-start justify-between mb-5">
        <div className="p-4 bg-gradient-to-br from-[#f5ece3] to-[#e8dfd0] rounded-2xl border-2 border-[#2d466e]/20">
          <Calendar className="w-7 h-7 text-[#2d466e]" />
        </div>
        <span className="flex items-center text-sm font-semibold text-[#73839e] bg-[#f5ece3] px-3 py-1.5 rounded-full">
          Total
        </span>
      </div>
      <h3 className="text-4xl font-bold text-[#2d466e] mb-2">{totalEvents}</h3>
      <p className="text-[#73839e] text-sm font-medium">Événements totaux</p>
    </div>
  );
};