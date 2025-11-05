import { useState, useEffect, useCallback, useMemo } from 'react'
import { createEvent, getEvents, deleteEvent, updateEvent } from '../api/event';

export const useEvents = (token) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    
    const load = async () => {
      setLoading(true);
      try {
        const res = await getEvents(token);
        setEvents(res);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);


  const calendarEvents = useMemo(() => {
    return events.map(e => ({
      id: String(e.idEvent),
      title: e.title,
      start: e.startTime,
      end: e.endTime,
      allDay: e.allDay,
      extendedProps: {
        idEvent: e.idEvent,
        description: e.description,
        email: e.email,
        service: e.service
      }
    }));
  }, [events]);


  const addEvent = useCallback(async (data) => {
    const saved = await createEvent(data, token);
    setEvents(prev => [...prev, saved]);
  }, [token]);

  
  const removeEvent = useCallback(async (idEvent) => {
    await deleteEvent(idEvent, token);
    setEvents(prev => prev.filter(e => e.idEvent != idEvent));
  }, [token]);


  const editEvent = useCallback(async (idEvent, data) => {
    const updated = await updateEvent(idEvent, data, token);
    setEvents(prev => prev.map(e => e.idEvent == idEvent ? updated : e));
    return updated;
  }, [token]);

  return { events, loading, calendarEvents, addEvent, removeEvent, editEvent };
};