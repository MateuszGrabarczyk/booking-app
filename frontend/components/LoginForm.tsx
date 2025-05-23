"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Box, Alert, CircularProgress } from "@mui/material";
import { loginApi, setTokens } from "../lib/auth";
import toast from "react-hot-toast";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const tokens = await loginApi(email, password);
      setTokens(tokens);
      toast.success("Login successful!");
      router.replace("/calendar");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        InputProps={{ sx: { borderRadius: 2 } }}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        InputProps={{ sx: { borderRadius: 2 } }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{
          mt: 3,
          py: 1.5,
          borderRadius: 3,
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        {loading ? <CircularProgress size={24} /> : "Log In"}
      </Button>
    </Box>
  );
}
