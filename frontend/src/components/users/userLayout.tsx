"use client";

import { ReactNode, useState, useEffect } from "react";
import UserHeader from "./userHeader/page";
import UserSidebar from "./userSideBar/page";
import { usePathname } from "next/navigation";
import Header from "../header/page";
import Footer from "../footer/page";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const UserLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isAuthPage = pathname?.startsWith("/user/auth");

  if (isAuthPage) return <>{children}</>;

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 mb-4 sm:mb-6">
          <UserHeader />
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden px-4 sm:px-6 mb-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border shadow-sm text-sm font-semibold"
          >
            <Bars3Icon className="h-4 w-4" />
            Menu
          </button>
        </div>

        {/* Backdrop */}
        <div
          onClick={() => setSidebarOpen(false)}
          className={`lg:hidden fixed inset-0 bg-black/40 z-[998] transition ${
            sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Drawer */}
        <aside
          className={`lg:hidden fixed top-0 left-0 h-full w-[72vw] max-w-[280px] bg-white z-[999] shadow-2xl transition ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between p-4 border-b">
            <span className="font-bold">Dashboard</span>
            <button onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>

          <UserSidebar />
        </aside>

        {/* Main */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-10 flex flex-col lg:flex-row">
          <div className="hidden lg:block w-64">
            <UserSidebar />
          </div>

          <div className="flex-1 bg-white rounded-xl shadow-sm min-h-[60vh] lg:h-screen lg:overflow-y-auto">
            {children}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default UserLayout;