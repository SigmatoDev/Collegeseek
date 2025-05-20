import { api_url } from "@/utils/apiCall";
import React, { useState, useEffect } from "react";

interface EnrollmentFormProps {
  courseId: string;
}

interface FormDataType {
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string;
}

interface Course {
  id: string;
  specialization: string; // specialization is string ID here
}

const EnrollmentForm = ({ courseId }: EnrollmentFormProps) => {
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    phone: "",
    course: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    [key in keyof FormDataType]?: string;
  }>({});
  const [course, setCourse] = useState<Course | null>(null);
  const [specializationName, setSpecializationName] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`${api_url}/courses/${courseId}`);
        const data = await response.json();
        console.log("Fetched course data:", data);
        // Adjust if your API response is wrapped inside 'data'
        setCourse(data.data ?? data);
      } catch (error) {
        console.error("Failed to fetch course data", error);
      }
    };
    fetchCourse();
  }, [courseId]);

  // Fetch specialization name separately by specialization ID
  useEffect(() => {
    if (course?.specialization) {
      const fetchSpecialization = async () => {
        try {
          const response = await fetch(
            `${api_url}/Specialization/${course.specialization}`
          );
          const data = await response.json();
          console.log("Fetched specialization:", data);
          setSpecializationName(data.name ?? "");
          setFormData((prev) => ({ ...prev, course: data.name ?? "" }));
        } catch (error) {
          console.error("Failed to fetch specialization data", error);
        }
      };
      fetchSpecialization();
    }
  }, [course]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key in keyof FormDataType]?: string } = {};
    Object.keys(formData).forEach((field) => {
      const value = formData[field as keyof FormDataType];
      if (!value && field !== "message") {
        newErrors[field as keyof FormDataType] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`;
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
      const response = await fetch(`${api_url}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Enrollment successful:", data);
        setFormData({
          name: "",
          email: "",
          phone: "",
          course: specializationName, // keep course filled with specialization name
          message: "",
        });
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="text-center text-xl text-gray-700">
        Loading course details...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-xl border border-gray-200">
      <h3 className="text-1xl font-semibold text-center mb-2 text-gray-800 text-[28px]">
        Enroll in Course <br />
        <span className="text-2xl font-medium text-blue-600">
          {specializationName || "Loading specialization..."}
        </span>
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(["name", "email"] as Array<keyof FormDataType>).map((field) => (
            <div key={field} className="mb-4">
              <label
                htmlFor={field}
                className="block text-lg font-medium text-gray-700 mb-2 capitalize"
              >
                {field}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                className={`w-full p-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 ${
                  errors[field] ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={`Enter your ${field}`}
                required
              />
              {errors[field] && (
                <p className="text-xs text-red-500 mt-1">{errors[field]}</p>
              )}
            </div>
          ))}

          {(["phone", "course"] as Array<keyof FormDataType>).map((field) => (
            <div key={field} className="mb-4">
              <label
                htmlFor={field}
                className="block text-lg font-medium text-gray-700 mb-2 capitalize"
              >
                {field}
              </label>
              <input
                type={field === "phone" ? "tel" : "text"}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (
                    field === "phone" &&
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Delete" &&
                    e.key !== "ArrowLeft" &&
                    e.key !== "ArrowRight" &&
                    e.key !== "Tab"
                  ) {
                    e.preventDefault();
                  }
                }}
                inputMode={field === "phone" ? "numeric" : undefined}
                pattern={field === "phone" ? "[0-9]*" : undefined}
                className={`w-full p-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 ${
                  errors[field] ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={`Enter your ${field}`}
                required={field !== "course"}
                readOnly={field === "course"} // Make course read-only
              />
              {errors[field] && (
                <p className="text-xs text-red-500 mt-1">{errors[field]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="w-full p-3 text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 border-gray-300"
            rows={4}
            placeholder="Leave a message (optional)"
          />
        </div>

        <button
          type="submit"
          className={`w-full py-3 text-white rounded-lg text-xl font-semibold transition-all duration-300 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#581845] hover:bg-[#4a1538]"
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default EnrollmentForm;
