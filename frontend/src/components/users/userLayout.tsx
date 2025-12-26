"use client";

import { ReactNode } from "react";
import UserHeader from "./userHeader/page";
import UserSidebar from "./userSideBar/page";
import withCustomerAuth from "./withCustomerAuth/page";
import { usePathname } from "next/navigation";
import Header from "../header/page";
import Footer from "../footer/page";

const UserLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/user/auth/logIn" || pathname === "/user/auth/signUp";

  // Skip layout wrapping for login/signup
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Main Website Header */}
      <Header />

      {/* Dashboard Layout */}
      <div className="min-h-screen bg-gray-50">
        {/* Dashboard Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 mb-6">
          <UserHeader />
        </div>

        {/* Main Section */}
        <div className="max-w-7xl mx-auto flex gap-0 px-4 sm:px-6 lg:px-10 py-0 pb-10">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <UserSidebar />
          </div>

          {/* Content */}
          <div className="flex-1 bg-white shadow-sm rounded-xl p-0 h-[calc(100vh-0px)] overflow-y-auto">
    {children}
  </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default withCustomerAuth(UserLayout);
