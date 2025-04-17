"use client";

import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Profile Icon */}
      <button
        onMouseEnter={() => setIsOpen(true)} // Show dropdown when hovering on the profile icon
        className="p-2 rounded-full hover:bg-[#D35C42] transition duration-200 ease-in-out"
      >
        <UserCircleIcon className="h-8 w-8 text-gray-800 hover:text-gray-200" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 z-50 transition-all duration-300 ease-out transform opacity-100"
          onMouseEnter={() => setIsOpen(true)}  // Keep dropdown open when hovering over the menu
          onMouseLeave={() => setIsOpen(false)} // Close dropdown when mouse leaves the menu
        >
          {/* Login Button */}
          <Link href="/user/auth/logIn">  {/* Add the link to the login page */}
            <button className="w-full bg-[#D35C42] text-white py-2 rounded-md hover:bg-[#D35C42] transition-colors duration-200">
              Login to your account
            </button>
          </Link>

          {/* Additional Information */}
          <div className="mt-4 text-sm text-gray-600">
            <p className="font-semibold text-[#582445]">By creating an account you can -</p>
            <ul className="mt-2 space-y-2 list-inside">
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-2">✅</span> Apply to colleges directly
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-2">✅</span> Shortlist colleges for quick access
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-2">✅</span> Get free counselling
              </li>
            </ul>
          </div>

          {/* Create Account Button */}
          <Link href="/user/auth/signUp">  {/* Add the link to the register page */}
            <button className="w-full mt-3 border border-[#D35C42] text-[#D35C42] py-2 rounded-md hover:bg-[#F9E0D4] transition-all duration-200 ease-in">
              Create an account
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
