import api from "./api";

export const getProfileData = async (userId: string) => {
  const profileData = await api.get(`/api/${userId}/profile`);
  return profileData.data[0];
};

export const updateProfileData = async (userId: string, updates: any) => {
  const profileData = await api.patch(`/api/${userId}/profile`, updates);
  return profileData.data;
};
