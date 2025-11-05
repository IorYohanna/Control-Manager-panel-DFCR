
export async function fetchServiceData() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:8080/current-user/info', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        return data; 

    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        throw error;
    }
}
