import { formatDate } from "@fullcalendar/core";

// Sidebar inchangé
export function Sidebar({ weekendsVisible, toggleWeekends, events, onDelete }) {
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
                    onClick={() => onDelete(e.idEvent)}
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