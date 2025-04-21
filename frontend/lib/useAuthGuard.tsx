"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAccessToken } from "./auth";

export function useAuthGuard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  return authorized;
}
