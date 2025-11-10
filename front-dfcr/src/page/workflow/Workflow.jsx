import React from "react";

const Workflow = ({ reference }) => {

    reference = "004"

    const updateStatus = async (status) => {
        try {
            const response = await fetch(`http://localhost:8080/workflows/update/${reference}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de la mise à jour");
            }

            const data = await response.json();
            console.log("Workflow mis à jour :", data);
            alert(`Workflow mis à jour : ${data.status}`);
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    return (
        <div className="w-full" style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => updateStatus("A_FAIRE")}>A FAIRE</button>
            <button onClick={() => updateStatus("EN_COURS")}>EN COURS</button>
            <button onClick={() => updateStatus("TERMINE")}>TERMINE</button>
        </div>
    );
};

export default Workflow;
