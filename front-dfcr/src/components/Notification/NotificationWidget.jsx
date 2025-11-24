import { useEffect, useState, useRef } from "react";
import { Bell, CheckCheck } from "lucide-react";
import {
  getCurrentUser,
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotificationWebSocket,
  formatRelativeDate,
  getNotificationIcon
} from "../../api/Notification/notification";

// ============ Notification Item Component ============
function NotificationItem({ notification, onMarkAsRead }) {
  return (
    <div
      className={`p-4 border-b border-[#2d466e]/10 hover:bg-[#2d466e]/5 transition-all duration-200 cursor-pointer ${
        !notification.read ? "bg-[#2d466e]/20" : ""
      }`}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl shrink-0">{getNotificationIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-eirene ${!notification.read ? "font-semibold text-[#2d466e]" : "text-[#73839e]"}`}>
            {notification.message}
          </p>
          <p className="text-xs text-[#73839e] mt-1 font-eirene">
            {formatRelativeDate(notification.createdAt)}
          </p>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 bg-[#2d466e] rounded-full shrink-0 mt-2"></div>
        )}
      </div>
    </div>
  );
}

// ============ Main Notification Component ============
export default function NotificationWidget() {
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const stompClientRef = useRef(null);
  const dropdownRef = useRef(null);

  // Compteur de notifications non lues
  const unreadCount = notifications.filter(n => !n.read).length;

  // ============ Initialisation utilisateur ============
  useEffect(() => {
    async function init() {
      try {
        const matricule = await getCurrentUser();
        setCurrentUser(matricule);
      } catch (err) {
        console.error("Erreur lors du chargement de l'utilisateur:", err);
      }
    }
    init();
  }, []);

  // ============ Chargement des notifications ============
  useEffect(() => {
    if (!currentUser) return;
    
    async function loadNotifications() {
      setLoading(true);
      try {
        const data = await getNotifications(currentUser);
        // Trier par date décroissante
        const sorted = data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sorted);
      } catch (err) {
        console.error("Erreur chargement notifications:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadNotifications();
  }, [currentUser]);

  // ============ WebSocket Connection ============
  useEffect(() => {
    if (!currentUser) return;
    
    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
    };

    const client = createNotificationWebSocket(currentUser, handleNewNotification);
    stompClientRef.current = client;

    return () => {
      if (client.connected) {
        console.log("🔌 Déconnexion WebSocket Notifications");
        client.deactivate();
      }
    };
  }, [currentUser]);

  // ============ Gestion du clic externe ============
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // ============ Actions ============
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error("Erreur lors du marquage comme lu:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(currentUser);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Erreur lors du marquage de toutes les notifications:", err);
    }
  };

  // ============ Demande de permission pour les notifications du navigateur ============
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Bouton Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-[#2d466e]/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#2d466e]/30"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-[#2d466e]" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-[#ef4444] text-white text-xs font-bold font-eirene rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 backdrop-blur-xl bg-[#f5ece3] rounded-3xl shadow-2xl border border-white/30 z-50 max-h-[600px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-[#2d466e]/10 flex items-center justify-between bg-linear-to-br from-[#2d466e]/5 to-transparent">
            <div>
              <h3 className="font-bold font-dropline text-[#2d466e] text-xl">Notifications</h3>
              <p className="text-xs text-[#73839e] font-eirene mt-1">
                {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Aucune nouvelle notification"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[#2d466e] hover:text-[#1a2d4d] text-sm font-medium font-eirene flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-[#2d466e]/10 transition-all duration-200"
                title="Tout marquer comme lu"
              >
                <CheckCheck className="w-4 h-4" />
                Tout lire
              </button>
            )}
          </div>

          {/* Liste des notifications */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-8 text-center text-[#73839e]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d466e] mx-auto"></div>
                <p className="mt-2 text-sm font-eirene">Chargement...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-[#73839e]">
                <Bell className="w-12 h-12 mx-auto text-[#2d466e]/20 mb-2" />
                <p className="text-sm font-eirene">Aucune notification</p>
              </div>
            ) : (
              notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-[#2d466e]/10 bg-linear-to-br from-transparent to-[#2d466e]/5">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm text-[#2d466e] hover:text-[#1a2d4d] font-medium font-eirene py-2 rounded-lg hover:bg-[#2d466e]/10 transition-all duration-200"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}