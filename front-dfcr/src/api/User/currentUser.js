const API_BASE_URL = 'http://localhost:8080';

const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

const safeJsonParse = async (response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error('Erreur parsing JSON:', text.substring(0, 200));
    throw new Error('Réponse invalide du serveur : ', err);
  }
};

export async function fetchServiceData() {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch('http://localhost:8080/current-user/service/info', {
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

//info basic sur un user
export async function fectUserData() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:8080/current-user/basic-info', {
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


//tout les infos de profile du user avec le service ou il se  trouve
export  async function fetchUserProfile () {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Token d'authentification manquant");
        }

        const res = await fetch("http://localhost:8080/current-user/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            throw new Error(`Erreur HTTP: ${res.status}`);
        }

        const data = await res.json();
        return data;

    } catch (err) {
        console.error("Erreur lors du chargement du profil :", err);
        throw err;
    }
};
  
export const loadAllServices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/services`, {
      method: 'GET',
      headers: getAuthHeader()
    });

    if (response.ok) {
      const services = await safeJsonParse(response);
      console.log('Services chargés:', services);
      return services;
    } else {
      console.error('Erreur lors du chargement des services');
      return [];
    }
  } catch (error) {
    console.error('Erreur:', error);
    return [];
  }
};
