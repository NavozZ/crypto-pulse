import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import HomePage from "./HomePage";
import RootLayout from "./components/layouts/root-layout.page";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Guard: redirect to /login if no token stored
const PrivateRoute = ({ children }) => {
  const userInfo = localStorage.getItem("userInfo");
  return userInfo ? children : <Navigate to="/login" replace />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public routes with shared Navigation */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="register" element={<Register />} />
          <Route path="login"    element={<Login />} />
        </Route>

        {/* Protected dashboard — has its own layout (no RootLayout navbar overlap) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
