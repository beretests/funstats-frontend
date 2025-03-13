import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useAlertStore } from "../stores/alertStore";

type ProtectedRouteProps = {
  children?: React.ReactNode;
  redirectTo?: string;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/",
}) => {
  const { isAuthenticated } = useAuthStore();
  const showAlert = useAlertStore((state) => state.showAlert);

  if (!isAuthenticated) {
    showAlert(
      "warning",
      "You must be logged in to view this information. Click the 'Get Started' button to log in."
    );
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
