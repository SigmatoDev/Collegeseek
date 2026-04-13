"use client";

import { ReactNode, useState, useEffect } from "react";
import UserSidebar from "./userSideBar/page";
import { usePathname } from "next/navigation";
import Header from "../header/page";
import Footer from "../footer/page";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { BellIcon } from "@heroicons/react/24/outline";
import { useUserStore } from "@/Store/userStore";
import { useRouter } from "next/navigation";
import UserHeader from "./userHeader/page";

const AUTH_ROUTES = [
  "/user/auth/logIn",
  "/user/auth/signUp",
  "/user/auth/forgotPassword",
];

const UserLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  const isAuthPage =
    AUTH_ROUTES.includes(pathname ?? "") ||
    pathname?.startsWith("/user/auth/resetPassword");

  if (isAuthPage) return <>{children}</>;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 mb-4 sm:mb-6">
          <UserHeader />
        </div>
        {/* ── Backdrop (mobile) ── */}
        <div
          onClick={() => setSidebarOpen(false)}
          className={`lg:hidden fixed inset-0 bg-black/40 z-[998] transition-opacity ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* ── Drawer (mobile) ── */}
        <aside
          className={`lg:hidden fixed top-0 left-0 h-full w-[72vw] max-w-[280px] bg-white z-[999] shadow-2xl transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-medium">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
          <UserSidebar />
        </aside>

        {/* ── Main layout ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 flex gap-6">
          {/* Sidebar (desktop) */}
          <div className="hidden lg:block w-56 shrink-0">
            <UserSidebar />
          </div>

          {/* Page content */}
          <main className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm min-h-[60vh] overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserLayout;
