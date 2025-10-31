import React, { useEffect, useState } from "react";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getEvents, createEvent , deleteEvent} from "../../api/event";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

export default function Calendar() {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [events, setEvents] = useState([]);
  console.log("voici les events", events)
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelectedDate] = useState({ start: null, end: null, allDay: false });

  // Formulaire modal
  const [formData, setFormData] = useState({
    idEvent: "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    allDay: false,
    color: "#007BFF",
    email: "",
    userName: ""
  });

  const token = localStorage.getItem("token");

  // Charger les événements
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents(token);
        const formatted = data.map((e) => ({
          idEvent: e.idEvent,
          title: e.title,
          description: e.description,
          start: e.startTime,
          end: e.endTime,
          allDay: e.allDay,
          color: e.color,
          email: e.email,
          userName: e.userName
        }));
        setEvents(formatted);
      } catch (err) {
        console.error("Erreur chargement events:", err);
      }
    };
    fetchEvents();
  }, [token]);

  // Ouvrir modal à la sélection d'une date
  const handleDateSelect = (selectInfo) => {
    const formatForInput = (date) => {
      const d = new Date(date);
      const offset = d.getTimezoneOffset(); // gestion fuseau
      const local = new Date(d.getTime() - offset * 60 * 1000);
      return local.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
    };

    setSelectedDate({
      start: formatForInput(selectInfo.start),
      end: formatForInput(selectInfo.end),
      allDay: selectInfo.allDay,
    });

    setFormData({
      title: "",
      description: "",
      startTime: formatForInput(selectInfo.start),
      endTime: formatForInput(selectInfo.end),
      allDay: selectInfo.allDay,
      color: "#007BFF",
    });

    setModalOpen(true);
    selectInfo.view.calendar.unselect();
  };


  const handleAddEvent = async () => {
    try {
      const saved = await createEvent(formData, token);
      setEvents((prev) => [
        ...prev,
        {
          id: saved.id,
          title: saved.title,
          start: saved.startTime,
          end: saved.endTime,
          allDay: saved.allDay,
          color: saved.color,
        },
      ]);
      setModalOpen(false);
    } catch (err) {
      console.error("Erreur ajout événement:", err);
    }
  };


  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Supprimer cet événement ?")) return;

    try {
      await deleteEvent(eventId, token);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="demo-app">
      <Sidebar
        weekendsVisible={weekendsVisible}
        toggleWeekends={() => setWeekendsVisible(!weekendsVisible)}
        events={events}
        onDelete={handleDeleteEvent}
      />

      <div className="demo-app-main">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          editable={false}
          selectable={true}
          weekends={weekendsVisible}
          events={events}
          select={handleDateSelect}
        />
      </div>

      {/* Modal MUI pour ajouter un événement */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Ajouter un événement</DialogTitle>
        <DialogContent className="flex flex-col gap-4 w-96">
          <TextField
            label="Titre"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            fullWidth
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
          />
          <TextField
            label="Date de début"
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            fullWidth
            slotProps={{
                htmlInput: { accept: "*" }, // 👈 équivalent de accept="*"
                inputLabel: { shrink: true } // 👈 pour garder le label visible
              }}
          />
          <TextField
            label="Date de fin"
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            fullWidth
            slotProps={{
                htmlInput: { accept: "*" }, // 👈 équivalent de accept="*"
                inputLabel: { shrink: true } // 👈 pour garder le label visible
              }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.allDay}
                onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
              />
            }
            label="Toute la journée"
          />
          <TextField
            label="Couleur"
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Annuler</Button>
          <Button onClick={handleAddEvent} variant="contained" color="primary">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// Sidebar inchangé
function Sidebar({ weekendsVisible, toggleWeekends, events, onDelete }) {
  return (
    <div className="demo-app-sidebar">
      <div className="demo-app-sidebar-section">
        <h2>Paramètres</h2>
        <label>
          <input type="checkbox" checked={weekendsVisible} onChange={toggleWeekends} />
          Afficher weekends
        </label>
      </div>

      <div className="demo-app-sidebar-section">
        <h2>Événements ({events.length})</h2>
        <ul>
          {events.map((e) => (
            <li key={e.idEvent} style={{ marginBottom: "8px" }}>
              <b>
                {formatDate(e.start, { year: "numeric", month: "short", day: "numeric" })}
              </b>{" "}
              — <i>{e.title}</i>
              <button
                style={{
                  marginLeft: "10px",
                  padding: "2px 6px",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => onDelete(e.id)}
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
