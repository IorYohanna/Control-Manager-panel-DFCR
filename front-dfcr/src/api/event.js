const API_URL = "http://localhost:8080/events";

/**
 * Récupérer tous les événements
 */
export async function getEvents(token) {
  const response = await fetch(`${API_URL}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text(); // récupère la réponse brute
    console.error("Erreur backend:", text);
    throw new Error(`Erreur ${response.status}`);
  }

  // parse le JSON seulement si la réponse est OK
  const data = await response.json();
  console.log(data);
  return data;
}

/**
 * Créer un événement
 */
export async function createEvent(eventData, token) {
  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...eventData,
      startTime: new Date(eventData.startTime).toISOString(),
      endTime: new Date(eventData.endTime).toISOString(),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Erreur création événement:", text);
    throw new Error(`Erreur ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Supprimer un événement
 */
export async function deleteEvent(eventId, token) {
  const response = await fetch(`${API_URL}/${eventId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Erreur suppression événement:", text);
    throw new Error(`Erreur ${response.status}`);
  }

  return true;
}
