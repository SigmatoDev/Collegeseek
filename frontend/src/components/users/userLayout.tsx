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
        <div className="mx-[313px] pt-10">
          <UserHeader />
        </div>

        {/* Main Section */}
        <div className="max-w-7xl mx-auto flex gap-0 px-0 py-0 pb-10">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <UserSidebar />
          </div>

          {/* Content */}
          <div className="flex-1 bg-white shadow-sm rounded-xl p-0">
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
