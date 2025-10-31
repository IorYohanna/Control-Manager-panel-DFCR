import React from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

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
            <style>
                {`
                    /* Style personnalisé pour FullCalendar */
                    .fc {
                        font-family: system-ui, -apple-system, sans-serif;
                    }
                    
                    /* En-tête du calendrier */
                    .fc .fc-toolbar-title {
                        font-size: 1.75rem;
                        font-weight: 700;
                        color: #1f2937;
                    }
                    
                    .fc .fc-button {
                        background-color: #3b82f6;
                        border-color: #3b82f6;
                        color: white;
                        padding: 0.5rem 1rem;
                        border-radius: 0.5rem;
                        font-weight: 500;
                        text-transform: capitalize;
                        transition: all 0.2s;
                    }
                    
                    .fc .fc-button:hover {
                        background-color: #2563eb;
                        border-color: #2563eb;
                        transform: translateY(-1px);
                    }
                    
                    .fc .fc-button:active {
                        background-color: #1d4ed8;
                        border-color: #1d4ed8;
                    }
                    
                    .fc .fc-button-active {
                        background-color: #1d4ed8 !important;
                        border-color: #1d4ed8 !important;
                    }
                    
                    .fc .fc-button:disabled {
                        opacity: 0.5;
                    }
                    
                    /* Jours de la semaine */
                    .fc .fc-col-header-cell {
                        background-color: #f3f4f6;
                        font-weight: 600;
                        color: #4b5563;
                        padding: 1rem 0;
                        text-transform: uppercase;
                        font-size: 0.75rem;
                        letter-spacing: 0.05em;
                    }
                    
                    /* Cellules du calendrier */
                    .fc .fc-daygrid-day {
                        transition: background-color 0.2s;
                    }
                    
                    .fc .fc-daygrid-day:hover {
                        background-color: #f9fafb;
                    }
                    
                    .fc .fc-daygrid-day-number {
                        padding: 0.5rem;
                        font-weight: 500;
                        color: #374151;
                    }
                    
                    .fc .fc-day-today {
                        background-color: #eff6ff !important;
                    }
                    
                    .fc .fc-day-today .fc-daygrid-day-number {
                        background-color: #3b82f6;
                        color: white;
                        border-radius: 50%;
                        width: 2rem;
                        height: 2rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0.25rem;
                    }
                    
                    /* Événements */
                    .fc-event {
                        border-radius: 0.375rem;
                        padding: 0.25rem 0.5rem;
                        margin: 2px 4px;
                        cursor: pointer;
                        transition: all 0.2s;
                        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                        font-weight: 500;
                        font-size: 0.875rem;
                    }
                    
                    .fc-event:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
                        opacity: 0.9;
                    }
                    
                    .fc-event-title {
                        font-weight: 600;
                    }
                    
                    .fc-event-time {
                        font-weight: 500;
                        font-size: 0.75rem;
                    }
                    
                    /* Vue grille */
                    .fc .fc-daygrid-event-dot {
                        border-radius: 50%;
                        width: 8px;
                        height: 8px;
                    }
                    
                    /* Bordures */
                    .fc .fc-scrollgrid {
                        border-color: #e5e7eb;
                    }
                    
                    .fc th {
                        border-color: #e5e7eb;
                    }
                    
                    .fc td {
                        border-color: #f3f4f6;
                    }
                    
                    /* Vue semaine et jour */
                    .fc .fc-timegrid-slot {
                        height: 3rem;
                    }
                    
                    .fc .fc-timegrid-slot-label {
                        color: #6b7280;
                        font-size: 0.75rem;
                    }
                    
                    /* Animation des événements */
                    @keyframes slideIn {
                        from {
                            opacity: 0;
                            transform: translateY(-10px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    
                    .fc-event {
                        animation: slideIn 0.3s ease-out;
                    }
                    
                    /* Plus d'événements */
                    .fc .fc-daygrid-more-link {
                        color: #3b82f6;
                        font-weight: 600;
                        font-size: 0.75rem;
                        padding: 0.125rem 0.5rem;
                        border-radius: 0.25rem;
                        transition: background-color 0.2s;
                    }
                    
                    .fc .fc-daygrid-more-link:hover {
                        background-color: #dbeafe;
                    }
                    
                    /* Responsive */
                    @media (max-width: 768px) {
                        .fc .fc-toolbar {
                            flex-direction: column;
                            gap: 1rem;
                        }
                        
                        .fc .fc-toolbar-title {
                            font-size: 1.25rem;
                        }
                        
                        .fc .fc-button {
                            padding: 0.375rem 0.75rem;
                            font-size: 0.875rem;
                        }
                    }
                `}
            </style>
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