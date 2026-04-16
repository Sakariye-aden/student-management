import { create } from "zustand";
import {  persist }from 'zustand/middleware'
interface User {
  _id: string;
  name: string;
  email: string;
  "role":string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      // update state
      setAuth: (userData: User) =>
        set({
          user: userData,
          isAuthenticated: true,
        }),

      // clear state
      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage", // storage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);


export default useAuthStore;