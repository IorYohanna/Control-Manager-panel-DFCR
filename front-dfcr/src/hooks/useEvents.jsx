import React, { useState, useEffect } from 'react'
import { createEvent, getEvents , deleteEvent } from '../api/event';

export const useEvents = (token) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
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

  const addEvent = async (data) => {
    const saved = await createEvent(data, token);

    // ✅ même structure que ton handleAddEvent d'origine
    setEvents(prev => [...prev, saved]);
  };

  const removeEvent = async (idEvent) => {
    await deleteEvent(idEvent, token);

    setEvents(prev => prev.filter(e => e.idEvent !== idEvent));
  };

  return { events, loading, addEvent, removeEvent };
};
