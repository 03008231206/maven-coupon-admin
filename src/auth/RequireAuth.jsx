import { Navigate } from "react-router-dom";
import { getAccessToken } from "./authStorage";

export default function RequireAuth({ children }) {
  const token = getAccessToken();

  if (!token) return <Navigate to="/login" replace />;

  return children;
}
