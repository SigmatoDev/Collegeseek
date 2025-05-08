"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { api_url } from "@/utils/apiCall";

const ExamExpectedForm = () => {
  const router = useRouter();
  const { id: examExpectedId } = useParams(); // Dynamically fetching the examExpectedId from the URL

  const [examExpectedData, setExamExpectedData] = useState({
    name: "",
    code: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true); // New state to handle loading

  useEffect(() => {
    const fetchExamExpectedData = async () => {
      if (!examExpectedId || examExpectedId === "new") {
        setIsFetching(false); // Set fetching to false immediately if it's a new examExpected
        return;
      }

      try {
        const url = `${api_url}id/Exams/${examExpectedId}`;
        const response = await axios.get(url);
        const data = response.data;

        setExamExpectedData({
          name: data.name || "",
          code: data.code || "",
        });
      } catch (err) {
        setError("Failed to fetch exam expected data. Please try again.");
      } finally {
        setIsFetching(false); // Set fetching to false after data is fetched or failed
      }
    };

    fetchExamExpectedData();
  }, [examExpectedId]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setExamExpectedData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleCancel = () => {
    router.push("/admin/examExpected");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!examExpectedData.name || !examExpectedData.code) {
      setError("Exam name and code are required.");
      setLoading(false);
      return;
    }

    try {
      const url = examExpectedId && examExpectedId !== "new" ? `${api_url}update/Exams/${examExpectedId}` : `${api_url}create/Exams`;
      const method = examExpectedId && examExpectedId !== "new" ? axios.put : axios.post;

      const response = await method(url, examExpectedData);  // Send examExpectedData as JSON

      if ([200, 201].includes(response.status)) {
        alert("Exam Expected saved successfully!");
        router.push("/admin/examExpected");
      } else {
        setError("Failed to save exam expected. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save exam expected. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Avoid rendering the form until we have fetched the data
  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-1xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">
        {examExpectedId && examExpectedId !== "new" ? "Edit Exam Expected" : "Create New Exam Expected"}
      </h1>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            placeholder="Exam Expected Name"
            value={examExpectedData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="code"
            placeholder="Exam Expected Code"
            value={examExpectedData.code}
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
            {loading ? <Loader className="animate-spin h-5 w-5" /> : examExpectedId && examExpectedId !== "new" ? "Update Exam Expected" : "Publish Exam Expected"}
          </button>
          {examExpectedId && examExpectedId !== "new" && (
            <button type="button" onClick={handleCancel} className="bg-gray-500 text-white p-3 rounded-lg">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExamExpectedForm;
