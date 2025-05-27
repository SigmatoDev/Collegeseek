import { api_url } from "@/utils/apiCall";
import React, { useState, useEffect } from "react";

interface CounsellingFormProps {
  collegeId: string;
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

const CounsellingForm = ({ collegeId }: CounsellingFormProps) => {
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

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const response = await fetch(`${api_url}/colleges/${collegeId}`);
        const data = await response.json();
        if (data) {
          setCollege(data.data);
        } else {
          setFetchError("No data found for this college.");
        }
      } catch (error) {
        setFetchError("Failed to fetch college data.");
        console.error("Failed to fetch college data:", error);
      }
    };

    fetchCollege();
  }, [collegeId]);

  useEffect(() => {
    if (college) {
      setFormData((prevData) => ({
        ...prevData,
        college: college.name,
      }));
    }
  }, [college]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "name" && /\d/.test(value)) {
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key in keyof FormDataType]?: string } = {};

    // Only validate required fields — message is optional
    (["name", "email", "phone", "college"] as Array<keyof FormDataType>).forEach((field) => {
      const value = formData[field];
      if (!value) {
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          college: college?.name || "",
          message: "",
        });
        setSuccessMessage("Thanks! We’ll connect with you shortly.");
        setTimeout(() => setSuccessMessage(""), 5000); // Optional: clear after 5 sec
      } else {
        console.error("Error:", data.message);
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
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-xl border border-gray-200">
      <h3 className="text-1xl font-semibold text-center mb-2 text-gray-800 text-[28px]">
        Get Free Counselling for College
      </h3>
      <h3 className="text-[16px] pt-2 pb-5 font-medium text-center text-blue-600">
        {college.name}
      </h3>

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
          className={`w-full py-3 text-white rounded-lg text-xl font-semibold transition-all duration-300 ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-[#581845] hover:bg-[#4a1538]"
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {successMessage && (
        <div className="mt-4 text-green-600 text-center text-lg font-medium">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default CounsellingForm;
