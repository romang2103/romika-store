import { create } from "zustand";
import { logoutAction } from "@/app/(auth)/login/actions";

interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  setAuth: (isAuthenticated: boolean, role: string | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: null,
  setAuth: (isAuthenticated: boolean, role: string | null) => 
    set({ isAuthenticated, role }),
  logout: async () => {
    try {
      await logoutAction();
      set({ isAuthenticated: false, role: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
})); 