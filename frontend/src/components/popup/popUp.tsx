"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  EyeIcon,
  EyeSlashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { api_url } from "@/utils/apiCall";
import { useUserStore } from "@/Store/userStore";

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const PopUp = () => {
  const [registerData, setRegisterData] = useState<RegisterData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  useEffect(() => {
    setMounted(true);

    const isClosed = sessionStorage.getItem("registerPopupClosed");

    if (!isLoggedIn && isClosed !== "true") {
      setShowPopup(true);
    }
  }, [isLoggedIn]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setShowPopup(false);
    sessionStorage.setItem("registerPopupClosed", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { name, email, phone, password, confirmPassword } = registerData;

    if (!name || !email || !phone || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch(`${api_url}user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Account created successfully!");
        setTimeout(() => {
          setShowPopup(false);
          router.push("/user/auth/logIn");
        }, 2000);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  if (!mounted || !showPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl bg-white p-0 rounded-lg shadow-lg relative flex overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl font-bold z-10"
        >
          <XCircleIcon className="w-6 h-6 text-[#D35B42]" />
        </button>

        {/* Left side - Image */}
        <div className="w-1/2">
          <Image
            src="/image/4.avif"
            alt="Student"
            className="w-full h-full object-cover"
            style={{ objectPosition: "-450px", transform: "scaleX(-1)" }} // Mirrors the image and moves it
            width={800} // Add width and height for optimization
            height={600} // Add width and height for optimization
          />
        </div>

        {/* Right side - Form */}
        <div className="w-1/2 p-8">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Create an Account
            </h2>
            <p className="text-gray-500">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#D35B42]"
                placeholder="Enter your name"
                value={registerData.name}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#D35B42]"
                placeholder="Enter your email"
                value={registerData.email}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#D35B42]"
                placeholder="Enter your phone number"
                value={registerData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#D35B42]"
                placeholder="Enter password"
                value={registerData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-600">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#581845]"
                placeholder="Confirm password"
                value={registerData.confirmPassword}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#D35B42] text-white p-3 rounded-md hover:bg-[#441137] transition duration-200"
            >
              Register
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            <p className="text-gray-600">Already have an account?</p>
            <Link
              href="/user/auth/logIn"
              className="text-[#D35B42] hover:text-[#441137] font-medium"
            >
              Login here
            </Link>
          </div>

          {(error || success) && (
            <div className="mt-4 text-center">
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopUp;
