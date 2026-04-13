"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { api_url } from "@/utils/apiCall";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setToast({ type: "error", msg: "Please enter your email address." });
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setToast({ type: "error", msg: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${api_url}forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setSent(true);
        setToast({ type: "success", msg: data.message || "Password reset link sent to your email." });
      } else {
        setToast({ type: "error", msg: data.message || "Failed to send reset link." });
      }
    } catch {
      setToast({ type: "error", msg: "Server error. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/logo/logo.jpg" alt="Logo" width={110} height={44} className="object-contain" />
        </div>

        {!sent ? (
          <>
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-full bg-[#0a0536] flex items-center justify-center">
                <svg className="w-7 h-7 text-[#fcf0e8]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Forgot your password?</h2>
              <p className="text-sm text-gray-500 mt-1">No worries — we'll send a reset link to your email</p>
            </div>

            {/* Toast */}
            {toast && (
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm mb-5 border ${
                toast.type === "success"
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}>
                {toast.type === "success" ? (
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                )}
                <span>{toast.msg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1.5">Email address</label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: "#0a0536" }}
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>

            <div className="mt-5 text-center">
              <Link
                href="/user/auth/logIn"
                className="text-sm text-gray-400 hover:text-purple-600 transition inline-flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
                Back to sign in
              </Link>
            </div>
          </>
        ) : (
          /* Success state */
          <div className="text-center py-4">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Check your inbox</h2>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              We sent a reset link to<br />
              <span className="font-medium text-gray-700">{email}</span>
            </p>
            <p className="text-xs text-gray-400 mt-4">Didn't receive it? Check your spam folder or</p>
            <button
              onClick={() => { setSent(false); setToast(null); }}
              className="text-xs text-purple-600 hover:text-purple-800 font-medium mt-1 transition"
            >
              try a different email
            </button>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <Link
                href="/user/auth/logIn"
                className="text-sm text-gray-400 hover:text-purple-600 transition inline-flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
                Back to sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;