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
import ForecastHistoryPage from "./pages/ForecastHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import PricingPage from "./pages/PricingPage";
import AboutPage from "./pages/AboutPage";
import NewsSentimentPage from "./pages/NewsSentimentPage";
import WatchlistPage from "./pages/WatchlistPage";
import AIExplanationPage from "./pages/AIExplanationPage";
import AppErrorBoundary from "./components/common/AppErrorBoundary";

import { PrivateRoute, AdminRoute, AlreadyAuth } from "./RouteGuards";

try {
  const user = JSON.parse(localStorage.getItem("userInfo") || "null");
  if (user?.settings?.darkMode === false) {
    document.documentElement.style.colorScheme = "light";
  } else {
    document.documentElement.style.colorScheme = "dark";
  }
} catch {
  document.documentElement.style.colorScheme = "dark";
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="register" element={<AlreadyAuth><Register /></AlreadyAuth>} />
            <Route path="login"    element={<AlreadyAuth><Login /></AlreadyAuth>} />
            <Route path="pricing"  element={<PricingPage />} />
            <Route path="about"    element={<AboutPage />} />
          </Route>

          {/* Protected */}
          <Route path="/dashboard"         element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/macro"             element={<PrivateRoute><MacroPage /></PrivateRoute>} />
          <Route path="/admin"             element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/forecast-history"  element={<PrivateRoute><ForecastHistoryPage /></PrivateRoute>} />
          <Route path="/profile"           element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/news-sentiment"    element={<PrivateRoute><NewsSentimentPage /></PrivateRoute>} />
          <Route path="/watchlist"         element={<PrivateRoute><WatchlistPage /></PrivateRoute>} />
          <Route path="/ai-explanation"    element={<PrivateRoute><AIExplanationPage /></PrivateRoute>} />

          {/* Learning */}
          <Route path="/learning"           element={<PrivateRoute><LearningPage /></PrivateRoute>} />
          <Route path="/learning/:courseId" element={<PrivateRoute><CourseViewer /></PrivateRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  </StrictMode>
);
