import { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { Bell, X, Check, CheckCheck } from "lucide-react";

// ============ API Calls ============
const API_BASE = "http://localhost:8080";

async function getCurrentUser() {
  const token = localStorage.getItem("token");
  try {
    // Décoder le JWT pour obtenir le matricule
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub;
  } catch {
    // Fallback si le token n'est pas valide
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (!res.ok) throw new Error("Failed to get current user");
    const data = await res.json();
    return data.matricule;
  }
}

async function getNotifications(userId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/notifications/${userId}`, {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}

async function markAsRead(notificationId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
    method: "PATCH",
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Failed to mark as read");
  return res.json();
}

async function markAllAsRead(userId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/notifications/${userId}/read-all`, {
    method: "PATCH",
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Failed to mark all as read");
  return res.json();
}

// ============ Notification Item Component ============
function NotificationItem({ notification, onMarkAsRead }) {
  const getIcon = (type) => {
    switch (type) {
      case "ASSSIGNE_EMPLOYE":
        return "📋";
      case "TASK_COMPLETED":
        return "✅";
      case "TASK_UPDATED":
        return "🔄";
      default:
        return "🔔";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  };

  return (
    <div
      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
        !notification.read ? "bg-blue-50" : ""
      }`}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{getIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${!notification.read ? "font-semibold text-gray-900" : "text-gray-700"}`}>
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">{formatDate(notification.createdAt)}</p>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
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

    const token = localStorage.getItem("token");
    const socket = new SockJS("http://localhost:8080/ws-message");
    
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("🔔 WebSocket Notifications Connected");
        
        // S'abonner aux notifications de l'utilisateur
        client.subscribe(`/user/queue/notifications`, (msg) => {
          try {
            const notification = JSON.parse(msg.body);
            console.log("📩 Nouvelle notification reçue:", notification);
            
            // Ajouter la nouvelle notification en haut de la liste
            setNotifications(prev => [notification, ...prev]);
            
            // Animation ou son (optionnel)
            if (Notification.permission === "granted") {
              new Notification("Nouvelle notification", {
                body: notification.message,
                icon: "/notification-icon.png"
              });
            }
          } catch (e) {
            console.error("Erreur parsing notification:", e);
          }
        });
      },
      onStompError: (frame) => {
        console.error("Erreur STOMP:", frame);
      }
    });

    client.activate();
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
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
              <p className="text-xs text-gray-600">
                {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Aucune nouvelle notification"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
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
              <div className="p-8 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm">Chargement...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-sm">Aucune notification</p>
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

          {/* Footer (optionnel) */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
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