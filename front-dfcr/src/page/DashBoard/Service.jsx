import React, { useState, useEffect } from 'react';
import { getServiceStatistics, getEventsService } from "../../api/Dashboard/dashboard";
import { KpiUser, KpiCompletionRate, KpiEventMonth, KpiTotalEvent } from '../../components/Dashboard/KpiCard';
import { RecentActivity } from '../../components/Dashboard/OtherCard';
import { StatusWorkflow } from '../../components/Dashboard/StatusWorkflow';
import TeamMembers from '../../components/Dashboard/TeamMembers';
import { UpcomingEvents } from '../../components/Dashboard/UpcomingEvents';
import Example from '../../components/Dashboard/LineChartCard';

const Service = ({ activeService }) => {
  const [serviceData, setServiceData] = useState(null);
  const [events, setEvents] = useState([]);
  const [rawEvents, setRawEvents] = useState([]); // 👈 Ajout pour stocker les événements bruts
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadService() {
      setLoading(true);

      try {
        const serviceInfo = await getServiceStatistics(activeService);
        setServiceData(serviceInfo);

        const eventList = await getEventsService(activeService);
        
        // 👉 Stocker les événements bruts pour UpcomingEvents
        setRawEvents(eventList);

        // 👉 Événements formatés pour les autres calculs
        const formattedEvents = eventList.map(ev => ({
          id: ev.idEvent,
          title: ev.title,
          description: ev.description || "",
          start: new Date(ev.startTime),
          end: new Date(ev.endTime),
          isAllDay: ev.allDay === true,
          user: ev.userName || "Utilisateur",
          service: ev.service || "",
          raw: ev
        }));

        setEvents(formattedEvents);
      } catch (err) {
        console.error("Erreur service :", err);
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [activeService]);


  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5ece3] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2d466e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-[#2d466e]">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!serviceData) return null;
  const now = new Date();

  const todayEvents = events.filter((ev) => {
    const d = ev.start;
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  });

  // 👉 todayEvents bruts pour UpcomingEvents
  const todayRawEvents = rawEvents.filter((ev) => {
    const d = new Date(ev.startTime);
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  });

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const weekEvents = events.filter((ev) => {
    const d = ev.start;
    return d >= startOfWeek && d < endOfWeek;
  });

  const monthEvents = events.filter((ev) => {
    const d = ev.start;
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth()
    );
  });

  // 👉 upcomingEvents bruts pour UpcomingEvents
  const upcomingRawEvents = rawEvents
    .filter(ev => new Date(ev.startTime) >= now)
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 5);

  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const lastMonthEvents = events.filter((ev) => {
    const d = ev.start;
    return d >= lastMonth && d <= lastMonthEnd;
  });

  const eventTrend = lastMonthEvents.length > 0 
    ? Math.round(((monthEvents.length - lastMonthEvents.length) / lastMonthEvents.length) * 100)
    : 0;

  const completedEvents = events.filter(ev => ev.end < now).length;
  const completionRate = events.length > 0 ? Math.round((completedEvents / events.length) * 100) : 0;

  const recentActivity = [
    ...(serviceData.recentDocuments || []).map(doc => ({
      id: `doc-${doc.id}`,
      user: doc.creatorName || 'Utilisateur',
      action: doc.status === 'approved' ? 'a approuvé' : 'a modifié',
      item: doc.title || doc.name,
      time: doc.lastModified || 'Récemment'
    })),
    ...events.slice(0, 3).map(ev => ({
      id: `event-${ev.id}`,
      user: ev.user || 'Organisateur',
      action: 'a créé l\'événement',
      item: ev.title,
      time: ev.createdAt || 'Récemment'
    }))
  ].slice(0, 5);
  
  return (
    <div className="p-4">
      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 auto-rows-auto font-dropline">
        <StatusWorkflow idService={activeService}/>
        <Example />
        <TeamMembers users={serviceData.users} />
        {/* 👇 Passer les événements bruts */}
        <UpcomingEvents upcomingEvents={upcomingRawEvents} todayEvents={todayRawEvents}/>
        {/* <PriorityActions idService={activeService} /> */}
      </div>
    </div>
  );
};

export default Service;