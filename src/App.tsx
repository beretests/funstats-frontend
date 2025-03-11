import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import React from "react";
import { AuthSubscriber } from "./stores/authStore";
import { StyledEngineProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import AlertSnackbar from "./components/AlertSnackbar";

const App: React.FC = () => {
  return (
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
        <AuthSubscriber />
        <Header />
        <AlertSnackbar />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute redirectTo="/login" />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </LocalizationProvider>
      </BrowserRouter>
    </StyledEngineProvider>
  );
};

export default App;
