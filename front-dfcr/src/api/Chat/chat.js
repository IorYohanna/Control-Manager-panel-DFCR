const API_URL = "http://localhost:8080";

function authHeader() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token");
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub;
  } catch {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: authHeader(),
    });
    const data = await res.json();
    return data.matricule;
  }
}

export async function getUsers() {
  const res = await fetch(`${API_URL}/users`, {
    headers: authHeader(),
  });
  return res.json();
}

export async function getMessages(currentUser, selectedUser) {
  const res = await fetch(
    `${API_URL}/messages/${currentUser}/${selectedUser}`,
    {
      headers: authHeader(),
    }
  );
  return res.json();
}

export async function sendMessageRest(sender, receiver, content) {
  const res = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({
      senderMatricule: sender,
      receiverMatricule: receiver,
      content,
    }),
  });
  return res.json();
}
