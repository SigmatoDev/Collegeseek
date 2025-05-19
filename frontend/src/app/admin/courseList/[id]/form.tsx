"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { api_url, img_url } from "@/utils/apiCall";

const CourseForm = () => {
  const router = useRouter();
  const { id: courseId } = useParams();

  const [courseData, setCourseData] = useState({
    name: "",
    code: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId || courseId === "new") return;
      try {
        const response = await axios.get(`${api_url}course-list/${courseId}`);
        const data = response.data.data;

        setCourseData({
          name: data.name || "",
          code: data.code || "",
        });

        if (data.image) {
          setImageUrl(`${img_url}${data.image}`);
        }
      } catch (err: any) {
        const backendMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to fetch course data.";
        setError(backendMessage);
        toast.error(backendMessage);
      }
    };
    fetchCourseData();
  }, [courseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Use FileReader to avoid hydration mismatch
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    router.push("/admin/courseList");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!courseData.name || !courseData.code) {
      setError("Course name and code are required.");
      toast.error("Course name and code are required.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", courseData.name);
      formData.append("code", courseData.code);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const url =
        courseId && courseId !== "new"
          ? `${api_url}course-list/${courseId}`
          : `${api_url}course-list`;

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const method = courseId && courseId !== "new" ? axios.put : axios.post;
      const response = await method(url, formData, config);

      if ([200, 201].includes(response.status)) {
        toast.success("Course saved successfully!");
        router.push("/admin/courseList");
      } else {
        setError("Failed to save course. Please try again.");
        toast.error("Failed to save course. Please try again.");
      }
    } catch (err: any) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to save course.";
      setError(backendMessage);
      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-8xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">
          {courseId && courseId !== "new" ? "Edit Course" : "Create New Course"}
        </h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Upload Course Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </div>

          {imageUrl && (
            <div className="mb-4">
              <p className="text-gray-600 mb-2">Course Image Preview:</p>
              <img
                src={imageUrl}
                alt="Course Preview"
                className="mt-2 max-h-40 rounded-lg border"
              />
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <Loader className="animate-spin h-5 w-5 mx-auto" />
              ) : courseId && courseId !== "new" ? (
                "Update Course"
              ) : (
                "Publish Course"
              )}
            </button>

            {courseId && courseId !== "new" && (
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default CourseForm;
