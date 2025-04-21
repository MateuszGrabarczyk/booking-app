"use client";

import { useState, useEffect } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import Box from "@mui/material/Box";
import { useAuthGuard } from "@/lib/useAuthGuard";
import NavBar from "@/components/NavBar";
import { useAvailableSlots } from "@/hooks/useAvailableSlots";
import { Slot } from "../api/slots/route";

export default function WeekCalendar() {
  const isAuth = useAuthGuard();
  const [mounted, setMounted] = useState(false);

  const [categories] = useState<number[]>([1, 2, 3]);

  const { slots, loading, error } = useAvailableSlots(categories);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isAuth || !mounted) return null;

  const events = slots.map((slot: Slot) => ({
    event_id: slot.id,
    start: new Date(slot.start),
    end: new Date(slot.end),
    title: slot.is_booked_by_user
      ? `Your Booking - ${slot.category.name}`
      : slot.is_taken
      ? `Taken - ${slot.category.name}`
      : slot.category.name,
    color: slot.is_booked_by_user
      ? "#4caf50"
      : slot.is_taken
      ? "#f44336"
      : undefined,
  }));

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar />

      <Box
        sx={{
          flex: 1,
          p: 2,
          bgcolor: "#f5f5f5",
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1000,
            bgcolor: "background.paper",
            boxShadow: 3,
            borderRadius: 2,
            p: 2,
            overflow: "auto",
          }}
        >
          {error && <div style={{ color: "red" }}>Error: {error}</div>}
          <Scheduler
            view="week"
            editable={false}
            events={events}
            week={{
              startHour: 0,
              endHour: 24,
              step: 60,
              navigation: true,
              weekDays: [0, 1, 2, 3, 4, 5, 6],
              weekStartOn: 0,
            }}
            timeZone="Europe/Warsaw"
          />
        </Box>
      </Box>
    </Box>
  );
}
