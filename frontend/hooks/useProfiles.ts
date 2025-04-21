import { Profile, fetchProfile } from "@/app/api/profile/route";
import { useState, useEffect } from "react";

export function useProfiles() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchProfile(controller.signal)
      .then((data) => setProfile(data))
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  return { profile, loading, error };
}
