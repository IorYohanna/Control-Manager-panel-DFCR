import React from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const renderEventContent = (eventInfo) => {
  const color = eventInfo.event.extendedProps.color || "#007BFF";

  return (
    <div
      className="flex items-center justify-between p-1 rounded-lg shadow text-white text-sm truncate"
      style={{ backgroundColor: color }}
      title={eventInfo.event.title}
    >
      <span>{eventInfo.event.title}</span>
      {eventInfo.event.extendedProps.type && (
        <span className="ml-1 px-1 text-xs bg-white/30 rounded">
          {eventInfo.event.extendedProps.type}
        </span>
      )}
    </div>
  );
};


export const EventCalendar = ({ events, handleDateSelect , handleEventClick }) => {
    return (
        <div className=" bg-white p-5 rounded-4xl">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                initialView="dayGridMonth"    
                eventColor="#007BFF"
                eventTextColor="#fff"
                editable={false}
                selectable={true}
                weekends={true}
                events={events}
                select={handleDateSelect}
                eventClick={handleEventClick}
                eventContent={renderEventContent}
            />
        </div>
    )
}
