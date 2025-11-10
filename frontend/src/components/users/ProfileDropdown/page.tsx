"use client";

import { useUserStore } from "@/Store/userStore";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoggedIn, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    window.location.reload(); // optional: refresh to reflect logout globally
  };

  return (
    <div className="relative">
      {/* Profile Icon */}
      <button
        onMouseEnter={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-[#D35C42] transition duration-200 ease-in-out"
      >
        <UserCircleIcon className="h-8 w-8 text-gray-800 hover:text-gray-200" />
      </button>

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
              <Link href="/user/auth/logIn">
                <button className="w-full bg-[#D35C42] text-white py-2 rounded-md hover:bg-[#c14e36] transition-colors duration-200">
                  Login to your account
                </button>
              </Link>

              {/* Info */}
              <div className="mt-4 text-sm text-gray-600">
                <p className="font-semibold text-[#582445]">
                  By creating an account you can
                </p>
                <ul className="mt-2 list-disc list-inside space-y-2 text-gray-700">
                  <li>Shortlist colleges</li>
                  <li>Get free counselling</li>
                </ul>
              </div>

              {/* Signup */}
              <Link href="/user/auth/signUp">
                <button className="w-full mt-3 border border-[#D35C42] text-[#D35C42] py-2 rounded-md hover:bg-[#F9E0D4] transition-all duration-200 ease-in">
                  Create an account
                </button>
              </Link>
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
