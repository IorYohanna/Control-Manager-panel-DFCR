import React, { useRef, useEffect, useState } from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import "./EventCalendarStyle.css";

export const EventCalendar = ({ events, handleDateSelect, handleEventClick, sidebarExpanded }) => {
    const calendarRef = useRef(null);
    const [viewMode, setViewMode] = useState("dayGridMonth");
    const [isListView, setIsListView] = useState(false);

    // Palette de couleurs pour les événements qui se chevauchent
    const eventColors = [
        { bg: '#7b8fab', border: '#5a729b', text: '#f5ece3' },
        { bg: '#c8a882', border: '#a68a6a', text: '#2d466e' },
        { bg: '#8b7355', border: '#6d5940', text: '#f5ece3' },
        { bg: '#4a5f7f', border: '#3a4d65', text: '#f5ece3' },
        { bg: '#d4bfa0', border: '#b8a385', text: '#2d466e' },
        { bg: '#5d7a9e', border: '#4a6280', text: '#f5ece3' },
        { bg: '#9b8b7e', border: '#7d6f63', text: '#f5ece3' },
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
            const overlappingEvents = sortedEvents.filter((e, i) => {
                if (i >= index) return false;
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end || event.start);
                const eStart = new Date(e.start);
                const eEnd = new Date(e.end || e.start);
                
                return (eventStart < eEnd && eventEnd > eStart);
            });

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

    const processedEvents = React.useMemo(
        () => processEventsWithColors(events),
        [events]
    );

    // Forcer la mise à jour quand la sidebar change
    useEffect(() => {
        const calendarApi = calendarRef.current?.getApi();
        if (!calendarApi) return;
        
        const timer = setTimeout(() => {
            calendarApi.updateSize();
        }, 350);

        return () => clearTimeout(timer);
    }, [sidebarExpanded]);

     // 🔁 Fonction pour changer de vue
    const toggleView = () => {
        const calendarApi = calendarRef.current?.getApi();
        if (!calendarApi) return;
        
        if (isListView) {
            // Retour au dernier mode calendrier utilisé
            calendarApi.changeView(viewMode);
            setIsListView(false);
        } else {
            // Passage en mode liste
            setViewMode(calendarApi.view.type); // Sauvegarde du mode actuel
            calendarApi.changeView("listWeek");
            setIsListView(true);
        }
    };

    return (
        <div className="bg-[#f5ece3] p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl shadow-lg w-full max-w-[95vw] sm:max-w-[90vw] lg:max-w-6xl xl:max-w-7xl mx-auto">
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                headerToolbar={{
                    left: "title",
                    center: isListView ? "" : "dayGridMonth,timeGridWeek,timeGridDay",
                    right: "prev,today,next,viewToggle",
                }}
                customButtons={{
                    viewToggle: {
                        text: isListView ? "📅" : "📋",
                        click: toggleView,
                    }
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
                contentHeight={500}
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
                views={{
                    dayGridMonth: {
                        dayMaxEvents: 3,
                    },
                    timeGridWeek: {
                        dayMaxEvents: 3,
                    },
                    listWeek: { buttonText: 'Liste', noEventsText: 'Aucun événement' },
                }}
            />
        </div>
    );
}