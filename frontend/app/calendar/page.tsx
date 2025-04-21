"use client";

import { useState, useEffect, useMemo } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuthGuard } from "@/lib/useAuthGuard";
import NavBar from "@/components/NavBar";
import { useAvailableSlots } from "@/hooks/useAvailableSlots";
import { useCategories } from "@/hooks/useCategories";
import { Slot } from "../api/slots/route";
import { Category } from "../api/categories/route";
import { Chip } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function WeekCalendar() {
  const isAuth = useAuthGuard();
  const [mounted, setMounted] = useState(false);

  const {
    categories: allCats,
    loading: catsLoading,
    error: catsError,
  } = useCategories();

  const [selectedCats, setSelectedCats] = useState<Category[]>([]);

  useEffect(() => {
    setSelectedCats(allCats);
  }, [catsLoading, allCats]);

  const catIds = useMemo(() => selectedCats.map((c) => c.id), [selectedCats]);
  const {
    slots,
    loading: slotsLoading,
    error: slotsError,
  } = useAvailableSlots(catIds);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isAuth || !mounted) return null;

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
          {slotsError && (
            <Box sx={{ mb: 2 }}>
              {slotsError && (
                <Box sx={{ color: "error.main" }}>{slotsError}</Box>
              )}
            </Box>
          )}
          {catsError ? (
            <Box sx={{ color: "error.main" }}>Failed to load categories</Box>
          ) : (
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
                  const tagProps = getTagProps({ index: idx });
                  const { key, ...other } = tagProps;
                  return (
                    <Chip
                      key={key}
                      size="small"
                      variant="outlined"
                      label={option.name}
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
          )}
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
