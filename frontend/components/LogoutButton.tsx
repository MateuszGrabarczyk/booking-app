import Button from "@mui/material/Button";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useRouter } from "next/navigation";
import { clearTokens } from "@/lib/auth";
import toast from "react-hot-toast";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = (): void => {
    clearTokens();
    toast.success("Logged out successfully!");
    router.replace("/");
  };

  return (
    <Button
      color="primary"
      variant="contained"
      startIcon={<ExitToAppIcon />}
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
  );
}
