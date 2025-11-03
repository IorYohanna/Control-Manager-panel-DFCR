import React, { useState } from "react";
import { EventModal } from "../../components/Calendar/EventModal";
import { EventCalendar } from "../../components/Calendar/EventCalendar";
import { useEvents } from "../../hooks/useEvents";

const Calendar = () => {
  const token = localStorage.getItem("token");

  // ✅ hook pour la data
  const { events, addEvent, removeEvent , editEvent} = useEvents(token);
  
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
    service: ""
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
      email: "",
      service: ""
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
      email: e.extendedProps.email,
      service: e.extendedProps.service
    });

    setModalType("view");
    setModalOpen(true);
  };

  const switchToEdit = () => {
    setModalType("edit");
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

  // ✅ modifer un event
  const handleEditEvent = async () => {
    await editEvent(formData.idEvent, formData);
    setModalOpen(false);
  };


  return (
    <div className="w-full min-h-screen py-4 px-3 sm:px-4 md:px-6 lg:px-8">

      {/* Calendrier responsive */}
      <div className="w-full flex justify-center items-start">
        <EventCalendar
          events={events.map(e => ({
            idEvent: e.idEvent,
            title: e.title,
            start: e.startTime,
            end: e.endTime,
            allDay: e.allDay,
            extendedProps: {
              description: e.description,
              email: e.email,
              service: e.service
            }
          }))}
          handleDateSelect={handleDateSelect}
          handleEventClick={handleEventClick}
        />
      </div>
      
      {/* Modal */}
      <EventModal
        open={modalOpen}
        setOpen={setModalOpen}
        type={modalType}
        formData={formData}
        setFormData={setFormData}
        onCreate={handleCreate}
        onEdit={handleEditEvent}
        onDelete={handleDelete}
        onEditMode={switchToEdit}
      />
    </div>
  );
}

export default Calendar;