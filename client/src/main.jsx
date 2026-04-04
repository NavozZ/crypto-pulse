import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import RootLayout     from "./components/layouts/root-layout.page";
import HomePage       from "./HomePage";
import Register       from "./pages/Register";
import Login          from "./pages/Login";
import Dashboard      from "./pages/Dashboard";
import MacroPage      from "./pages/MacroPage";
import AdminDashboard from "./pages/AdminDashboard";
import LearningPage   from "./pages/LearningPage";
import CourseViewer   from "./pages/CourseViewer";

import { PrivateRoute, AdminRoute, AlreadyAuth } from "./RouteGuards";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="register" element={<AlreadyAuth><Register /></AlreadyAuth>} />
          <Route path="login"    element={<AlreadyAuth><Login /></AlreadyAuth>} />
        </Route>

        {/* Protected */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/macro"     element={<PrivateRoute><MacroPage /></PrivateRoute>} />
        <Route path="/admin"     element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        {/* Learning */}
        <Route path="/learning"           element={<PrivateRoute><LearningPage /></PrivateRoute>} />
        <Route path="/learning/:courseId" element={<PrivateRoute><CourseViewer /></PrivateRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
