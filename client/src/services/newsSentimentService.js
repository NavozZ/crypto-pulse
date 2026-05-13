import apiClient from "./apiClient";

export const fetchNewsSentiment = async (coin, search = "") => {
  const { data } = await apiClient.get(`/api/news-sentiment/${coin}`, {
    params: search ? { search } : {},
  });
  return data;
};

