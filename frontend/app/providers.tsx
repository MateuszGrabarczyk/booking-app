"use client";

import React, { ReactNode } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { PreferencesProvider } from "@/context/PreferencesContext";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <PreferencesProvider>{children}</PreferencesProvider>
    </ThemeProvider>
  );
}
