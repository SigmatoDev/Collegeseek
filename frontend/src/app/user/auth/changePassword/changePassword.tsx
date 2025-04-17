// src/app/user/auth/changePassword/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api_url } from "@/utils/apiCall";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    console.log("📤 Sending:", {
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      setShowModal(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setShowModal(true);
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("Unauthorized. Please log in again.");
      setShowModal(true);
      return;
    }

    try {
      const res = await fetch(`${api_url}change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();
      console.log("📨 Server response:", data);

      if (res.ok) {
        setMessage(data.message || "Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "Failed to change password.");
      }

      setShowModal(true);
    } catch (err) {
      console.error("❌ Error from server:", err);
      setError("Server error. Try again later.");
      setShowModal(true);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-md bg-[#F3F4F6] p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Current Password
            </label>
            <input
              type="password"
              className="w-full p-3 border rounded-md"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              New Password
            </label>
            <input
              type="password"
              className="w-full p-3 border rounded-md"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Confirm New Password
            </label>
            <input
              type="password"
              className="w-full p-3 border rounded-md"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#581845] text-white p-3 rounded-md"
          >
            Change Password
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

export default ChangePassword;
