import React from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./EventCalendarStyle.css";

export const EventCalendar = ({ events, handleDateSelect, handleEventClick }) => {
    // Palette de couleurs pour les événements qui se chevauchent
    const eventColors = [
        { bg: '#3b82f6', border: '#2563eb', text: '#ffffff' }, // Bleu
        { bg: '#8b5cf6', border: '#7c3aed', text: '#ffffff' }, // Violet
        { bg: '#ec4899', border: '#db2777', text: '#ffffff' }, // Rose
        { bg: '#f59e0b', border: '#d97706', text: '#ffffff' }, // Orange
        { bg: '#10b981', border: '#059669', text: '#ffffff' }, // Vert
        { bg: '#06b6d4', border: '#0891b2', text: '#ffffff' }, // Cyan
        { bg: '#f43f5e', border: '#e11d48', text: '#ffffff' }, // Rouge
    ];

    // Fonction pour déterminer les événements qui se chevauchent
    const processEventsWithColors = (events) => {
        if (!events) return [];
        
        const sortedEvents = [...events].sort((a, b) => {
            const dateA = new Date(a.start);
            const dateB = new Date(b.start);
            return dateA - dateB;
        });

        const processedEvents = sortedEvents.map((event, index) => {
            // Trouver les événements qui se chevauchent
            const overlappingEvents = sortedEvents.filter((e, i) => {
                if (i >= index) return false;
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end || event.start);
                const eStart = new Date(e.start);
                const eEnd = new Date(e.end || e.start);
                
                return (eventStart < eEnd && eventEnd > eStart);
            });

            // Assigner une couleur en fonction du nombre de chevauchements
            const colorIndex = overlappingEvents.length % eventColors.length;
            const color = eventColors[colorIndex];

            return {
                ...event,
                backgroundColor: color.bg,
                borderColor: color.border,
                textColor: color.text,
            };
        });

        return processedEvents;
    };

    const processedEvents = processEventsWithColors(events);

    return (
        <div className="bg-white p-6 rounded-3xl shadow-lg">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: "title",
                    center: "dayGridMonth,timeGridWeek,timeGridDay",
                    right: "prev,today,next",
                }}
                initialView="dayGridMonth"
                editable={false}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                events={processedEvents}
                select={handleDateSelect}
                eventClick={handleEventClick}
                height="auto"
                eventDisplay="block"
                displayEventTime={true}
                displayEventEnd={true}
                nowIndicator={true}
                slotMinTime="06:00:00"
                slotMaxTime="22:00:00"
                allDaySlot={true}
                locale="fr"
                buttonText={{
                    today: "Aujourd'hui",
                    month: "Mois",
                    week: "Semaine",
                    day: "Jour",
                }}
                dayHeaderFormat={{ weekday: 'short' }}
            />
        </div>
    );
}