"use client";

import { useState, useEffect } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { clearTokens } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

export default function WeekCalendar() {
  const router = useRouter();
  const isAuth = useAuthGuard();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isAuth || !mounted) return null;

  const handleLogout = () => {
    clearTokens();
    router.replace("/");
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#f5f5f5" }}>
        <Toolbar>
          <Typography
            variant="h6"
            color="primary"
            fontWeight={600}
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Booking App
          </Typography>
          <Button
            color="primary"
            variant="contained"
            onClick={handleLogout}
            sx={{
              py: 1,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

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
    </Box>
  );
}
