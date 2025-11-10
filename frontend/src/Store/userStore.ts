import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  userId?: any;
  id?: string;
  _id: string;
  name: string;
  email: string;
  phone: string;
  token?: string;
}

interface CollegeShortlist {
  id: string;
  name: string;
  location: string;
}

interface UserStore {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  shortlist: CollegeShortlist[];
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  addToShortlist: (college: CollegeShortlist) => void;
  removeFromShortlist: (collegeId: string) => void;
  clearShortlist: () => void;
  isCollegeShortlisted: (collegeId: string) => boolean;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      shortlist: [],

      // ✅ Save user and token
      setUser: (user) =>
        set({
          user,
          token: user?.token || null,
          isLoggedIn: !!user,
        }),

      setToken: (token) => set({ token }),

      addToShortlist: (college) => {
        const current = get().shortlist;
        if (!current.find((c) => c.id === college.id)) {
          set({ shortlist: [...current, college] });
        }
      },

      removeFromShortlist: (collegeId) => {
        set({
          shortlist: get().shortlist.filter((c) => c.id !== collegeId),
        });
      },

      clearShortlist: () => set({ shortlist: [] }),

      isCollegeShortlisted: (collegeId) =>
        !!get().shortlist.find((c) => c.id === collegeId),

      logout: () => set({ user: null, token: null, isLoggedIn: false, shortlist: [] }),
    }),
    {
      name: "user_store",
      storage: {
        getItem: (key) => {
          const value = sessionStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: (key, value) =>
          sessionStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => sessionStorage.removeItem(key),
      },
    }
  )
);
