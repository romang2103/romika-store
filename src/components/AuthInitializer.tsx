"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

interface AuthInitializerProps {
  isAuthenticated: boolean;
  role: string | null;
}

export default function AuthInitializer({ isAuthenticated, role }: AuthInitializerProps) {
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    // Initialize auth state from server-side cookies
    setAuth(isAuthenticated, role);
  }, [isAuthenticated, role, setAuth]);

  return null;
}
