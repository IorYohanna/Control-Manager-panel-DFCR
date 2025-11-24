import { fetchUserProfile } from "./currentUser";

export const fetchUserPhoto = async (matricule) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token d'authentification manquant");
    }

    const photoRes = await fetch(
      `http://localhost:8080/users/${matricule}/photo`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!photoRes.ok) {
      throw new Error(
        `Erreur lors du chargement de la photo: ${photoRes.status}`
      );
    }

    const blob = await photoRes.blob();

    if (!blob || blob.size === 0) {
      return null;
    }

    const imgUrl = URL.createObjectURL(blob);
    return imgUrl;
  } catch (err) {
    console.error("Erreur lors du chargement de la photo :", err);
    throw err;
  }
};

export async function updateUser(matricule, formData) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`http://localhost:8080/users/${matricule}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message || "Erreur lors de la mise à jour de l'utilisateur"
      );
    }

    const updatedUser = await res.json();
    return updatedUser;
  } catch (err) {
    console.error("Erreur updateUser:", err);
    throw err;
  }
}

export async function deleteUser(matricule) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`http://localhost:8080/users/${matricule}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message || "Erreur lors de la suppression de l'utilisateur"
      );
    }

    return true; // succès
  } catch (err) {
    console.error("Erreur deleteUser:", err);
    throw err;
  }
}

export const uploadPhoto = async (matricule, formData) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`http://localhost:8080/users/${matricule}/photo`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      alert("Photo de profil mise à jour avec succès !");
    } else {
      const text = await res.text();
      alert("Échec de la mise à jour : " + text);
    }
  } catch (err) {
    console.error("Erreur lors de l’upload :", err);
  }
};

export const fetchCompleteUserProfile = async () => {
  try {
    const userData = await fetchUserProfile();

    let photoUrl = null;

    if (userData.matricule) {
      try {
        photoUrl = await fetchUserPhoto(userData.matricule);
      } catch (photoError) {
        console.warn("Photo de profil non disponible:", photoError);
      }
    }

    return {
      userData,
      photoUrl,
    };
  } catch (err) {
    console.error("Erreur lors du chargement complet du profil :", err);
    throw err;
  }
};

export const formatUserFormData = (userData) => {
  return {
    matricule: userData.matricule || "",
    firstName: userData.username || "",
    lastName: userData.surname || "",
    email: userData.email || "",
    phoneNumber: userData.contact || "",
    fonction: userData.fonction || "",
    score: userData.score || "",
    evaluation: userData.evaluation || "",
  };
};

export const extractServiceData = (userData) => {
  if (!userData.service) {
    return null;
  }

  return {
    serviceName: userData.service.serviceName || "",
    serviceEmail: userData.service.serviceEmail || "",
    idService: userData.service.idService || "",
  };
};
