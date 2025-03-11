import React, { useState, useEffect } from "react";
import { useAuthStore } from "../stores/authStore";
// import { useAlertStore } from "../stores/alertStore";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileDetails from "../components/Profile/ProfileDetails";
import { getProfileData } from "../services/profileService";
import ProfileForm from "../components/Profile/ProfileForm";

const ProfilePage: React.FC = () => {
  const { user, updateUser, setUser } = useAuthStore();

  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getProfileData(user.id);
        if (JSON.stringify(data) !== JSON.stringify(profileData)) {
          updateUser(data); // Update global store only if necessary
          setProfileData(data); // Update local state only if necessary
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();

    console.log(profileData);
  }, [user.id, profileData]);
  // setUser({ ...user, ...profileData });

  // if (profileData) {
  //   updateUser(profileData);
  // }

  return (
    <>
      <ProfileHeader />
      <ProfileDetails />
      <ProfileForm />
    </>
  );
};

export default ProfilePage;
