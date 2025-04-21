import { useState, useEffect } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useProfiles } from "@/hooks/useProfiles";
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
import { updateProfile } from "@/app/api/profile/route";

export default function UpdatePreferencesButton() {
  const { profile } = useProfiles();
  const { categories } = useCategories();
  const [currentCats, setCurrentCats] = useState<number[]>(
    profile?.preferred_categories || []
  );
  const [open, setOpen] = useState(false);
  const [selectedCats, setSelectedCats] = useState<number[]>(
    profile?.preferred_categories || []
  );

  useEffect(() => {
    if (profile?.preferred_categories) {
      setCurrentCats(profile.preferred_categories);
      setSelectedCats(profile.preferred_categories);
    }
  }, [profile]);

  const handleOpen = () => {
    setSelectedCats(currentCats);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = (catId: number) => {
    setSelectedCats((prevSelected) =>
      prevSelected.includes(catId)
        ? prevSelected.filter((id) => id !== catId)
        : [...prevSelected, catId]
    );
  };

  const handleSave = async () => {
    try {
      const updatedProfile = await updateProfile(selectedCats);
      setCurrentCats(updatedProfile.preferred_categories);
      setSelectedCats(updatedProfile.preferred_categories);
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
          {categories && categories.length > 0 ? (
            <List>
              {categories.map((cat) => (
                <ListItemButton
                  key={cat.id}
                  onClick={() => handleToggle(cat.id)}
                  sx={{ borderRadius: 1, mb: 0.5 }}
                >
                  <Checkbox
                    edge="start"
                    checked={selectedCats.includes(cat.id)}
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
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            sx={{ borderRadius: 3 }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
