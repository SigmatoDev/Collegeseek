"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { api_url } from "@/utils/apiCall";
import { Loader } from "lucide-react";

const EditEnrollmentForm = () => {
  const router = useRouter();
  const { id: enrollmentId } = useParams();

  const [enrollmentData, setEnrollmentData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    message: "",
    createdAt: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const fetchEnrollmentData = async () => {
      if (!enrollmentId) return;

      try {
        const response = await axios.get(`${api_url}/enrollments/${enrollmentId}`);
        const data = response.data.enrollment;

        // Ensure date is properly formatted before setting in the state
        const formattedDate = data.createdAt
          ? new Date(data.createdAt).toISOString().split("T")[0]
          : "";

        setEnrollmentData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          course: data.course || "",
          message: data.message || "",
          createdAt: formattedDate,
        });
      } catch (err: any) {
        setError("Failed to fetch enrollment data. Please try again.");
      }
    };

    fetchEnrollmentData();
  }, [enrollmentId]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEnrollmentData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleCancel = () => {
    router.push("/admin/leads/enrolledStudents");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!enrollmentData.name || !enrollmentData.email || !enrollmentData.phone || !enrollmentData.course) {
      setError("Name, email, phone, and course are required.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Object.entries(enrollmentData).forEach(([key, value]) => {
      if (value) formData.append(key, value as string | Blob);
    });

    try {
      const url = enrollmentId ? `${api_url}enrollments/${enrollmentId}` : "";
      const response = await axios.put(url, formData, { headers: { "Content-Type": "multipart/form-data" } });
      if ([200, 201].includes(response.status)) {
        alert("Enrollment updated successfully!");
        router.push("/admin/leads/enrolledStudents");
      }
    } catch (err) {
      setError("Failed to save enrollment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated) {
    return <div>Loading...</div>; // Ensure hydration happens before the form is rendered
  }

  return (
    <div className="max-w-1xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">Edit Enrollment</h1>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={enrollmentData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={enrollmentData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={enrollmentData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700">Course</label>
            <input
              type="text"
              name="course"
              value={enrollmentData.course}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        {/* Message Input */}
        <div>
          <label className="block text-gray-700">Message</label>
          <textarea
            name="message"
            value={enrollmentData.message}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            rows={4}
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? <Loader className="animate-spin h-5 w-5" /> : "Update Enrollment"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white p-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEnrollmentForm;
