import apiClient from "./apiClient";

export const fetchAIExplanation = async (coin) => {
  const { data } = await apiClient.get(`/api/forecast/${coin}/explanation`);
  return data;
};

