const API_URL = "http://localhost:8080/api/gmail/messages";

export async function getEmails(maxResults = 10) {
  const response = await fetch(`${API_URL}?maxResults=${maxResults}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Erreur lors de récupération des emails", text);
    throw new Error(`Erreur ${response.status}`);
  }

  const data = await response.json();
  console.log("Emails : ", data);
  return data;
}
