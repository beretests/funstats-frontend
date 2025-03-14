import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import FriendsPage from "./pages/FriendsPage";
import StatsPage from "./pages/StatsPage";
import PlayerStatsComparisonPage from "./pages/PlayerStatsComparisonPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AddStatstPage from "./pages/AddStatstPage";
import StatTrendsPage from "./pages/StatTrendsPage";
import AlertSnackbar from "./components/AlertSnackbar";
import LoadingComponent from "./components/LoadingComponent";

const App: React.FC = () => {
  return (
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
        <AuthSubscriber />
        <Header />
        <AlertSnackbar />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* <LoadingComponent> */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute redirectTo="/" />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/friends" element={<FriendsPage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route
                path="/compare-stats/:friendId"
                element={<PlayerStatsComparisonPage />}
              />
              <Route path="/stat-trends" element={<StatTrendsPage />} />
              <Route path="/stats/add" element={<AddStatstPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
            </Route>
          </Routes>
          {/* </LoadingComponent> */}
        </LocalizationProvider>
      </BrowserRouter>
    </StyledEngineProvider>
  );
};

export default App;
