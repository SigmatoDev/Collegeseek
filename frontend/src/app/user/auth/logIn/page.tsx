"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { api_url } from "@/utils/apiCall";
import { useUserStore } from "@/Store/userStore";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Please enter both email and password.");
      setShowModal(true);
      return;
    }

    try {
      const res = await fetch(`${api_url}user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        setError("Invalid response from server.");
        setShowModal(true);
        return;
      }

      if (res.ok && data.token && data.user) {
        // Storing the token in sessionStorage
        sessionStorage.setItem("authToken", data.token);
        
        // Set user state with token in useUserStore
        useUserStore.getState().setUser({
          ...data.user,
          token: data.token,
        });

        setSuccess("Login successful!");
        setShowModal(true);
        setTimeout(() => router.push("/user/profile"), 2000);
      } else {
        setError(data.message || "Invalid credentials.");
        setShowModal(true);
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
      setShowModal(true);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-md bg-[#F3F4F6] p-8 rounded-lg shadow-lg">
        <div className="flex justify-center">
          <Image src="/logo/logo.jpg" alt="Logo" width={120} height={50} />
        </div>

        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500">Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#581845]"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#581845]"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>

          <div className="text-right text-sm">
            <Link href="/user/auth/forgotPassword" className="text-[#581845] hover:text-[#441137] font-medium">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#581845] text-white p-3 rounded-md hover:bg-[#441137] transition duration-200"
          >
            Log In
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">Don't have an account?</p>
          <Link href="/user/auth/signUp" className="text-[#581845] hover:text-[#441137] font-medium">
            Register here
          </Link>
        </div>

        {/* {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-80 text-center shadow-xl">
              {error ? (
                <>
                  <h3 className="text-xl font-semibold text-red-500">Login Failed</h3>
                  <p className="text-gray-600 mt-2">{error}</p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-green-500">Success!</h3>
                  <p className="text-gray-600 mt-2">{success}</p>
                </>
              )}
              <button
                className="mt-4 bg-[#581845] text-white p-2 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default LogIn;
