"use client";

import { useUserStore } from "@/Store/userStore";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoggedIn, logout } = useUserStore();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();

    // ✅ smooth redirect
    router.replace("/user/auth/logIn");
  };

  const saveRedirectAndNavigate = (path: string, label: string) => {
    const currentPath = window.location.pathname + window.location.search;
    sessionStorage.setItem("redirectAfterLogin", currentPath);
    console.log(
      `💾 Saved redirectAfterLogin from dropdown (${label}):`,
      currentPath,
    );
    router.push(path);
  };

  const handleLoginRedirect = () =>
    saveRedirectAndNavigate("/user/auth/logIn", "login");
  const handleSignupRedirect = () =>
    saveRedirectAndNavigate("/user/auth/signUp", "signup");

  // Close on outside tap/click — needed for mobile touch
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Icon + Label */}
      <div
        className={`flex border-[2px] border-gray-200 hover:border-[#D35C42] rounded-full items-center space-x-2 pr-3 sm:space-x-1 transition-all duration-200 ease-in-out ${
          isLoggedIn ? "pr-3 cursor-pointer" : ""
        }`}
        // Desktop: hover to open | Mobile: tap to toggle
        onMouseEnter={() => {
          if (typeof window !== "undefined" && window.innerWidth >= 768) {
            setIsOpen(true);
          }
        }}
        onClick={() => {
          if (isLoggedIn) setIsOpen((prev) => !prev);
        }}
        role={isLoggedIn ? "button" : undefined}
        tabIndex={isLoggedIn ? 0 : -1}
        onKeyDown={(e) => {
          if (!isLoggedIn) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
      >
        <span className="relative flex items-center justify-center p-1 rounded-full border border-gray-200 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md hover:scale-105 hover:border-[#D35C42] overflow-hidden">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              className="h-6 w-6 md:h-8 md:w-8 rounded-full object-cover"
              onError={(e) => {
                // fallback to icon if image fails
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <UserCircleIcon className="h-6 w-6 md:h-8 md:w-8 text-gray-700 hover:text-[#D35C42]" />
          )}
        </span>

        {isLoggedIn ? (
          <span className="text-gray-700 font-semibold text-[10px] md:text-[12px] tracking-tight">
            {user?.name || "User"}
          </span>
        ) : (
          <button
            onClick={handleLoginRedirect}
            className="text-gray-700 font-semibold text-[10px] md:text-[12px] tracking-tight"
          >
            Login / Signup
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="
            mt-2 z-50
            transition-all duration-300 ease-out transform opacity-100

            /* Mobile: full-width anchored to right edge, won't overflow */
            right-0 w-[calc(100vw-2rem)] max-w-[280px]

            /* Desktop: fixed anchored right — unchanged */
            md:right-0 md:w-72

            bg-white shadow-lg rounded-lg p-4
          "
          // Desktop: keep open on hover | Mobile: stay open until outside tap
          onMouseEnter={() => {
            if (typeof window !== "undefined" && window.innerWidth >= 768) {
              setIsOpen(true);
            }
          }}
          onMouseLeave={() => {
            if (typeof window !== "undefined" && window.innerWidth >= 768) {
              setIsOpen(false);
            }
          }}
        >
          {!isLoggedIn ? (
            <>
              <button
                onClick={handleLoginRedirect}
                className="w-full bg-[#e35235] text-white py-2 rounded-md hover:bg-[#c14e36] transition-colors duration-200"
              >
                Login to your account
              </button>

              <div className="mt-4 text-sm text-gray-600">
                <p className="font-semibold text-[#582445]">
                  By creating an account you can
                </p>
                <ul className="mt-2 list-disc list-inside space-y-2 text-gray-700">
                  <li>Shortlist colleges</li>
                  <li>Get free counselling</li>
                </ul>
              </div>

              <button
                onClick={handleSignupRedirect}
                className="w-full mt-3 border border-[#e35235] text-[#e35235] py-2 rounded-md hover:bg-[#F9E0D4] transition-all duration-200 ease-in"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              <div className="text-gray-800 font-semibold mb-2">
                Hi, {user?.name || "User"} 👋
              </div>

              <Link href="/user/profile">
                <button className="w-full bg-[#D35C42] text-white py-2 rounded-md hover:bg-[#c14e36] transition-colors duration-200">
                  Go to Dashboard
                </button>
              </Link>

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
