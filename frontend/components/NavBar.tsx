import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import LogoutButton from "./LogoutButton";

export default function NavBar() {
  return (
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

        <LogoutButton />
      </Toolbar>
    </AppBar>
  );
}
