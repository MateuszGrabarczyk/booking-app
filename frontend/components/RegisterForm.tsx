"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Box, Alert, CircularProgress } from "@mui/material";
import { registerApi } from "../lib/auth";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password2?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (password !== confirm) {
      setFieldErrors({ password2: "Passwords don't match" });
      return;
    }

    setLoading(true);
    try {
      await registerApi(email, password, confirm);
      setEmail("");
      setPassword("");
      setConfirm("");
      toast.success("Registration successful! Please log in.");
      router.push("/");
    } catch (err: any) {
      if (err.email) {
        setFieldErrors((fe) => ({ ...fe, email: err.email[0] }));
      }
      if (err.password2) {
        setFieldErrors((fe) => ({ ...fe, password2: err.password2[0] }));
      }
      if (!err.email && !err.password2) {
        setError(err.detail || "Registration failed");
      }
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
        error={!!fieldErrors.email}
        helperText={fieldErrors.email}
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
      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        margin="normal"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
        error={!!fieldErrors.password2}
        helperText={fieldErrors.password2}
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
        {loading ? <CircularProgress size={24} /> : "Register"}
      </Button>
    </Box>
  );
}
