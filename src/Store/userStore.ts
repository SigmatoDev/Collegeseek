import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  userId: any;
  id?: string;        // From frontend or token (optional)
  _id: string;        // MongoDB ID (required)
  name: string;
  email: string;
  phone: string;
  token: string;      // Added token for authentication
}

interface UserStore {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      setUser: (user) => set({ user, isLoggedIn: !!user }),  // Set user and update loggedIn status
      logout: () => set({ user: null, isLoggedIn: false }),  // Clear user and set loggedIn to false
    }),
    {
      name: "user_store", // key used for sessionStorage
      storage: {
        getItem: (key) => {
          const value = sessionStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: (key, value) => {
          sessionStorage.setItem(key, JSON.stringify(value)); // Store the data in sessionStorage
        },
        removeItem: (key) => {
          sessionStorage.removeItem(key); // Remove item from sessionStorage
        },
      },
    }
  )
);
