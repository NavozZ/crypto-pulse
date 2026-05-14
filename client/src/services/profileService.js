import apiClient from "./apiClient";

export const getProfile = async () => {
  const { data } = await apiClient.get("/api/profile");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await apiClient.put("/api/profile", payload);
  return data;
};

export const updatePassword = async (payload) => {
  const { data } = await apiClient.put("/api/profile/password", payload);
  return data;
};

export const saveForecast = async (payload) => {
  const { data } = await apiClient.post("/api/profile/saved-forecasts", payload);
  return data;
};

export const removeSavedForecast = async (forecastId) => {
  const { data } = await apiClient.delete(`/api/profile/saved-forecasts/${forecastId}`);
  return data;
};

