"use client";

import { api_url } from "@/utils/apiCall";
import { AcademicCapIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, PhoneIcon, UserIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function CallbackForm() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    stream: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "name") {
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    try {
      const response = await fetch(`${api_url}/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Callback request submitted successfully!");
        setFormData({ name: "", mobile: "", email: "", stream: "" });
      } else {
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage("Server error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-orange-50 py-8 px-4 sm:py-12">
      {/* ══════════════════════════════════════════
          MOBILE layout (hidden on sm+)
      ══════════════════════════════════════════ */}
      <div className="sm:hidden">
        {/* Modern glass card */}
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl border border-orange-100 mx-auto max-w-sm">
          {/* Decorative top gradient strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#D25C40] via-[#f97316] to-[#635dc1]" />

          <div className="px-5 pt-5 pb-6 space-y-5">
            {/* Header */}
            <div className="space-y-1 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#D25C40]">
                Free Counselling
              </p>
              <h2 className="text-lg font-bold text-gray-900 leading-snug">
                Expert Career & Academic Guidance
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                Connect with our mentors and navigate your journey.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name */}
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />{" "}
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-orange-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D25C40]/30 focus:border-[#D25C40] transition placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Mobile */}
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />{" "}
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  minLength={10}
                  onKeyDown={(e) => {
                    if (
                      !/[0-9]/.test(e.key) &&
                      ![
                        "Backspace",
                        "Tab",
                        "ArrowLeft",
                        "ArrowRight",
                        "Delete",
                      ].includes(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-orange-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D25C40]/30 focus:border-[#D25C40] transition placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Email */}
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />{" "}
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-orange-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D25C40]/30 focus:border-[#D25C40] transition placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Course select */}
              <div className="relative">
                <AcademicCapIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />{" "}
                <select
                  name="stream"
                  value={formData.stream}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-orange-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D25C40]/30 focus:border-[#D25C40] transition text-gray-600 appearance-none"
                  required
                >
                  <option value="" disabled>
                    Select Your Course
                  </option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Medical">Medical</option>
                  <option value="Arts">Arts & Humanities</option>
                  <option value="Science">Science</option>
                </select>
                {/* chevron */}
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />{" "}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#D25C40] to-[#f97316] shadow-lg shadow-orange-200 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Get Free Career Advice →"}
              </button>
            </form>

            {message && (
              <p
                className={`text-xs text-center font-medium rounded-xl px-3 py-2 ${
                  message.includes("success")
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : "bg-red-50 text-red-600 border border-red-100"
                }`}
              >
                {message}
              </p>
            )}

            {/* Footer */}
            <p className="text-[10px] text-gray-400 text-center leading-relaxed">
              By proceeding, you agree to our{" "}
              <a href="/terms&Conditions" className="text-[#D25C40] underline">
                Terms
              </a>
              {" & "}
              <a href="/privacyPolicy" className="text-[#D25C40] underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          DESKTOP layout — 100% original, unchanged
      ══════════════════════════════════════════ */}
      <div className="hidden sm:flex flex-col items-center text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
          Enhance Your College Experience
        </h2>
        <h3 className="text-3xl sm:text-4xl font-bold text-[#0a0536] mt-2">
          Expert Career & Academic Guidance
        </h3>
        <p className="text-gray-600 mt-3 mb-8 max-w-lg text-sm sm:text-base">
          Connect with our mentors to navigate your academic journey,
          internships, and career opportunities.
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 px-2"
        >
          <div className="w-full">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 border border-gray-300 bg-white rounded-lg w-full focus:ring-2 focus:ring-[#D25C41]"
              required
            />
          </div>
          <div className="w-full">
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              minLength={10}
              onKeyDown={(e) => {
                if (
                  !/[0-9]/.test(e.key) &&
                  ![
                    "Backspace",
                    "Tab",
                    "ArrowLeft",
                    "ArrowRight",
                    "Delete",
                  ].includes(e.key)
                ) {
                  e.preventDefault();
                }
              }}
              className="p-3 border border-gray-300 bg-white rounded-lg w-full focus:ring-2 focus:ring-[#D25C41]"
              required
            />
          </div>
          <div className="w-full">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              className="p-3 border border-gray-300 bg-white rounded-lg w-full focus:ring-2 focus:ring-[#D25C41]"
              required
            />
          </div>
          <div className="w-full">
            <select
              name="stream"
              value={formData.stream}
              onChange={handleChange}
              className="p-3 border border-gray-300 bg-white rounded-lg w-full focus:ring-2 focus:ring-[#D25C41]"
              required
            >
              <option value="" disabled>
                Select Your Course
              </option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
              <option value="Medical">Medical</option>
              <option value="Arts">Arts & Humanities</option>
              <option value="Science">Science</option>
            </select>
          </div>
          <div className="col-span-full flex justify-center mt-2">
            <button
              type="submit"
              className="bg-[#D25C41] text-white font-semibold py-3 px-8 rounded-lg hover:bg-orange-600 transition-all shadow-md w-full sm:w-auto max-w-xs sm:max-w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Get Career Advice"}
            </button>
          </div>
        </form>

        {message && <p className="text-lg text-green-700 mt-4">{message}</p>}

        <p className="text-sm text-gray-500 mt-6 max-w-md px-2">
          By proceeding, you agree to our{" "}
          <a href="/terms&Conditions" className="text-blue-500 underline">
            Terms of Use
          </a>{" "}
          and{" "}
          <a href="/privacyPolicy" className="text-blue-500 underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
