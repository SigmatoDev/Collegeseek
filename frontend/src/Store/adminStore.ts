import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Admin {
  id: string; // ✅ changed from _id to id
  name: string;
  email: string;
  phone: string;
}

interface AdminStore {
  admin: Admin | null;
  isLoggedIn: boolean;
  setAdmin: (admin: Admin | null) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      admin: null,
      isLoggedIn: false,
      setAdmin: (admin) => set({ admin, isLoggedIn: !!admin }),
      logout: () => set({ admin: null, isLoggedIn: false }),
    }),
    {
      name: "admin_store",
      storage: {
        getItem: (key) => {
          const value = sessionStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: (key, value) => {
          sessionStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: (key) => {
          sessionStorage.removeItem(key);
        },
      },
    }
  )
);