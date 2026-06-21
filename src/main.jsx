// src/main.jsx
import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import AdminLayout from "./layouts/AdminLayout";
import Loading from "./components/Loading";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import "./assets/tailwind.css";

// ── React.lazy untuk code splitting ──────────────────────────
const Home           = lazy(() => import("./pages/Home"));
const Login          = lazy(() => import("./pages/auth/Login"));
const Register       = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const NotFound       = lazy(() => import("./pages/NotFound"));

// Admin Pages
const Dashboard  = lazy(() => import("./pages/admin/Dashboard"));
const Orders     = lazy(() => import("./pages/admin/Orders"));
const Menu       = lazy(() => import("./pages/admin/Menu"));
const Customers  = lazy(() => import("./pages/admin/Customers"));
const Inventory  = lazy(() => import("./pages/admin/Inventory"));
const Staff      = lazy(() => import("./pages/admin/Staff"));
const Settings   = lazy(() => import("./pages/admin/Settings"));

// ── App ──────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<Loading />}>
          <Routes>

            {/* ── Redirect root to home ── */}
            <Route path="/" element={<Navigate to="/home" replace />} />

            {/* ── Main Layout: Navbar + Footer ── */}
            <Route element={<MainLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* ── Auth Layout: tanpa Navbar/Footer ── */}
            <Route element={<AuthLayout />}>
              <Route path="/login"           element={<Login />} />
              <Route path="/register"        element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* ── Admin Layout: Protected (harus login + role admin) ── */}
            <Route element={<ProtectedRoute requireAdmin={false} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin"             element={<Dashboard />} />
                <Route path="/admin/orders"      element={<Orders />} />
                <Route path="/admin/menu"        element={<Menu />} />
                <Route path="/admin/customers"   element={<Customers />} />
                <Route path="/admin/inventory"   element={<Inventory />} />
                <Route path="/admin/staff"       element={<Staff />} />
                <Route path="/admin/settings"    element={<Settings />} />
              </Route>
            </Route>

          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
