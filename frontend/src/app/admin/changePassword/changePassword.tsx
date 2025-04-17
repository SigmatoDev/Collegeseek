"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { api_url } from "@/utils/apiCall";

type PasswordField = "old" | "new" | "confirm";

export default function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  // ✅ Fix: Ensure localStorage is only accessed on the client
  useEffect(() => {
    const storedAdminId = localStorage.getItem("adminId");
    if (storedAdminId) setAdminId(storedAdminId);
  }, []);

  const togglePasswordVisibility = (field: PasswordField) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      setErrors("New password and Confirm password do not match!");
      return;
    }

    if (!adminId) {
      setErrors("Admin ID missing. Please log in again.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${api_url}change-password`, {
        adminId,
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      setSuccess(response.data.message || "Password changed successfully!");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrors(error.response?.data?.message || "Failed to change password");
      } else {
        setErrors("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Change Password</h2>

        {errors && <p className="mt-2 text-center text-red-600 text-sm font-medium">{errors}</p>}
        {success && <p className="mt-2 text-center text-green-600 text-sm font-medium">{success}</p>}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {(["old", "new", "confirm"] as PasswordField[]).map((field) => (
            <PasswordInput
              key={field}
              label={
                field === "old" ? "Old Password" : field === "new" ? "New Password" : "Confirm Password"
              }
              name={field === "old" ? "oldPassword" : field === "new" ? "newPassword" : "confirmPassword"}
              value={form[field === "old" ? "oldPassword" : field === "new" ? "newPassword" : "confirmPassword"]}
              onChange={handleChange}
              showPassword={showPassword[field]}
              togglePassword={() => togglePasswordVisibility(field)}
            />
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 font-semibold text-white rounded-lg shadow-md transition-all ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            } focus:ring focus:ring-indigo-400 focus:outline-none`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  showPassword,
  togglePassword,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  togglePassword: () => void;
}) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        placeholder={`Enter ${label.toLowerCase()}`}
        required
      />
      <button
        type="button"
        className="absolute inset-y-0 right-3 top-7 text-gray-500 hover:text-gray-700"
        onClick={togglePassword}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};
