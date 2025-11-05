import React, { useState, useEffect , useCallback} from 'react'
import { createEvent, getEvents , deleteEvent , updateEvent } from '../api/event';

export const useEvents = (token) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return
    async function load() {
      console.log("Loading events...");
      setLoading(true);

      try {
        const res = await getEvents(token);

        // ✅ pas de transformation bizarre, on garde EXACT ce que ton back renvoie
        setEvents(res);

      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  const addEvent = useCallback(async (data) => {
    const saved = await createEvent(data, token);

    // ✅ même structure que ton handleAddEvent d'origine
    setEvents(prev => [...prev, saved]);
  }, [token]);

  const removeEvent = useCallback(async (idEvent) => {
    await deleteEvent(idEvent, token);

    setEvents(prev => prev.filter(e => e.idEvent !== idEvent));
  }, [token]);

  const editEvent = useCallback(async (idEvent, data) => {
    const updated = await updateEvent(idEvent, data, token);

    setEvents(prev =>
      prev.map(e => (e.idEvent === idEvent ? updated : e))
    );

    return updated;
  }, [token]);

  return { events, loading, addEvent, removeEvent , editEvent};
};
