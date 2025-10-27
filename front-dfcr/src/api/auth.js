const API_URL = "http://localhost:8080/auth";

export async function loginUser(matricule, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ matricule, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data.message || "Erreur lors de la connexion";
    throw new Error(errorMessage);
  }

  return data;
}

export async function VerifyUser (matricule, code) {
  const response = await fetch(`${API_URL}/verify`, {
    method: "POST",
    headers: {
      "Content-Type" : "application/json",
    },
    body : JSON.stringify ({matricule, code})
  })

  const data = await response.json();
  if(!response.ok) {
    const errorMessage = data.message || "Erreur lors de la connexion"
    throw new Error(errorMessage)
  }

  return data
}

