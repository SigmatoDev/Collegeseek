"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { api_url } from "@/utils/apiCall";
import { useUserStore } from "@/Store/userStore";
import Footer from "@/components/footer/page";
import Header from "@/components/header/page";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [mounted, setMounted] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const router = useRouter();

  // ✅ DO NOT redirect immediately — only allow component to render
useEffect(() => {
  setMounted(true);

  const saved = sessionStorage.getItem("redirectAfterLogin");
  const current = window.location.href;

  if (!saved) {
    console.log("📌 No redirect stored yet. Setting current page as fallback:", current);
    sessionStorage.setItem("redirectAfterLogin", current);
  }
}, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    const isEmailEmpty = !trimmedEmail;
    const isPasswordEmpty = !trimmedPassword;

    setEmailError(isEmailEmpty);
    setPasswordError(isPasswordEmpty);

    if (isEmailEmpty || isPasswordEmpty) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await fetch(`${api_url}user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        setError("Invalid response from server.");
        return;
      }

      if (res.ok && data.token && data.user) {
        // console.log("🔍 LOGIN DEBUG → Login success:", data);

        sessionStorage.setItem("authToken", data.token);

        useUserStore.getState().setUser({
          ...data.user,
          token: data.token,
        });

        setSuccess("Login successful!");

        // 📦 CHECK PENDING SHORTLIST
        const pendingCollege = sessionStorage.getItem("pendingShortlistCollege");
        // console.log("🔍 LOGIN DEBUG → Pending shortlist check:", pendingCollege);

        if (pendingCollege) {
          const college = JSON.parse(pendingCollege);

          try {
            // console.log("🔍 LOGIN DEBUG → Auto-shortlisting:", college);

            const shortlistRes = await fetch(`${api_url}shortlist`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${data.token}`,
              },
              body: JSON.stringify({
                collegeId: college.id,
                name: data.user.name || "",
                email: data.user.email || "",
                phone: data.user.phone || "",
              }),
            });

            if (shortlistRes.ok) {
              // console.log("🔍 LOGIN DEBUG → Auto-shortlist SUCCESS");
              sessionStorage.removeItem("pendingShortlistCollege");
            } else {
              // console.warn("🔍 LOGIN DEBUG → Auto-shortlist FAILED");
            }
          } catch (err) {
            // console.error("🔍 LOGIN DEBUG → Auto-shortlist error:", err);
          }
        }

        // 🎯 DECIDE WHERE TO REDIRECT
        const redirectTo = sessionStorage.getItem("redirectAfterLogin");
        // console.log("🔍 LOGIN DEBUG → redirectAfterLogin:", redirectTo);

        setTimeout(() => {
          if (
            redirectTo &&
            redirectTo !== "null" &&
            redirectTo !== "" &&
            !redirectTo.includes("/user/auth/logIn")
          ) {
            // console.log("🔍 LOGIN DEBUG → Redirecting user to:", redirectTo);
            sessionStorage.removeItem("redirectAfterLogin");
            router.push(redirectTo);
          } else {
            // console.log("🔍 LOGIN DEBUG → No valid redirect found. Going home.");
            router.push("/");
          }
        }, 1200);

      } else if (data.message?.toLowerCase().includes("user not found")) {
        setError("No account found with this email. Redirecting to sign-up...");
        setTimeout(() => router.push("/user/auth/signUp"), 2500);
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  if (!mounted) return null;

  return (
    <>
      <Header />
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
        <div className="w-full max-w-md bg-[#F3F4F6] p-8 rounded-lg shadow-lg">

          <div className="flex justify-center">
            <Image
              src="/logo/cs-logo_a.webp"
              alt="Logo"
              width={120}
              height={50}
            />
          </div>

          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500">Login to your account</p>
          </div>

          {(error || success) && (
            <div
              className={`mt-4 text-center text-sm font-medium ${
                error ? "text-red-600" : "text-green-600"
              }`}
            >
              {error || success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                className={`w-full p-3 border rounded-md ${
                  emailError ? "border-red-500" : "focus:border-[#581845]"
                }`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">Email is required.</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full p-3 border rounded-md ${
                  passwordError ? "border-red-500" : "focus:border-[#581845]"
                }`}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">
                  Password is required.
                </p>
              )}
            </div>

            <div className="text-right text-sm">
              <Link
                href="/user/auth/forgotPassword"
                className="text-[#581845] hover:text-[#441137] font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#581845] text-white p-3 rounded-md hover:bg-[#441137] transition"
            >
              Log In
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            <p className="text-gray-600">Don't have an account?</p>
            <Link
              href="/user/auth/signUp"
              className="text-[#581845] hover:text-[#441137] font-medium"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LogIn;
