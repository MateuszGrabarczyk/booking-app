"use client";

import { useMemo } from "react";
import CalendarLayout from "@/components/CalendarLayout";
import CategorySelector from "@/components/CategorySelector";
import EventScheduler from "@/components/EventScheduler";
import { useWeekDateRange } from "@/hooks/useWeekDateRange";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { useAvailableSlots } from "@/hooks/useAvailableSlots";
import { usePreferences } from "@/context/PreferencesContext";

export default function CalendarPage() {
  const isAuth = useAuthGuard();
  const { allCats, selectedCats, setSelectedCats } = usePreferences();
  const catIds = useMemo(() => selectedCats.map((c) => c.id), [selectedCats]);
  const { currentDate, setCurrentDate, dateRange } = useWeekDateRange();

  const { slots, refetch: reloadSlots } = useAvailableSlots(
    catIds,
    dateRange.startDate,
    dateRange.endDate
  );

  if (!isAuth) return null;

  const events = slots.map((slot) => ({
    event_id: slot.id,
    start: new Date(slot.start),
    end: new Date(slot.end),
    title: slot.is_booked_by_user
      ? `Your Booking – ${slot.category.name}`
      : slot.is_taken
      ? `Taken – ${slot.category.name}`
      : slot.category.name,
    color: slot.is_booked_by_user
      ? "#4caf50"
      : slot.is_taken
      ? "#f44336"
      : undefined,
    rawSlot: slot,
    deletable: slot.is_booked_by_user,
  }));

  return (
    <CalendarLayout>
      <CategorySelector
        allCats={allCats}
        selectedCats={selectedCats}
        setSelectedCats={setSelectedCats}
      />
      <EventScheduler
        events={events}
        reloadSlots={reloadSlots}
        onSelectedDateChange={(date) => {
          setCurrentDate(date);
          reloadSlots();
        }}
      />
    </CalendarLayout>
  );
}
