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
  if (!token) {
    console.error("Pas de token trouvé dans localStorage");
    return null;
  }

  // Vérifier que le token a 3 parties (header.payload.signature)
  if (token.split(".").length !== 3) {
    throw new Error("Token invalide pour WS");
  }

  try {
    // Décoder le JWT pour obtenir le matricule
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub;
  } catch (error) {
    console.error("Erreur décodage token:", error);
    // Fallback vers l'API si le décodage échoue
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to get current user");
      const data = await res.json();
      return data.matricule;
    } catch (apiError) {
      console.error("Erreur API /auth/me:", apiError);
      return null;
    }
  }
}

/**
 * Récupère toutes les notifications d'un utilisateur
 */
export async function getNotifications(userId) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token non trouvé");
  }

  const res = await fetch(`${API_BASE}/notifications/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch notifications: ${res.status}`);
  }

  return res.json();
}

/**
 * Marque une notification comme lue
 */
export async function markAsRead(notificationId) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token non trouvé");
  }

  const res = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to mark as read: ${res.status}`);
  }

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

  // ⚡ Vérifie si la réponse a du JSON
  const text = await res.text();
  if (!text) return {}; // réponse vide, retourne un objet vide
  return JSON.parse(text);
}

// ============ Audio Configuration ============
let audioContext = null;
let audioBuffer = null;
let audioEnabled = false;
let soundMuted = false;

/**
 * Initialise l'audio (doit être appelé après une interaction utilisateur)
 */
export async function initAudio() {
  if (audioEnabled) return true;

  try {
    // Créer le contexte audio
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Charger le fichier audio
    const response = await fetch("/sounds/notification.mp3");
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    audioEnabled = true;

    // Récupérer l'état du son depuis localStorage
    const savedMuteState = localStorage.getItem("notificationSoundMuted");
    soundMuted = savedMuteState === "true";

    console.log("🔊 Audio initialisé avec succès");
    return true;
  } catch (error) {
    console.error("❌ Erreur initialisation audio:", error);
    return false;
  }
}

/**
 * Active/Désactive le son
 */
export function toggleSound() {
  soundMuted = !soundMuted;
  localStorage.setItem("notificationSoundMuted", soundMuted.toString());
  console.log(soundMuted ? "🔇 Son désactivé" : "🔊 Son activé");
  return soundMuted;
}

/**
 * Récupère l'état du son
 */
export function isSoundMuted() {
  return soundMuted;
}

/**
 * Joue le son de notification
 */
export function playNotificationSound() {
  if (!audioEnabled || !audioContext || !audioBuffer || soundMuted) {
    if (soundMuted) {
      console.log("🔇 Son muté");
    } else {
      console.warn("⚠️ Audio non initialisé");
    }
    return;
  }

  try {
    // Reprendre le contexte s'il est suspendu
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // Créer une source audio
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;

    // Créer un nœud de gain pour contrôler le volume
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.5; // Volume à 50%

    // Connecter source -> gain -> destination
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Jouer le son
    source.start(0);
  } catch (error) {
    console.error("❌ Erreur lors de la lecture du son:", error);
  }
}

/**
 * Initialise la connexion WebSocket pour les notifications en temps réel
 */
export function createNotificationWebSocket(currentUser, onNotification) {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("❌ Token manquant pour WebSocket");
    return null;
  }

  const socket = new SockJS(`${API_BASE}/ws-message`);

  const client = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,

    onConnect: () => {
      console.log("🔔 WebSocket Notifications Connected pour:", currentUser);

      // S'abonner aux notifications de l'utilisateur
      const subscription = client.subscribe(
        `/user/queue/notifications`,
        (msg) => {
          try {
            const notification = JSON.parse(msg.body);
            console.log("📩 Nouvelle notification reçue:", notification);
            onNotification(notification);

            // 🔊 Jouer le son de notification
            playNotificationSound();

            // Notification navigateur
            if (Notification.permission === "granted") {
              new Notification(
                "Une nouvelle notification venant de l'application DFCR",
                {
                  icon: "/notification-icon.png",
                }
              );
            }
          } catch (e) {
            console.error("❌ Erreur parsing notification:", e);
          }
        }
      );

      console.log("✅ Abonnement créé:", subscription.id);
    },

    onStompError: (frame) => {
      console.error("❌ Erreur STOMP:", frame.headers.message);
      console.error("Détails:", frame.body);
    },

    onWebSocketError: (error) => {
      console.error("❌ Erreur WebSocket:", error);
    },

    onDisconnect: () => {
      console.log("🔌 WebSocket déconnecté");
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
    case "TASK_ASSIGNED":
      return "📋";
    case "TASK_COMPLETED":
      return "✅";
    case "TASK_UPDATED":
      return "🔄";
    case "MEETING_SCHEDULED":
      return "📅";
    case "SERVICE_UPDATE":
      return "📢";
    case "SYSTEM_MAINTENANCE":
      return "🔧";
    case "NEW_MESSAGE":
      return "💬";
    default:
      return "🔔";
  }
}
