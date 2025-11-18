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


// ✅ Team Members
export const TeamMembers = ({ users }) => {
  return (
    <div className="bg-white rounded-3xl p-7 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#2d466e]/10">
      <div className="flex items-center justify-between mb-7">
        <h3 className="text-xl font-bold text-[#2d466e]">Équipe</h3>
        <span className="text-sm font-semibold text-[#73839e] bg-[#f5ece3] px-4 py-2 rounded-full">
          {users.length} membres
        </span>
      </div>
      
      <div className="space-y-4">
        {users.slice(0, 4).map((user, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#f5ece3]/50 transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden bg-gray-200">
                {user.photoProfil ? (
                  <img
                    src={`data:image/jpeg;base64,${user.photoProfil}`}
                    alt={user.fullName || `${user.username || ''} ${user.surname || ''}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<span class="text-4xl text-gray-500">👤</span>';
                    }}
                  />
                ) : (
                  <span className="text-4xl text-gray-500">👤</span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2d466e]">
                  {user.fullName || `${user.username || ''} ${user.surname || ''}`}
                </p>
                <p className="text-xs text-[#73839e] font-medium">
                  {user.fonction || 'Membre'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {users.length > 4 && (
        <button className="w-full mt-5 text-sm text-[#2d466e] hover:text-[#3d5680] font-semibold bg-[#f5ece3] hover:bg-[#e8dfd0] py-3 rounded-2xl transition-all">
          Voir tous les membres ({users.length})
        </button>
      )}
    </div>
  );
};

// ✅ Upcoming Events
export const UpcomingEvents = ({ upcomingEvents, todayEvents }) => {
  const now = new Date();
  
  return (
    <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[#2d466e]/10">
      <div className="flex items-center justify-between mb-7">
        <h3 className="text-xl font-bold text-[#2d466e] flex items-center">
          <div className="p-3 bg-linear-to-br from-[#73839e] to-[#5a6b8a] rounded-xl mr-3">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          Événements à venir
        </h3>
        <span className="text-sm font-semibold text-[#73839e] bg-[#f5ece3] px-4 py-2 rounded-full">
          {upcomingEvents.length} événements
        </span>
      </div>
      
      {upcomingEvents.length === 0 ? (
        <p className="text-[#73839e] text-center py-12 font-medium">Aucun événement à venir</p>
      ) : (
        <div className="space-y-4">
          {upcomingEvents.map((event) => {
            const eventDate = new Date(event.startTime);
            const isToday = todayEvents.some(e => e.idEvent === event.idEvent);
            const isTomorrow = eventDate.toDateString() === new Date(now.getTime() + 86400000).toDateString();
            
            return (
              <div key={event.idEvent} className="flex items-center justify-between p-4 rounded-2xl hover:bg-[#f5ece3]/50 transition-all border-2 border-transparent hover:border-[#2d466e]/10">
                <div className="flex items-center space-x-5">
                  <div className={`w-1.5 h-14 rounded-full shadow-sm ${
                    isToday ? 'bg-linear-to-b from-red-500 to-red-600' : 
                    isTomorrow ? 'bg-linear-to-b from-orange-500 to-orange-600' : 
                    'bg-linear-to-b from-[#2d466e] to-[#73839e]'
                  }`} />
                  <div>
                    <p className="font-semibold text-[#2d466e] text-base">{event.title}</p>
                    <p className="text-xs text-[#73839e] mt-1.5 font-medium">
                      {formatDate(event.startTime)} à {formatTime(event.startTime)}
                    </p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-sm ${
                  isToday ? 'bg-linear-to-r from-red-500 to-red-600 text-white' :
                  isTomorrow ? 'bg-linear-to-r from-orange-500 to-orange-600 text-white' :
                  'bg-linear-to-r from-[#2d466e] to-[#73839e] text-white'
                }`}>
                  {isToday ? "Aujourd'hui" : isTomorrow ? 'Demain' : 'À venir'}
                </span>
              </div>
            );
          })}
        </div>
      )}
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