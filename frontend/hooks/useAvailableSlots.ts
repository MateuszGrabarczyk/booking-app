import { fetchAvailableSlots, Slot } from "@/app/api/slots/route";
import { useState, useEffect, useCallback } from "react";

export function useAvailableSlots(categories: number[]) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(0);

  const refetch = useCallback(() => {
    setReloadFlag((f) => f + 1);
  }, []);

  useEffect(() => {
    if (categories.length === 0) {
      setSlots([]);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchAvailableSlots(categories, controller.signal)
      .then((data) => setSlots(data))
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [categories, reloadFlag]);

  return { slots, error, loading, refetch };
}
