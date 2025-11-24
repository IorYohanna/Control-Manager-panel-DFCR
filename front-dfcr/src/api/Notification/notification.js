// ============ Imports ============
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// ============ API Configuration ============
const API_BASE = "http://localhost:8080";

/**
 * Récupère l'utilisateur actuel depuis le JWT
 */
export async function getCurrentUser() {
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
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) throw new Error("Failed to get current user");
    const data = await res.json();
    return data.matricule;
  }
}

/**
 * Récupère toutes les notifications d'un utilisateur
 */
export async function getNotifications(userId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/notifications/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}

/**
 * Marque une notification comme lue
 */
export async function markAsRead(notificationId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to mark as read");
  return res.json();
}

/**
 * Marque toutes les notifications comme lues
 */
export async function markAllAsRead(userId) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}/notifications/${userId}/read-all`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to mark all as read");
  return res.json();
}

/**
 * Initialise la connexion WebSocket pour les notifications en temps réel
 */
export function createNotificationWebSocket(
  currentUser,
  onNotification,
  token
) {
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
          onNotification(notification);

          // Notification navigateur
          if (Notification.permission === "granted") {
            new Notification("Nouvelle notification", {
              body: notification.message,
              icon: "/notification-icon.png",
            });
          }
        } catch (e) {
          console.error("Erreur parsing notification:", e);
        }
      });
    },
    onStompError: (frame) => {
      console.error("Erreur STOMP:", frame);
    },
  });

  client.activate();
  return client;
}

/**
 * Formate une date en format relatif (ex: "Il y a 5 min")
 */
export function formatRelativeDate(dateString) {
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
}

/**
 * Retourne l'icône appropriée selon le type de notification
 */
export function getNotificationIcon(type) {
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
}
