import api from "./api";

export const getProfileData = async (userId: string) => {
  const profileData = await api.get(`/api/profile?userId=${userId}`);
  return profileData.data[0];
};

export const updateProfileData = async (userId: string, updates: any) => {
  const profileData = await api.patch(`/api/profile?userId=${userId}`, updates);
  return profileData.data[0];
};
