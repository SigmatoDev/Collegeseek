"use client";

import { ReactNode } from "react";
import UserHeader from "./userHeader/page";
import UserSidebar from "./userSideBar/page";
import withCustomerAuth from "./withCustomerAuth/page";
import { usePathname } from "next/navigation";

const UserLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isAuthPage = pathname === "/user/auth/logIn" || pathname === "/user/auth/signUp";

  // If the user is on the login or signup page, just render the children (no layout)
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Render the full layout for authenticated users
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0">
        <UserSidebar />
      </div>

      {/* Main content with header */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default withCustomerAuth(UserLayout); // Wrap with auth check
