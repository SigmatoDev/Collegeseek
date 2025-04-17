"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { api_url } from "@/utils/apiCall";

const CourseForm = () => {
  const router = useRouter();
  const { id: courseId } = useParams(); // Dynamically fetching the courseId from the URL

  const [courseData, setCourseData] = useState({
    name: "",
    code: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId || courseId === "new") return;
      try {
        console.log(`📡 Fetching course data for courseId: ${courseId}`);
        const response = await axios.get(`${api_url}course-list/${courseId}`);
        const data = response.data.data;
        setCourseData({
          name: data.name || "",
          code: data.code || "",
        });
      } catch (err) {
        setError("Failed to fetch course data. Please try again.");
      }
    };
    fetchCourseData();
  }, [courseId]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCourseData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleCancel = () => {
    router.push("/admin/courseList");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    if (!courseData.name || !courseData.code) {
      setError("Course name and code are required.");
      setLoading(false);
      return;
    }
  
    try {
      const url = courseId && courseId !== "new" ? `${api_url}course-list/${courseId}` : `${api_url}course-list`;
      const method = courseId && courseId !== "new" ? axios.put : axios.post;
  
      const response = await method(url, courseData);  // Send courseData as JSON
  
      if ([200, 201].includes(response.status)) {
        alert("Course saved successfully!");
        router.push("/admin/courseList");
      } else {
        setError("Failed to save course. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-1xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">
        {courseId && courseId !== "new" ? "Edit Course" : "Create New Course"}
      </h1>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            placeholder="Course Name"
            value={courseData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="code"
            placeholder="Course Code"
            value={courseData.code}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? <Loader className="animate-spin h-5 w-5" /> : courseId && courseId !== "new" ? "Update Course" : "Publish Course"}
          </button>
          {courseId && courseId !== "new" && (
            <button type="button" onClick={handleCancel} className="bg-gray-500 text-white p-3 rounded-lg">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
