import apiClient from "./apiClient";

export const fetchForecastHistory = async (params) => {
  const { data } = await apiClient.get("/api/forecast-history", { params });
  return data;
};

export const fetchForecastHistoryStats = async (coin) => {
  const { data } = await apiClient.get("/api/forecast-history/stats", {
    params: coin ? { coin } : {},
  });
  return data;
};

