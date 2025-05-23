"use client";

import { useEffect, useState } from "react";
import { Card, Tabs, Tab, Box, Typography } from "@mui/material";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { getAccessToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      router.replace("/calendar");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: 6,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          aria-label="auth tabs"
          centered
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab label="Login" sx={{ textTransform: "none", fontWeight: 600 }} />
          <Tab
            label="Register"
            sx={{ textTransform: "none", fontWeight: 600 }}
          />
        </Tabs>

        {tab === 0 ? (
          <Box>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Welcome Back
            </Typography>
            <LoginForm />
          </Box>
        ) : (
          <Box>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 700, mb: 2 }}
            >
              Create Account
            </Typography>
            <RegisterForm />
          </Box>
        )}
      </Card>
    </Box>
  );
}
