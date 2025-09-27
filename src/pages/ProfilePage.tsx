import React, { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileDetails from "../components/Profile/ProfileDetails";
import { getProfileData } from "../services/profileService";
import ProfileForm from "../components/Profile/ProfileForm";
import CircularProgress from "@mui/material/CircularProgress";

const ProfilePage: React.FC = () => {
  const { user, setUser, authLoading, isAuthenticated } = useAuthStore();

  if (authLoading) return null;

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

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="text-info-300">
      <>
        <ProfileHeader />
        <ProfileDetails />
        <ProfileForm />
      </>
    </div>
  );
};

export default ProfilePage;
