"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import withAdminAuth from "./withAdminAuth/page";

// ⛔ IMPORTANT FIX: Disable SSR for Sidebar
const Sidebar = dynamic(() => import("./sidebar/sidebar"), {
  ssr: false,
});

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  // Hide layout on login or signup pages
 const isAuthPage =
  pathname === "/cs-admin" ||
  pathname === "/admin/auth/signUp" ||
  pathname.startsWith("/admin/auth/resetPassword") ||
  pathname.startsWith("/admin/auth/forgotPassword");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar – now Client Only (NO hydration mismatch) */}
      <div className="sticky top-0 h-screen flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-10">
        {children}
      </main>
    </div>
  );
};

export default withAdminAuth(AdminLayout);
