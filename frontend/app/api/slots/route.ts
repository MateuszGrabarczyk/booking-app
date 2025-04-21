import { authFetch } from "@/lib/auth";
import { Category } from "../categories/route";

export type Slot = {
  id: number;
  category: Category;
  start: string;
  end: string;
  is_taken: boolean;
  is_booked_by_user: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function fetchAvailableSlots(
  categories: number[],
  signal?: AbortSignal
): Promise<Slot[]> {
  const qs = categories.join(",");
  const res = await authFetch(
    `${API_URL}/events/timeslots/available/?categories=${qs}`,
    {
      headers: { "Content-Type": "application/json" },
      signal,
    }
  );

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`Error ${res.status}: ${res.statusText} ${errBody}`);
  }

  return res.json();
}
