const API_URL = "http://localhost:8080/documents";

export async function createDocument(formData) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text(); // on lit la réponse brute
    throw new Error(`Erreur HTTP ${response.status}: ${text}`);
  }

  const data = await response.json(); // parse JSON seulement si ok
  return data;
}
