import React from "react";
import Box from "@mui/material/Box";
import NavBar from "@/components/NavBar";

interface Props {
  children: React.ReactNode;
}

export default function CalendarLayout({ children }: Props) {
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
          {children}
        </Box>
      </Box>
    </Box>
  );
}
