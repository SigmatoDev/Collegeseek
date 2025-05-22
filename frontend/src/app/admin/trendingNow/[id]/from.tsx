"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { api_url } from "@/utils/apiCall";
import toast from "react-hot-toast";

const TrendingExamForm = () => {
  const router = useRouter();
  const { id: examId } = useParams();

  const [examData, setExamData] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchExamData = async () => {
      if (!examId || examId === "new") {
        setIsFetching(false);
        return;
      }

      try {
        const url = `${api_url}id/trendingNow/${examId}`;
        const response = await axios.get(url);
        const data = response.data;

        setExamData({
          name: data.name || "",
        });
      } catch (err) {
        setError("Failed to fetch exam data. Please try again.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchExamData();
  }, [examId]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setExamData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleCancel = () => {
    router.push("/admin/trendingNow");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!examData.name.trim()) {
      setError("Exam name is required.");
      setLoading(false);
      return;
    }

    try {
      const url =
        examId && examId !== "new"
          ? `${api_url}update/trendingNow/${examId}`
          : `${api_url}create/trendingNow`;
      const method = examId && examId !== "new" ? axios.put : axios.post;

      const response = await method(url, examData);

      if ([200, 201].includes(response.status)) {
        toast.success("Exam saved successfully!");
        router.push("/admin/trendingNow");
      } else {
        setError("Failed to save exam. Please try again.");
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to save exam. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-[1580px] mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">
        {examId && examId !== "new" ? "Edit Trending Now" : "Create New Trending Now"}
      </h1>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
         <input
  type="text"
  name="name"
  placeholder="Exam Name"
  value={examData.name}
  onChange={handleChange}
  required
  className="w-full p-3 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-blue-600"
  disabled={loading}
/>

        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-600 transition"
          >
            {loading ? (
              <Loader className="animate-spin h-5 w-5 mx-auto" />
            ) : examId && examId !== "new" ? (
              "Update Trending Now"
            ) : (
              "Add Trending Now"
            )}
          </button>

          {examId && examId !== "new" && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white p-3 rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TrendingExamForm;
