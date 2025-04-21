import { authFetch } from "@/lib/auth";

export type Category = {
  id: number;
  name: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function fetchCategories(
  signal?: AbortSignal
): Promise<Category[]> {
  const res = await authFetch(`${API_URL}/events/timeslots/categories/`, {
    headers: { "Content-Type": "application/json" },
    signal,
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`Error ${res.status}: ${res.statusText} ${errBody}`);
  }

  return res.json();
}
