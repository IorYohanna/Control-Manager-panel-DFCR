const API = "http://localhost:8080";

export async function getServiceStatistics(idService) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API}/dashboard/${idService}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    throw error;
  }
}

export async function getEventsService(idService) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API}/services/events/${idService}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    throw error;
  }
}

export async function getWorkflowsService(idService, status) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      `${API}/dashboard/workflows/${idService}/${status}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    throw error;
  }
}

export async function getDashboardStats(idService) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API}/dashboard/service/${idService}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des stats:", error);
    throw error;
  }
}

export async function getWorkflowStats() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API}/dashboard/workflow/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des stats:", error);
    throw error;
  }
}

export async function getCompletedDocuments(
  idService,
  month = null,
  year = null
) {
  try {
    const token = localStorage.getItem("token");

    // Construction de l'URL avec les paramètres optionnels
    let url = `${API}/dashboard/workflow/completed/${idService}`;
    const params = new URLSearchParams();

    if (month !== null && year !== null) {
      params.append("month", month);
      params.append("year", year);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des documents complétés:",
      error
    );
    throw error;
  }
}
