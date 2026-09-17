import { useState, useEffect, useCallback } from "react";

export function useFetch(fetchFn, fallback = null) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const result = await fetchFn();
      setData(result);
      setError(null);
    } catch (err) {
      console.error("useFetch error:", err);
      setError(err?.response?.data?.message || "Erreur de chargement.");
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    load();
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload };
}
