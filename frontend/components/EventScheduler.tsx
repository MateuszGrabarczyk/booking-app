import { Scheduler } from "@aldabil/react-scheduler";
import { Box, Button, Typography } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { toast } from "react-hot-toast";
import { Slot, createBooking, deleteBooking } from "@/app/api/slots/route";

interface Props {
  events: any[];
  reloadSlots: () => void;
  onSelectedDateChange: (date: Date) => void;
}

export default function EventScheduler({
  events,
  reloadSlots,
  onSelectedDateChange,
}: Props) {
  return (
    <Scheduler
      view="week"
      editable={false}
      disableViewNavigator
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
      onSelectedDateChange={onSelectedDateChange}
      onDelete={async (id: number) => {
        try {
          await deleteBooking(id);
          reloadSlots();
          toast.success("Booking cancelled.");
          return id;
        } catch {
          toast.error("Booking cancellation failed.");
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
                  toast.success("Booking confirmed!");
                } catch {
                  toast.error("Booking failed.");
                }
              }}
              sx={{
                py: 1,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Book an event
            </Button>
          </Box>
        );
      }}
      viewerTitleComponent={(event) => (
        <Typography variant="h6">{event.title}</Typography>
      )}
    />
  );
}
