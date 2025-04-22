"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItemButton,
  ListItemText,
  Checkbox,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import { updateProfile } from "@/app/api/profile/route";
import { usePreferences } from "@/context/PreferencesContext";
import type { Category } from "@/app/api/categories/route";

export default function UpdatePreferencesButton() {
  const { allCats, selectedCats, setSelectedCats } = usePreferences();

  const [tempSelected, setTempSelected] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTempSelected(selectedCats);
  }, [selectedCats]);

  const handleOpen = () => {
    setTempSelected(selectedCats);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = (catId: number) => {
    setTempSelected((prev) =>
      prev.find((c) => c.id === catId)
        ? prev.filter((c) => c.id !== catId)
        : [...prev, allCats.find((c) => c.id === catId)!]
    );
  };

  const handleSave = async () => {
    try {
      const updatedProfile = await updateProfile(tempSelected.map((c) => c.id));

      const newCats = allCats.filter((c) =>
        updatedProfile.preferred_categories.includes(c.id)
      );
      setSelectedCats(newCats);
    } catch (error) {
    } finally {
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        onClick={handleOpen}
        startIcon={<SettingsIcon />}
        sx={{
          py: 1,
          mr: 2,
          borderRadius: 3,
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Update preferences
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SettingsIcon color="primary" />
          User Preferences
        </DialogTitle>
        <DialogContent dividers>
          {allCats.length > 0 ? (
            <List>
              {allCats.map((cat) => (
                <ListItemButton
                  key={cat.id}
                  onClick={() => handleToggle(cat.id)}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <Checkbox
                    edge="start"
                    checked={tempSelected.some((c) => c.id === cat.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={cat.name} />
                </ListItemButton>
              ))}
            </List>
          ) : (
            <Typography variant="body1">
              No categories available to update.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClose}
            color="primary"
            variant="outlined"
            sx={{ borderRadius: 3 }}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            sx={{ borderRadius: 3 }}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
