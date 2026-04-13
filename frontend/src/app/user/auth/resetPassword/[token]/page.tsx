"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { api_url } from "@/utils/apiCall";

const getStrength = (pw: string): number => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

const strengthColors = ["#E24B4A", "#EF9F27", "#1D9E75", "#0F6E56"];
const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { token } = useParams();

  useEffect(() => { setMounted(true); }, []);

  const strength = newPassword.length ? getStrength(newPassword) : 0;
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const isValid = newPassword.length >= 8 && passwordsMatch;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setToast(null);

    if (!newPassword || !confirmPassword) {
      setToast({ type: "error", msg: "Please fill out both fields." });
      return;
    }
    if (newPassword.length < 8) {
      setToast({ type: "error", msg: "Password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast({ type: "error", msg: "Passwords do not match." });
      return;
    }
    if (!token) {
      setToast({ type: "error", msg: "Reset token is missing or invalid." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${api_url}reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setToast({ type: "success", msg: data.message || "Password reset successfully! Redirecting…" });
        setTimeout(() => router.push("/user/auth/logIn"), 2000);
      } else {
        setToast({ type: "error", msg: data.message || "Failed to reset password." });
      }
    } catch {
      setToast({ type: "error", msg: "Server error. Please try again later." });
    } finally {
      setLoading(false);
    }
  }, [newPassword, confirmPassword, token, router]);

  if (!mounted) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-full bg-[#0a0536] flex items-center justify-center">
            <svg className="w-7 h-7 text-[#fdf1ea]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Set new password</h2>
          <p className="text-sm text-gray-500 mt-1">Must be at least 8 characters long</p>
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">New password</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                className="w-full pr-10 pl-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showNew ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* Strength Bar */}
            {newPassword.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all duration-200"
                      style={{ background: i <= strength ? strengthColors[strength - 1] : "#E5E7EB" }}
                    />
                  ))}
                </div>
                <p className="text-xs mt-1" style={{ color: strengthColors[strength - 1] }}>
                  {strengthLabels[strength - 1]}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">Confirm password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                className={`w-full pr-10 pl-3 py-2.5 border rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 transition ${
                  passwordsMismatch
                    ? "border-red-300 focus:ring-red-100 focus:border-red-400"
                    : passwordsMatch
                    ? "border-green-300 focus:ring-green-100 focus:border-green-400"
                    : "border-gray-200 focus:ring-purple-200 focus:border-purple-400"
                }`}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showConfirm ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* Match hint */}
            {confirmPassword.length > 0 && (
              <p className={`text-xs mt-1.5 flex items-center gap-1 ${passwordsMatch ? "text-green-700" : "text-red-600"}`}>
                {passwordsMatch ? (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                    Passwords match
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    Passwords do not match
                  </>
                )}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium text-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: isValid && !loading ? "#534AB7" : "#0a0536" }}
          >
            {loading ? "Resetting…" : "Reset password"}
          </button>
        </form>

        {/* Back link */}
        <button
          onClick={() => router.push("/user/auth/logIn")}
          className="w-full text-center mt-4 text-sm text-gray-400 hover:text-purple-600 transition"
        >
          ← Back to sign in
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;