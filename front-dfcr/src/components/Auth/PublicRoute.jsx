// src/components/Auth/PublicRoute.jsx
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/home" replace />; // déjà connecté → va directement au dashboard
  }

  return children; // accès au login/signup autorisé
}
