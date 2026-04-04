import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const userInfo = localStorage.getItem("userInfo");
  return userInfo ? children : <Navigate to="/login" replace />;
};

export const AdminRoute = ({ children }) => {
  const raw = localStorage.getItem("userInfo");
  if (!raw) return <Navigate to="/login" replace />;
  const u = JSON.parse(raw);
  return u.role === "admin" ? children : <Navigate to="/dashboard" replace />;
};

export const AlreadyAuth = ({ children }) => {
  const raw = localStorage.getItem("userInfo");
  if (!raw) return children;
  const u = JSON.parse(raw);
  return u.role === "admin"
    ? <Navigate to="/admin" replace />
    : <Navigate to="/dashboard" replace />;
};
