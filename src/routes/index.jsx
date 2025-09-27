// src/routes/index.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultLayout from "../layouts/DefaultLayout";
import MapLayout from "../layouts/MapLayout";
import AuthLayout from "../layouts/AuthLayout";
import ScrollToTop from "../utils/ScrollToTop";
import HomePage from "../pages/HomePage";
import MapPage from "../pages/mapPage";
import PlacePage from "../pages/PlacePage";
import PlaceDetail from "../pages/PlaceDetail";
import AuthPage from "../pages/AuthPage";
import ProfilePage from "../pages/ProfilePage";
import NotFound from "../pages/NotFound";
import AdminLayout from "../layouts/AdminLayout";
import Admin from "../pages/Admin";
import { MapProvider } from "../contexts/mapContext";
import { AuthProvider } from "../contexts/authContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AppRoutes() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        {/* Toast container chung cho toàn app */}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Routes>
          {/* Public routes */}
          <Route
            path="/"
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

          {/* Map Layout */}
          <Route
            path="/map"
            element={
              <MapLayout sidebar={<div>Sidebar content</div>}>
                <MapProvider>
                  <MapPage />
                </MapProvider>
              </MapLayout>
            }
          />

          {/* Auth routes */}
          <Route
            path="/auth"
            element={
              <AuthLayout>
                <AuthPage />
              </AuthLayout>
            }
          />

          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <DefaultLayout>
                <ProfilePage />
              </DefaultLayout>
            }
          />
          {/* Admin route */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <Admin />
              </AdminLayout>
            }
          />

          {/* NotFound route */}
          <Route path="*" element={
            <DefaultLayout>
              <NotFound />
              </DefaultLayout>} />
          
        </Routes>
      </AuthProvider>
    </Router>
  );
}
