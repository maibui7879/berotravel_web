// src/routes/index.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import MapLayout from "../layouts/MapLayout";
import AuthLayout from "../layouts/AuthLayout";

import HomePage from "../pages/HomePage";
import MapPage from "../pages/mapPage";
import PlacePage from "../pages/PlacePage";
import PlaceDetail from "../pages/PlaceDetail";
import AuthPage from "../pages/AuthPage";
import ProfilePage from "../pages/ProfilePage";

import { MapProvider } from "../contexts/mapContext";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Default Layout */}
        <Route
          path="/home"
          element={
            <DefaultLayout>
              <HomePage />
            </DefaultLayout>
          }
        />
        <Route
          path="/place"
          element={
            <DefaultLayout>
              <PlacePage />
            </DefaultLayout>
          }
        />
        <Route
          path="/place/:id"
          element={
            <DefaultLayout>
              <PlaceDetail />
            </DefaultLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <DefaultLayout>
              <ProfilePage />
            </DefaultLayout>
          }
        />

        {/* Map Layout */}
        <Route
          path="/"
          element={
            <MapLayout sidebar={<div>Sidebar content</div>}>
              <MapProvider>
                <MapPage />
              </MapProvider>
            </MapLayout>
          }
        />

        {/* Auth Layout */}
        <Route
          path="/auth"
          element={
            <AuthLayout>
              <AuthPage />
            </AuthLayout>
          }
        />
      </Routes>
    </Router>
  );
}
