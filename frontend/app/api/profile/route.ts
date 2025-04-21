import { authFetch } from "@/lib/auth";

export type Profile = {
  preferred_categories: number[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function fetchProfile(signal?: AbortSignal): Promise<Profile> {
  const res = await authFetch(`${API_URL}/users/profile/`, {
    headers: { "Content-Type": "application/json" },
    signal,
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`Error ${res.status}: ${res.statusText} ${errBody}`);
  }

  return res.json();
}

export async function updateProfile(
  preferred_categories: number[],
  signal?: AbortSignal
): Promise<Profile> {
  const res = await authFetch(`${API_URL}/users/profile/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ preferred_categories }),
    signal,
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`Error ${res.status}: ${res.statusText} ${errBody}`);
  }

  return res.json();
}
