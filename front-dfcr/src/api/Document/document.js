export const API_URL = "http://localhost:8080/documents";
export const API_BASE_URL = "http://localhost:8080";

export const getAuthHeader = () => ({
  "Authorization": `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

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

export async function downloadDocument(reference) {
    try {
        const response = await fetch(`http://localhost:8080/documents/download/${reference}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 404) {
            alert('Document non trouvé');
            return;
        }

        if (response.status === 204) {
            alert('Aucun contenu disponible');
            return;
        }

        if (!response.ok) throw new Error(`Erreur ${response.status}`);

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = reference;
        if (contentDisposition) {
            const match = contentDisposition.match(/filename="(.+)"/);
            if (match) filename = match[1];
        }

        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Erreur téléchargement:', error);
        alert('Erreur lors du téléchargement');
        throw error;
    }
}