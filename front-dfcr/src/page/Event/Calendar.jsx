import React, { useState } from "react";
import { EventModal } from "../../components/Calendar/EventModal";
import { EventCalendar } from "../../components/Calendar/EventCalendar";
import { Sidebar } from "../../components/Calendar/EventUtils";
import { useEvents } from "../../hooks/useEvents";

export default function Calendar() {
  const token = localStorage.getItem("token");

  // ✅ hook pour la data
  const { events, loading, addEvent, removeEvent } = useEvents(token);
  
  console.log(events)

  // ✅ état modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  // ✅ état des données du formulaire
  const [formData, setFormData] = useState({
    idEvent: "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    allDay: false,
    color: "#007BFF",
  });

  // ✅ formulaire - utilitaire
  const formatForInput = (date) => {
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  // ✅ ouvrir modal création
  const handleDateSelect = (selectInfo) => {
    setModalType("create");
    setFormData({
      idEvent: "",
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

  // ✅ ouvrir modal vue + édition + suppression
  const handleEventClick = (clickInfo) => {
    const e = clickInfo.event;

    setFormData({
      idEvent: e.extendedProps.idEvent || e.id,
      title: e.title,
      description: e.extendedProps.description,
      startTime: formatForInput(e.start),
      endTime: formatForInput(e.end),
      allDay: e.allDay,
      color: e.backgroundColor,
    });

    setModalType("view");
    setModalOpen(true);
  };

  // ✅ créer un event
  const handleCreate = async () => {
    await addEvent(formData);
    setModalOpen(false);
  };

  // ✅ supprimer un event
  const handleDelete = async () => {
    await removeEvent(formData.idEvent);
    setModalOpen(false);
  };

  return (
    <div>

      {/* <Sidebar
        events={events}
        weekendsVisible={true}
        toggleWeekends={() => {}}
        onDelete={(id) => {
          const target = events.find((e) => e.idEvent === id);
          setFormData(target);
          setModalType("delete");
          setModalOpen(true);
        }}
      /> */}

      <EventCalendar
        events={events.map(e => ({
          idEvent: e.idEvent,
          title: e.title,
          start: e.startTime,
          end: e.endTime,
          allDay: e.allDay,
          backgroundColor: e.color,
          borderColor: e.color,
          extendedProps: {
            description: e.description
          }
        }))}
        handleDateSelect={handleDateSelect}
        handleEventClick={handleEventClick}
      />

      <EventModal
        open={modalOpen}
        setOpen={setModalOpen}
        type={modalType}      // "create", "view", "edit", "delete"
        formData={formData}
        setFormData={setFormData}
        onCreate={handleCreate}
        onEdit={() => console.log("TODO edit")}
        onDelete={handleDelete}
      />
    </div>
  );
}
