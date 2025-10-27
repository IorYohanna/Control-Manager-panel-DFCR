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

export async function signupUser(
  matricule,
  username,
  surname,
  password,
  email,
  fonction,
  contact,
  idService
) {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      matricule,
      username,
      surname,
      password,
      email,
      fonction,
      contact,
      idService,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data.message || "Erreur lors de l'inscription ";
    throw new Error(errorMessage);
  }
  return data;
}
export async function VerifyUser(matricule, verificationCode) {
  const response = await fetch(`${API_URL}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ matricule, verificationCode }),
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMessage = data.message || "Erreur lors de la connexion";
    throw new Error(errorMessage);
  }

  return data;
}
