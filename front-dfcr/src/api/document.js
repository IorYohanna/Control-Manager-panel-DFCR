const API_URL = "http://localhost:8080/documents";

export async function createDocument(formData) {
  const response = await fetch(`${API_URL}/create`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMessage =
      data.message || "Erreur lors de la création de document";
    throw new Error(errorMessage);
  }
  return data;
}
