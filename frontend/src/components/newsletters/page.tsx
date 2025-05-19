"use client";

import { api_url } from "@/utils/apiCall";
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fix hydration issue by checking if mounted
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Prevents hydration mismatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch(`${api_url}/callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="flex flex-col items-center bg-orange-50 py-12 px-4 text-center">
<h2 className="text-xl sm:text-2xl font-semibold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
  Enhance Your College Experience
</h2>      <h3 className="text-3xl sm:text-4xl font-bold text-[#0a0536] mt-2">Expert Career & Academic Guidance</h3>
  
      <p className="text-gray-600 mt-3 mb-8 max-w-lg text-sm sm:text-base">
        Connect with our mentors to navigate your academic journey, internships, and career opportunities.
      </p>
  
      <form onSubmit={handleSubmit} className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 px-2">
        <div className="w-full">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#D25C41]"
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
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#D25C41]"
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
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-[#D25C41]"
            required
          />
        </div>
        <div className="w-full">
          <select
            name="stream"
            value={formData.stream}
            onChange={handleChange}
            className="p-3 border border-gray-00 rounded-lg w-full focus:ring-2 focus:ring-[#D25C41]"
            required
          >
            <option value="" disabled>Select Your Course</option>
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
  
      {message && <p className="text-sm text-gray-600 mt-4">{message}</p>}
  
      <p className="text-sm text-gray-500 mt-6 max-w-md px-2">
        By proceeding, you agree to our
        <span> </span>
        <a href="/terms&Conditions" className="text-blue-500 underline">Terms of Use</a>
        <span> and </span>
        <a href="/privacyPolicy" className="text-blue-500 underline">Privacy Policy</a>.
      </p>
    </div>
  );
  
}
