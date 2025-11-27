import React, { useState, useEffect } from 'react';
import { getServiceStatistics, getEventsService } from "../../api/Dashboard/dashboard";
import { StatusWorkflow } from '../../components/Dashboard/StatusWorkflow';
import TeamMembers from '../../components/Dashboard/TeamMembers';
import { UpcomingEvents } from '../../components/Dashboard/UpcomingEvents';
import Example from '../../components/Dashboard/LineChartCard';
import { CompletedDocuments } from '../../components/Dashboard/CompletedDocuments';

const Service = ({ activeService }) => {
  const [serviceData, setServiceData] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [events, setEvents] = useState([]);
  const [rawEvents, setRawEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadService() {
      setLoading(true);
      try {
        const serviceInfo = await getServiceStatistics(activeService);
        setServiceData(serviceInfo);

        const eventList = await getEventsService(activeService);
        setRawEvents(eventList);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#2d466e]/30 border-t-[#2d466e] rounded-full animate-spin"></div>
          <p className="text-sm font-eirene text-[#2d466e] animate-pulse">Chargement...</p>
        </div>
      </div>
    );
  }



  if (!serviceData) return null;
  const now = new Date();

  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const upcomingRawEvents = rawEvents
    .filter(ev => {
      if (!ev.startTime) return false;
      const eventDate = new Date(ev.startTime);
      return eventDate >= todayMidnight;
    })
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 5);

  const todayRawEvents = rawEvents.filter((ev) => {
    const d = new Date(ev.startTime);
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  });

  return (
    <div className="p-6 lg:p-8 min-h-screen">

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-2 xl:col-span-2 h-full">
          <StatusWorkflow idService={activeService} />
        </div>

        <div className="col-span-1 md:col-span-2 xl:col-span-2 h-full">
          <Example idService={activeService} />
        </div>

        <div className="col-span-1 md:col-span-1 xl:col-span-1">
          <UpcomingEvents upcomingEvents={upcomingRawEvents} todayEvents={todayRawEvents} />
        </div>

        <div className="col-span-1 md:col-span-1 xl:col-span-1">
          <TeamMembers users={serviceData.users} />
        </div>

        <div className="col-span-1 md:col-span-2 xl:col-span-2">
          <CompletedDocuments idService={activeService} />
        </div>

      </div>
    </div>
  );
};

export default Service;