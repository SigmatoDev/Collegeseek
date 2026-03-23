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
    let count = 0;
    const interval = setInterval(() => {
      if (!isLoggedIn && count < 3) {
        setShowPopup(true);
        count++;
      } else if (count >= 3) {
        clearInterval(interval);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setRegisterData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") }));
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleClose = () => setShowPopup(false);

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
        setTimeout(() => { setShowPopup(false); router.push("/user/auth/logIn"); }, 2000);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  if (!mounted || !showPopup) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

      {/* ══════════════════════════════════════════
          MOBILE modal — bottom sheet style (hidden on md+)
      ══════════════════════════════════════════ */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto">

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-gray-200" />
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#D35B42] transition"
        >
          <XCircleIcon className="w-6 h-6" />
        </button>

        <div className="px-5 pt-2 pb-8 space-y-5">
          {/* Header */}
          <div className="space-y-0.5">
            <div className="h-1 w-10 rounded-full bg-gradient-to-r from-[#D35B42] to-[#f97316] mb-3" />
            <h2 className="text-xl font-bold text-gray-900">Create an Account</h2>
            <p className="text-sm text-gray-400">Sign up to get started</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={registerData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D35B42]/30 focus:border-[#D35B42] transition placeholder:text-gray-300"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={registerData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D35B42]/30 focus:border-[#D35B42] transition placeholder:text-gray-300"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</label>
              <input
                type="tel"
                name="phone"
                inputMode="numeric"
                placeholder="Enter your phone number"
                value={registerData.phone}
                onChange={handleInputChange}
                pattern="[0-9]*"
                className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D35B42]/30 focus:border-[#D35B42] transition placeholder:text-gray-300"
              />
            </div>

            {/* Password row — side by side on mobile */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={registerData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 pr-8 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D35B42]/30 focus:border-[#D35B42] transition placeholder:text-gray-300"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Confirm</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm"
                    value={registerData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 pr-8 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D35B42]/30 focus:border-[#D35B42] transition placeholder:text-gray-300"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {showConfirmPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#D35B42] to-[#f97316] shadow-lg shadow-orange-100 active:scale-[0.98] transition-all mt-1"
            >
              Create Account →
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-xs text-gray-400">
            Already have an account?{" "}
            <Link href="/user/auth/logIn" className="text-[#D35B42] font-semibold">
              Login here
            </Link>
          </p>

          {/* Messages */}
          {error && (
            <p className="text-xs text-center text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}</p>
          )}
          {success && (
            <p className="text-xs text-center text-green-600 bg-green-50 border border-green-100 rounded-xl px-3 py-2">{success}</p>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP modal — original, completely unchanged
      ══════════════════════════════════════════ */}
      <div className="hidden md:flex w-full max-w-4xl bg-white p-0 rounded-lg shadow-lg relative overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl font-bold z-10"
        >
          <XCircleIcon className="w-6 h-6 text-[#D35B42]" />
        </button>

        {/* Left side - Image */}
        <div className="w-1/2">
          <Image
            src="/image/005 (1).png"
            alt="Student"
            className="w-full h-full object-cover"
            style={{ objectPosition: "-450px", transform: "scaleX(-1)" }}
            width={800}
            height={600}
          />
        </div>

        {/* Right side - Form */}
        <div className="w-1/2 p-8">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Create an Account</h2>
            <p className="text-gray-500">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Name</label>
              <input type="text" name="name"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#D35B42]"
                placeholder="Enter your name" value={registerData.name} onChange={handleInputChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input type="email" name="email"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#D35B42]"
                placeholder="Enter your email" value={registerData.email} onChange={handleInputChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Phone Number</label>
              <input type="tel" name="phone" inputMode="numeric"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#D35B42]"
                placeholder="Enter your phone number" value={registerData.phone}
                onChange={handleInputChange} pattern="[0-9]*" />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <input type={showPassword ? "text" : "password"} name="password"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#D35B42]"
                placeholder="Enter password" value={registerData.password} onChange={handleInputChange} />
              <button type="button" className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#581845]"
                placeholder="Confirm password" value={registerData.confirmPassword} onChange={handleInputChange} />
              <button type="button" className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            <button type="submit"
              className="w-full bg-[#D35B42] text-white p-3 rounded-md hover:bg-[#441137] transition duration-200">
              Register
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            <p className="text-gray-600">Already have an account?</p>
            <Link href="/user/auth/logIn" className="text-[#D35B42] hover:text-[#441137] font-medium">
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