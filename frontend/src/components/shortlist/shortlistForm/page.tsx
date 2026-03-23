"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/Store/userStore";
import { api_url } from "@/utils/apiCall";

interface College {
  id?: string;
  _id?: string;
  name: string;
  location: string;
}

interface ShortlistFormProps {
  college: College;
  onSuccess?: () => void; // ✅ added callback prop
}

const ShortlistForm: React.FC<ShortlistFormProps> = ({ college, onSuccess }) => {
  const { user, token } = useUserStore(); // ✅ FIXED
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const collegeId = college?.id || college?._id;
  const userId = user?._id;

  useEffect(() => {
    if (!user || !collegeId || !userId) {
      router.push("/user/auth/logIn");
    }
  }, [user, college, collegeId, userId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${api_url}shortlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ FIXED
        },
        body: JSON.stringify({
          ...formData,
          userId,
          collegeId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("College successfully shortlisted!");
        setFormData((prev) => ({ ...prev, message: "", phone: "" }));

        // ✅ trigger parent callback
        if (onSuccess) onSuccess();
      } else {
        setError(data.message || "Failed to submit shortlist.");
      }
    } catch (err) {
      console.error("Fetch error during shortlist submission:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md max-w-full sm:max-w-md md:max-w-lg mx-auto w-full">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
        Shortlist This College
      </h2>

      {success && (
        <p className="text-green-600 mb-4 bg-green-100 p-3 rounded-md border border-green-500 transition-all">
          {success}
        </p>
      )}
      {error && (
        <p className="text-red-600 mb-4 bg-red-100 p-3 rounded-md border border-red-500 transition-all">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name, Email, Phone, Message inputs (unchanged) */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-gray-600 text-sm sm:text-base">Your Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-gray-600 text-sm sm:text-base">Your Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="phone" className="text-gray-600 text-sm sm:text-base">Your Phone Number</label>
          <input
            type="text"
            name="phone"
            id="phone"
            placeholder="Your Phone Number"
            value={formData.phone}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, "");
              setFormData((prev) => ({ ...prev, phone: numericValue }));
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            required
            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="message" className="text-gray-600 text-sm sm:text-base">Why are you interested in this college?</label>
          <textarea
            name="message"
            id="message"
            placeholder="Your message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm sm:text-base"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 sm:p-4 text-white rounded-lg transition duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#581845] hover:bg-[#441137] focus:outline-none focus:ring-4 focus:ring-[#581845] focus:ring-opacity-50"
          }`}
        >
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="w-5 h-5 border-4 border-white border-t-transparent border-solid rounded-full animate-spin"></div>
            </div>
          ) : (
            "Shortlist"
          )}
        </button>
      </form>
    </div>
  );
};

export default ShortlistForm;
