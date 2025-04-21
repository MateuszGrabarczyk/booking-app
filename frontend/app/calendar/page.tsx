"use client";
import { useState, useEffect } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import Box from "@mui/material/Box";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function WeekCalendar() {
  const isAuth = useAuthGuard();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isAuth || !mounted) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "#f5f5f5",
        p: 2,
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1000,
          maxHeight: "calc(100vh - 32px)",
          bgcolor: "background.paper",
          boxShadow: 3,
          borderRadius: 2,
          p: 2,
          overflow: "auto",
        }}
      >
        <Scheduler
          view="week"
          editable={false}
          week={{
            startHour: 0,
            endHour: 24,
            step: 60,
            navigation: true,
            weekDays: [0, 1, 2, 3, 4, 5, 6],
            weekStartOn: 0,
          }}
          timeZone="Europe/Berlin"
        />
      </Box>
    </Box>
  );
}
