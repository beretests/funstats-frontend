import React, { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileDetails from "../components/Profile/ProfileDetails";
import { getProfileData } from "../services/profileService";
import ProfileForm from "../components/Profile/ProfileForm";
import CircularProgress from "@mui/material/CircularProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";

const ProfilePage: React.FC = () => {
  const { user, setUser, authLoading, isAuthenticated } = useAuthStore();

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getProfileData(user.id);
        setUser({ ...user, ...data });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
      }
    };

    if (!authLoading && isAuthenticated) {
      fetchProfileData();
    }
  }, []);

  const cardBgColor =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "var(--color-ok-200)"
      : "var(--color-ok-700)";

  const cardTextColor =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "var(--color-info-500)"
      : "var(--color-ok-100)";

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Card
        sx={{
          minWidth: 300,
          maxWidth: 500,
          width: { xs: "50%", sm: "80%", md: "60%", lg: "50%" },
          p: 2,
          my: 4,
          bgcolor: cardBgColor,
          boxShadow: 3,
          borderRadius: 2,
          color: cardTextColor,
        }}
      >
        <CardContent>
          <ProfileHeader />
          <ProfileDetails />
          <ProfileForm />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
