"use client";

import { useUserStore } from "@/Store/userStore";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoggedIn, logout } = useUserStore();
  const router = useRouter();

  // ✅ Handles logout
  const handleLogout = () => {
    logout();
    window.location.reload(); // ensures full refresh of UI state
  };

  // ✅ Common helper: saves current page before navigating
  const saveRedirectAndNavigate = (path: string, label: string) => {
    const currentPath = window.location.pathname + window.location.search;
    sessionStorage.setItem("redirectAfterLogin", currentPath);
    console.log(`💾 Saved redirectAfterLogin from dropdown (${label}):`, currentPath);
    router.push(path);
  };

  // ✅ Login redirect
  const handleLoginRedirect = () => saveRedirectAndNavigate("/user/auth/logIn", "login");

  // ✅ Signup redirect
  const handleSignupRedirect = () => saveRedirectAndNavigate("/user/auth/signUp", "signup");

  return (
    <div className="relative">
      {/* Profile Icon + Label */}
      <div
        className={`flex border-[2px] border-gray-200 hover:border-[#D35C42] rounded-full items-center space-x-2 pr-3 sm:space-x-1 transition-all duration-200 ease-in-out ${
          isLoggedIn ? "pr-3" : ""
        }`}
      >
        <button
          onMouseEnter={() => setIsOpen(true)}
          className="relative flex items-center justify-center p-1 rounded-full border border-gray-200 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md hover:scale-105 hover:border-[#D35C42]"
        >
          <UserCircleIcon className="h-8 w-8 text-gray-700 hover:text-[#D35C42]" />
        </button>

        {isLoggedIn ? (
          <span className="text-gray-700 font-semibold text-[12px] tracking-tight">
            {user?.name || "User"}
          </span>
        ) : (
          <button
            onClick={handleLoginRedirect}
            className="text-gray-700 font-semibold text-[12px] tracking-tight"
          >
            Login / Signup
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 z-50 transition-all duration-300 ease-out transform opacity-100"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {!isLoggedIn ? (
            <>
              {/* Login Button */}
              <button
                onClick={handleLoginRedirect}
                className="w-full bg-[#D35C42] text-white py-2 rounded-md hover:bg-[#c14e36] transition-colors duration-200"
              >
                Login to your account
              </button>

              {/* Info Section */}
              <div className="mt-4 text-sm text-gray-600">
                <p className="font-semibold text-[#582445]">
                  By creating an account you can
                </p>
                <ul className="mt-2 list-disc list-inside space-y-2 text-gray-700">
                  <li>Shortlist colleges</li>
                  <li>Get free counselling</li>
                </ul>
              </div>

              {/* Signup Button */}
              <button
                onClick={handleSignupRedirect}
                className="w-full mt-3 border border-[#D35C42] text-[#D35C42] py-2 rounded-md hover:bg-[#F9E0D4] transition-all duration-200 ease-in"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              {/* Greeting */}
              <div className="text-gray-800 font-semibold mb-2">
                Hi, {user?.name || "User"} 👋
              </div>

              {/* Dashboard */}
              <Link href="/user/profile">
                <button className="w-full bg-[#D35C42] text-white py-2 rounded-md hover:bg-[#c14e36] transition-colors duration-200">
                  Go to Dashboard
                </button>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full mt-3 border border-[#D35C42] text-[#D35C42] py-2 rounded-md hover:bg-[#F9E0D4] transition-all duration-200 ease-in"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
