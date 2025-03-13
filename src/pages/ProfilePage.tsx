import React, { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileDetails from "../components/Profile/ProfileDetails";
import { getProfileData } from "../services/profileService";
import ProfileForm from "../components/Profile/ProfileForm";
import { useLoadingStore } from "../stores/loadingStore";
import CircularProgress from "@mui/material/CircularProgress";

const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const { isLoading, setLoading } = useLoadingStore();

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const data = await getProfileData(user.id);
        setUser({ ...user, ...data });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="text-info-300">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <CircularProgress />
        </div>
      ) : (
        <>
          <ProfileHeader />
          <ProfileDetails />
          <ProfileForm />
        </>
      )}
    </div>
  );
};

export default ProfilePage;
