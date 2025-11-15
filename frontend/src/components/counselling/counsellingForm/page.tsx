import { api_url } from "@/utils/apiCall";
import React, { useState, useEffect } from "react";

interface CounsellingFormProps {
  collegeId?: string;
  onClose?: () => void;
}

interface FormDataType {
  name: string;
  email: string;
  phone: string;
  college: string;
  message: string;
}

interface College {
  id: string;
  name: string;
}

const CounsellingForm = ({ collegeId, onClose }: CounsellingFormProps) => {
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    phone: "",
    college: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key in keyof FormDataType]?: string }>({});
  const [college, setCollege] = useState<College | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Fetch college details
  useEffect(() => {
    if (!collegeId || collegeId === "global") {
      setCollege({ id: "global", name: "General Counselling" });
      setFetchError(null);
      return;
    }

    const fetchCollege = async () => {
      try {
        const response = await fetch(`${api_url}/colleges/${collegeId}`);
        const data = await response.json();
        if (data?.data) {
          setCollege(data.data);
          setFetchError(null);
        } else {
          setFetchError("No data found for this college.");
        }
      } catch (error) {
        console.error("Failed to fetch college data:", error);
        setFetchError("Failed to fetch college data.");
      }
    };

    fetchCollege();
  }, [collegeId]);

  // Pre-fill college name
  useEffect(() => {
    if (college) {
      setFormData((prev) => ({ ...prev, college: college.name }));
    }
  }, [college]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "name" && /\d/.test(value)) return; // block digits in name

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: { [key in keyof FormDataType]?: string } = {};
    (["name", "email", "phone", "college"] as Array<keyof FormDataType>).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);

  try {
    const response = await fetch(`${api_url}/counselling`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccessMessage("Thanks! We’ll connect with you shortly.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        college: college?.name || "",
        message: "",
      });
    } else {
      console.error("Error submitting form:", data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setLoading(false);
  }
};



  if (fetchError) {
    return <div className="text-center text-xl text-red-500">{fetchError}</div>;
  }

  if (!college) {
    return <div className="text-center text-xl text-gray-700">Loading college details...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-5 sm:p-6 bg-white rounded-2xl border border-gray-100">
      <h3 className="text-2xl font-semibold text-center text-gray-900">
        Get Free Counselling
      </h3>
      <p className="text-sm text-center text-gray-500 mb-5">
        {college.name}
      </p>

      {successMessage ? (
        <div className="rounded-xl bg-[#f6f4fb] p-6 text-center text-sm text-[#4c8c5a] space-y-4">
          <p>{successMessage}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full bg-[#d95540] px-4 py-2 text-white text-sm font-semibold shadow hover:bg-[#c44936] transition"
            >
              Close
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(["name", "email"] as Array<keyof FormDataType>).map((field) => (
              <div key={field} className="mb-4">
                <label htmlFor={field} className="block text-lg font-medium text-gray-700 mb-2 capitalize">
                  {field}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  id={field}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleInputChange}
                  className={`w-full p-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 ${
                    errors[field] ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={`Enter your ${field}`}
                  required
                />
                {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
              </div>
            ))}

            {(["phone", "college"] as Array<keyof FormDataType>).map((field) => (
              <div key={field} className="mb-4">
                <label htmlFor={field} className="block text-lg font-medium text-gray-700 mb-2 capitalize">
                  {field}
                </label>
                <input
                  type={field === "phone" ? "tel" : "text"}
                  id={field}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleInputChange}
                  readOnly={field === "college"}
                  pattern={field === "phone" ? "[0-9]*" : undefined}
                  inputMode={field === "phone" ? "numeric" : undefined}
                  onKeyDown={(e) => {
                    if (
                      field === "phone" &&
                      !/[0-9]/.test(e.key) &&
                      e.key !== "Backspace" &&
                      e.key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  className={`w-full p-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 ${
                    errors[field] ? "border-red-500" : "border-gray-300"
                  } ${field === "college" ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  placeholder={`Enter your ${field}`}
                  required
                />
                {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label htmlFor="message" className="block text-lg font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message || ""}
              onChange={handleInputChange}
              className="w-full p-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 border-gray-300"
              rows={4}
              placeholder="Leave a message (optional)"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-base font-semibold transition-all duration-300 ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-[#ff8f66] to-[#d95540] text-white hover:from-[#f77d52] hover:to-[#cf4b38]"
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CounsellingForm;
