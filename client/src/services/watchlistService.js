import apiClient from "./apiClient";

export const getWatchlist = async () => {
  const { data } = await apiClient.get("/api/watchlist");
  return data;
};

export const getWatchlistPrices = async () => {
  const { data } = await apiClient.get("/api/watchlist/prices");
  return data;
};

export const addWatchlistCoin = async (coin) => {
  const { data } = await apiClient.post("/api/watchlist", { coin });
  return data;
};

export const removeWatchlistCoin = async (coinId) => {
  const { data } = await apiClient.delete(`/api/watchlist/${coinId}`);
  return data;
};

export const reorderWatchlist = async (watchlist) => {
  const { data } = await apiClient.put("/api/watchlist/reorder", { watchlist });
  return data;
};

