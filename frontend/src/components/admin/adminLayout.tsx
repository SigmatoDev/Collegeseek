"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "./navigater/header";
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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-screen">
        {/* Header (Fixed) */}
        <Header />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto mt-4">{children}</main>
      </div>
    </div>
  );
};

export default withAdminAuth(AdminLayout);
