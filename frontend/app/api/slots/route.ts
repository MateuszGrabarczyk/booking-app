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
  startDate: string,
  endDate: string,
  signal?: AbortSignal
): Promise<Slot[]> {
  const params = new URLSearchParams({
    categories: categories.join(","),
    start_date: startDate,
    end_date: endDate,
  });
  const res = await authFetch(
    `${API_URL}/events/timeslots/available/?${params.toString()}`,
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

export async function createBooking(
  slotId: number,
  signal?: AbortSignal
): Promise<number> {
  const res = await authFetch(`${API_URL}/events/timeslots/booking/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slot_id: slotId }),
    signal,
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`Error ${res.status}: ${res.statusText} ${errBody}`);
  }

  return res.json();
}

export async function deleteBooking(
  slotId: number,
  signal?: AbortSignal
): Promise<number> {
  const res = await authFetch(`${API_URL}/events/timeslots/booking/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slot_id: slotId }),
    signal,
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`Error ${res.status}: ${res.statusText} ${errBody}`);
  }

  return res.status;
}
