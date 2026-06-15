// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface User {
//   userId?: any;
//   id?: string;
//   _id: string;
//   name: string;
//   email: string;
//   phone: string;
//   token?: string;
// }

// interface CollegeShortlist {
//   id: string;
//   name: string;
//   location: string;
// }

// interface UserStore {
//   user: User | null;
//   token: string | null;
//   isLoggedIn: boolean;
//   shortlist: CollegeShortlist[];

//   // 🔔 Notification State
//   hasNotification: boolean;
//   triggerNotification: () => void;
//   clearNotification: () => void;

//   setUser: (user: User | null) => void;
//   setToken: (token: string | null) => void;
//   addToShortlist: (college: CollegeShortlist) => void;
//   removeFromShortlist: (collegeId: string) => void;
//   clearShortlist: () => void;
//   isCollegeShortlisted: (collegeId: string) => boolean;
//   logout: () => void;
// }

// export const useUserStore = create<UserStore>()(
//   persist(
//     (set, get) => ({
//       user: null,
//       token: null,
//       isLoggedIn: false,
//       shortlist: [],

//       // 🔔 Notification (initial false)
//       hasNotification: false,

//       // 🔔 Trigger red-dot
//       triggerNotification: () => set({ hasNotification: true }),

//       // 🔔 Clear red-dot
//       clearNotification: () => set({ hasNotification: false }),

//       // Save user and token
//       setUser: (user) =>
//         set({
//           user,
//           token: user?.token || null,
//           isLoggedIn: !!user,
//         }),

//       setToken: (token) => set({ token }),

//       // Add college to shortlist + trigger notification
//       addToShortlist: (college) => {
//         const current = get().shortlist;

//         if (!current.find((c) => c.id === college.id)) {
//           set({
//             shortlist: [...current, college],
//             hasNotification: true, // 🔔 automatically turn ON
//           });
//         }
//       },

//       removeFromShortlist: (collegeId) => {
//         set({
//           shortlist: get().shortlist.filter((c) => c.id !== collegeId),
//         });
//       },

//       clearShortlist: () => set({ shortlist: [] }),

//       isCollegeShortlisted: (collegeId) =>
//         !!get().shortlist.find((c) => c.id === collegeId),

//       logout: () =>
//         set({
//           user: null,
//           token: null,
//           isLoggedIn: false,
//           shortlist: [],
//           hasNotification: false,
//         }),
//     }),
//     {
//       name: "user_store",
//       storage: {
//         getItem: (key) => {
//           const value = sessionStorage.getItem(key);
//           return value ? JSON.parse(value) : null;
//         },
//         setItem: (key, value) =>
//           sessionStorage.setItem(key, JSON.stringify(value)),
//         removeItem: (key) => sessionStorage.removeItem(key),
//       },
//     }
//   )
// );
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone: string;
  authProvider?: "local" | "google";
    profileImage?: string   // ✅ FIX ADDED

  token?: string; // ✅ token lives on user too for convenience
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
  hasNotification: boolean;
  isHydrated: boolean;

  triggerNotification: () => void;
  clearNotification: () => void;

  // ✅ setUser now also syncs token if present on user object
  setUser: (user: (User & { token?: string }) | null) => void;
  setToken: (token: string | null) => void;

  addToShortlist: (college: CollegeShortlist) => void;
  removeFromShortlist: (collegeId: string) => void;
  clearShortlist: () => void;
  isCollegeShortlisted: (collegeId: string) => boolean;

  logout: () => void;
  setHydrated: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      shortlist: [],
      hasNotification: false,
      isHydrated: false,

      triggerNotification: () => set({ hasNotification: true }),
      clearNotification: () => set({ hasNotification: false }),

      // ✅ Syncs both user and token in one call
      // Accepts user with optional token field (from login response)
      setUser: (user) => {
        if (!user) {
          set({ user: null, token: null, isLoggedIn: false });
          return;
        }
        const { token: userToken, ...userWithoutToken } = user;
        const userId = userWithoutToken._id || userWithoutToken.id;
        const authProvider =
          userWithoutToken.authProvider || get().user?.authProvider || "local";
        set({
          user: { ...userWithoutToken, _id: userId, authProvider } as User,
          isLoggedIn: true,
          // Only update token if a new one is provided
          ...(userToken ? { token: userToken } : {}),
        });
      },

      setToken: (token) => set({ token }),

      addToShortlist: (college) => {
        const current = get().shortlist;
        if (!current.find((c) => c.id === college.id)) {
          set({ shortlist: [...current, college], hasNotification: true });
        }
      },

      removeFromShortlist: (collegeId: string) =>
        set({ shortlist: get().shortlist.filter((c) => c.id !== collegeId) }),

      clearShortlist: () => set({ shortlist: [] }),

      isCollegeShortlisted: (collegeId: string) =>
        !!get().shortlist.find((c) => c.id === collegeId),

      logout: () => {
        set({
          user: null,
          token: null,
          isLoggedIn: false,
          shortlist: [],
          hasNotification: false,
          // ✅ keep isHydrated: true — store is still hydrated after logout
        });

        // Clear session storage
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("redirectAfterLogin");
          sessionStorage.removeItem("pendingShortlistCollege");
          sessionStorage.removeItem("authToken");
          window.location.href = "/user/auth/logIn";
        }
      },

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "user_store",
      // ✅ Persist only essential fields — skip isHydrated (runtime only)
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
        shortlist: state.shortlist,
        hasNotification: state.hasNotification,
      }),
      storage: {
        getItem: (key) => {
          if (typeof window === "undefined") return null;
          const value = sessionStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: (key, value) => {
          if (typeof window !== "undefined")
            sessionStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: (key) => {
          if (typeof window !== "undefined")
            sessionStorage.removeItem(key);
        },
      },
      onRehydrateStorage: () => (state) => {
        if (state?.user && !state.user._id && state.user.id) {
          state.setUser(state.user);
        }
        state?.setHydrated();
      },
    }
  )
);
