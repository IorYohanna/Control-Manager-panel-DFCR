import React, { useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { EventModal } from "../../components/Calendar/EventModal";
import { EventCalendar } from "../../components/Calendar/EventCalendar";
import { useEvents } from "../../hooks/useEvents";

const Calendar = () => {
  const { sidebarExpanded } = useOutletContext();
  const token = localStorage.getItem("token");

  const { calendarEvents, addEvent, removeEvent, editEvent } = useEvents(token);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [formData, setFormData] = useState({
    idEvent: "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    allDay: false,
    service: ""
  });

  const formatForInput = useCallback((date) => {
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  }, []);

  const handleDateSelect = useCallback((selectInfo) => {
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
  }, [formatForInput]);

  const handleEventClick = useCallback((clickInfo) => {
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
  }, [formatForInput]);

  const switchToEdit = () => setModalType("edit");
  const switchToDelete = () => setModalType("delete");

  const handleCreate = async (data) => {
    await addEvent(data);
    setModalOpen(false);
  };

  const handleDelete = async () => {
    await removeEvent(formData.idEvent);
    setModalOpen(false);
  };

  const handleEditEvent = async (data) => {
    await editEvent(data.idEvent, data);
    setModalOpen(false);
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-center items-start">
        <EventCalendar
          sidebarExpanded={sidebarExpanded}
          events={calendarEvents}
          handleDateSelect={handleDateSelect}
          handleEventClick={handleEventClick}
        />
      </div>

      <EventModal
        open={modalOpen}
        setOpen={setModalOpen}
        type={modalType}
        formData={formData}
        setFormData={setFormData}
        onCreate={handleCreate}
        onEdit={handleEditEvent}
        onDelete={handleDelete}
        onDeleteMode={switchToDelete}
        onEditMode={switchToEdit}
        setModalType={setModalType}
      />
    </div>
  );
};

export default Calendar;