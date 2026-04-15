import { Navigate } from "react-router-dom";

// Checks for token in localStorage (or sessionStorage)
const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
