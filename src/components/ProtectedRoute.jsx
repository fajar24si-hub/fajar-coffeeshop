// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

/**
 * Protects routes that require authentication.
 * Optionally requires admin role with requireAdmin prop.
 */
export default function ProtectedRoute({ requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <Loading />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requireAdmin && !isAdmin) return <Navigate to="/home" replace />;

  return <Outlet />;
}
