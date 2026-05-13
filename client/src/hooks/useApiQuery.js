import { useCallback, useEffect, useState } from "react";

export default function useApiQuery(fetcher, deps = [], options = {}) {
  const { immediate = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(immediate));
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetcher(...args);
      setData(response);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Request failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (!immediate) return;
    execute().catch(() => null);
  }, [execute, immediate]);

  return { data, loading, error, execute, setData };
}

