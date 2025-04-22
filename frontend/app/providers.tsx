"use client";

import React, { ReactNode } from "react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { PreferencesProvider } from "@/context/PreferencesContext";
import { Toaster } from "react-hot-toast";

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
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
        }}
      />
    </ThemeProvider>
  );
}
