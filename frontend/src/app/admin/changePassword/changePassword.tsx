"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, ShieldCheck } from "lucide-react";
import axios from "axios";
import { api_url } from "@/utils/apiCall";
import { useAdminStore } from "@/Store/adminStore";

type PasswordField = "old" | "new" | "confirm";

function getStrength(val: string): { score: number; label: string; color: string } {
  if (!val) return { score: 0, label: "", color: "" };
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score, label: "Fair", color: "bg-amber-400" };
  return { score, label: "Strong", color: "bg-emerald-500" };
}

export default function ChangePassword() {
  const admin = useAdminStore((state) => state.admin);
  const adminId = admin?.id;

  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ old: false, new: false, confirm: false });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getStrength(form.newPassword);

  const toggle = (field: PasswordField) =>
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setError("All fields are required."); return;
    }
    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters."); return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match."); return;
    }
    if (!adminId) {
      setError("Session expired. Please log in again."); return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${api_url}change-password`, {
        adminId,
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });
      setSuccess(res.data.message || "Password changed successfully!");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to change password.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fields: { key: PasswordField; label: string; name: string; placeholder: string }[] = [
    { key: "old", label: "Current password", name: "oldPassword", placeholder: "Enter current password" },
    { key: "new", label: "New password", name: "newPassword", placeholder: "Min. 8 characters" },
    { key: "confirm", label: "Confirm new password", name: "confirmPassword", placeholder: "Repeat new password" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-[460px] rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">

        {/* Header */}
        <div className="bg-[#25175e] px-8 pt-8 pb-6 relative">
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-400 to-emerald-400" />
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <h2 className="text-lg font-medium text-white">Change password</h2>
          <p className="text-sm text-white/50 mt-0.5">
            {admin?.email ?? "Admin account"}
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-7">

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-5">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 mb-5">
              <CheckCircle size={15} className="flex-shrink-0" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map(({ key, label, name, placeholder }) => (
              <div key={key}>
                <label className="block text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-1.5">
                  {label}
                </label>
                <div className="relative">
                  <input
                    type={show[key] ? "text" : "password"}
                    name={name}
                    value={form[name as keyof typeof form]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full h-11 pl-3 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-sm font-mono text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => toggle(key)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
                  >
                    {show[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Strength bar for new password */}
                {key === "new" && form.newPassword && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength.score ? strength.color : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-[11px] mt-1 ${
                      strength.score <= 1 ? "text-red-500" :
                      strength.score <= 2 ? "text-amber-500" : "text-emerald-600"
                    }`}>
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>
            ))}

            <div className="border-t border-gray-100 pt-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p className="text-xs text-gray-400">Session active · changes apply immediately</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#25175e] hover:bg-[#1a0f4f] disabled:bg-gray-300 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    Update password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}