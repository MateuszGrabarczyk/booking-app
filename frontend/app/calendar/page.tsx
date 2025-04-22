"use client";

import { useState, useEffect, useMemo } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import NavBar from "@/components/NavBar";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { useAvailableSlots } from "@/hooks/useAvailableSlots";
import { Slot, createBooking, deleteBooking } from "../api/slots/route";
import { Chip } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { usePreferences } from "@/context/PreferencesContext";

export default function WeekCalendar() {
  const isAuth = useAuthGuard();
  const [mounted, setMounted] = useState(false);

  const { allCats, selectedCats, setSelectedCats } = usePreferences();

  const catIds = useMemo(() => selectedCats.map((c) => c.id), [selectedCats]);
  const { slots, refetch: reloadSlots } = useAvailableSlots(catIds);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isAuth || mounted === false) return null;

  const events = slots.map((slot: Slot) => ({
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
          <Autocomplete
            multiple
            disableCloseOnSelect
            options={allCats}
            getOptionLabel={(opt) => opt.name}
            value={selectedCats}
            onChange={(_, value) => setSelectedCats(value)}
            limitTags={3}
            renderTags={(value, getTagProps) =>
              value.map((option, idx) => {
                const { key, ...other } = getTagProps({ index: idx });
                return (
                  <Chip
                    key={key}
                    size="small"
                    variant="outlined"
                    label={option.name}
                    {...other}
                  />
                );
              })
            }
            popupIcon={<KeyboardArrowDownIcon />}
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                label="Categories"
                placeholder="Select…"
                size="small"
                variant="outlined"
              />
            )}
            sx={{ mb: 2 }}
          />

          <Scheduler
            view="week"
            editable={false}
            events={events}
            timeZone="Europe/Warsaw"
            week={{
              startHour: 0,
              endHour: 24,
              step: 60,
              navigation: true,
              weekDays: [0, 1, 2, 3, 4, 5, 6],
              weekStartOn: 0,
            }}
            onDelete={async (id: number) => {
              try {
                await deleteBooking(id);
                reloadSlots();
              } catch (err: any) {
                console.error(err);
                alert("Failed to cancel booking: " + err.message);
                throw err;
              }
            }}
            viewerExtraComponent={(fields, event) => {
              const slot = (event as any).rawSlot as Slot;
              if (slot.is_taken || slot.is_booked_by_user) return null;
              return (
                <Box sx={{ mt: 2, textAlign: "right" }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<EventAvailableIcon />}
                    onClick={async () => {
                      try {
                        await createBooking(slot.id);
                        reloadSlots();
                      } catch (e: any) {
                        console.error(e);
                        alert("Booking failed: " + e.message);
                      }
                    }}
                  >
                    Book an event
                  </Button>
                </Box>
              );
            }}
            viewerTitleComponent={(event) => (
              <Typography variant="h6">{(event as any).title}</Typography>
            )}
          />
        </Box>
      </Box>
    </Box>
  );
}
