"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar/sidebar";
import withAdminAuth from "./withAdminAuth/page";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  // Hide layout on login or signup pages
  const isAuthPage =
    pathname === "/admin/auth/logIn" || pathname === "/admin/auth/signUp";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="sticky top-0 h-screen flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 min-h-screen overflow-y-auto p-6 lg:p-10">
        {children}
      </main>
    </div>
  );
};

export default withAdminAuth(AdminLayout);
