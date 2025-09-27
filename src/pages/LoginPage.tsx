import React from "react";
import Login from "../components/Login";
import { useAuthStore } from "../stores/authStore";
import { Navigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const { isAuthenticated, authLoading } = useAuthStore();

  if (authLoading) return null;
  if (isAuthenticated) return <Navigate to="/profile" replace />;

  return (
    <div className="min-h-[85vh] flex items-center justify-center">
      <Login />
    </div>
  );
};

export default LoginPage;
