"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { api_url } from "@/utils/apiCall";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { token } = useParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill out both fields.");
      setShowModal(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setShowModal(true);
      return;
    }

    if (!token) {
      setError("Reset token is missing or invalid.");
      setShowModal(true);
      return;
    }

    try {
      const res = await fetch(`${api_url}reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Password reset successfully.");
        setTimeout(() => {
          router.push("/user/auth/logIn");
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password.");
      }

      setShowModal(true);
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
          <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-500">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">New Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#581845]"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:border-[#581845]"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#581845] text-white p-3 rounded-md hover:bg-[#441137] transition duration-200"
          >
            Reset Password
          </button>
        </form>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-80 text-center shadow-xl">
              {error ? (
                <>
                  <h3 className="text-xl font-semibold text-red-500">Error</h3>
                  <p className="text-gray-600 mt-2">{error}</p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-green-500">Success!</h3>
                  <p className="text-gray-600 mt-2">{message}</p>
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
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
