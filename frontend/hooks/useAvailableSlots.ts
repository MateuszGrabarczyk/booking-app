import { fetchAvailableSlots, Slot } from "@/app/api/slots/route";
import { useState, useEffect } from "react";

export function useAvailableSlots(categories: number[]) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [categories]);

  return { slots, error, loading };
}
