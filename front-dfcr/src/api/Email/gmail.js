const API_BASE_URL = "http://localhost:8080/api";

export async function checkAuth() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/gmail/status`, {
      credentials: "include",
    });
    if (!response.ok) return { authenticated: false };
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Erreur lors de la vérification de l'authentification", err);
    return { authenticated: false };
  }
}

export async function getLoginUrl() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/gmail/url`);
    return await response.json();
  } catch (err) {
    console.error("Erreur lors de la récupération de l'URL de connexion", err);
    throw err;
  }
}

/**
 * OPTIMISÉ: Utilise l'endpoint /messages/light qui charge les emails en parallèle
 * et n'utilise que les métadonnées (format "metadata" au lieu de "full")
 *
 * Performance: ~2s au lieu de ~10s pour 10 emails
 */
export async function fetchEmails(maxResults = 10) {
  try {
    console.time("fetchEmails"); // Mesurer le temps

    // Utiliser l'endpoint optimisé
    const response = await fetch(
      `${API_BASE_URL}/gmail/messages/light?maxResults=${maxResults}`
    );

    const data = await response.json();
    console.timeEnd("fetchEmails");

    return data;
  } catch (err) {
    console.error("Erreur lors du chargement des emails", err);
    throw err;
  }
}

/**
 * Charge un email complet avec son body (pour la vue détaillée)
 * Utilisez cette fonction uniquement quand l'utilisateur clique sur un email
 */
export async function fetchEmailDetail(messageId) {
  try {
    const response = await fetch(`${API_BASE_URL}/gmail/messages/${messageId}`);
    return await response.json();
  } catch (err) {
    console.error("Erreur lors du chargement du détail de l'email", err);
    throw err;
  }
}

export async function logout() {
  try {
    await fetch(`${API_BASE_URL}/auth/gmail/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Erreur lors de la déconnexion", err);
    throw err;
  }
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (days < 7) {
    return date.toLocaleDateString("fr-FR", { weekday: "short" });
  } else {
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  }
}

export function extractSenderName(from) {
  if (!from) return "Inconnu";
  const match = from.match(/^"?([^"<]+)"?\s*<?/);
  return match ? match[1].trim() : from.split("<")[0].trim();
}

export function getEmailBody(body) {
  if (!body) return "";
  return body.replace(/<[^>]*>/g, "").substring(0, 500);
}
