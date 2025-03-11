import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore"; // Adjust path as needed

type ProtectedRouteProps = {
  children?: React.ReactNode;
  redirectTo?: string;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/login",
}) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to={redirectTo} replace />;
  }

  // Render children or nested routes (if using <Outlet>)
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
