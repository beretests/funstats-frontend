import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useAlertStore } from "../stores/alertStore";
import { CircularProgress } from "@mui/material";

type ProtectedRouteProps = {
  children?: React.ReactNode;
  redirectTo?: string;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/login",
}) => {
  const { isAuthenticated, authLoading } = useAuthStore();
  const showAlert = useAlertStore((state) => state.showAlert);

  if (authLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  if (!isAuthenticated) {
    showAlert("warning", "You must be logged in to view this content.");
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
