import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import HomePage       from "./HomePage";
import RootLayout     from "./components/layouts/root-layout.page";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register        from "./pages/Register";
import Login           from "./pages/Login";
import Dashboard       from "./pages/Dashboard";
import AdminDashboard  from "./pages/AdminDashboard";

// ── Route Guards ──────────────────────────────────────────────────────────

// PrivateRoute: any logged-in user (role: "user" OR "admin")
// Redirects to /login if no token found
const PrivateRoute = ({ children }) => {
  const userInfo = localStorage.getItem("userInfo");
  return userInfo ? children : <Navigate to="/login" replace />;
};

// AdminRoute: only allows role: "admin"
// Redirects non-admins to /dashboard, unauthenticated to /login
const AdminRoute = ({ children }) => {
  const raw = localStorage.getItem("userInfo");
  if (!raw) return <Navigate to="/login" replace />;
  const userInfo = JSON.parse(raw);
  return userInfo.role === "admin"
    ? children
    : <Navigate to="/dashboard" replace />;
};

// AlreadyAuth: redirect logged-in users away from /login and /register
// Prevents going back to login page after already authenticated
const AlreadyAuth = ({ children }) => {
  const raw = localStorage.getItem("userInfo");
  if (!raw) return children;
  const userInfo = JSON.parse(raw);
  return userInfo.role === "admin"
    ? <Navigate to="/admin" replace />
    : <Navigate to="/dashboard" replace />;
};

// ── App Routes ────────────────────────────────────────────────────────────
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        {/* ── Public routes (shared Navigation via RootLayout) ── */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />

          {/* Redirect to dashboard if already logged in */}
          <Route path="register" element={
            <AlreadyAuth><Register /></AlreadyAuth>
          } />
          <Route path="login" element={
            <AlreadyAuth><Login /></AlreadyAuth>
          } />
        </Route>

        {/* ── Protected: regular user dashboard ── */}
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />

        {/* ── Protected: admin-only dashboard ── */}
        <Route path="/admin" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />

        {/* ── Catch-all: redirect unknown paths to home ── */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>
);
