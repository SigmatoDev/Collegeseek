"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { api_url, img_url } from "@/utils/apiCall";
import toast from "react-hot-toast";

const ExamExpectedForm = () => {
  const router = useRouter();
  const { id: examExpectedId } = useParams();

  const [examExpectedData, setExamExpectedData] = useState({
    name: "",
    code: "",
    image: null as File | null,
    imagePreviewUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true);

useEffect(() => {
  const fetchExamExpectedData = async () => {
    if (!examExpectedId || examExpectedId === "new") {
      setIsFetching(false);
      return;
    }

    try {
      const url = `${api_url}id/Exams/${examExpectedId}`;
      const response = await axios.get(url);
      const data = response.data;

      setExamExpectedData({
        name: data.name || "",
        code: data.code || "",
        image: null,
        imagePreviewUrl: data.image ? `${img_url}${data.image}` : "",
      });
    } catch (err) {
      setError("Failed to fetch exam expected data. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  fetchExamExpectedData();
}, [examExpectedId]);


  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setExamExpectedData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExamExpectedData((prev) => ({
        ...prev,
        image: file,
        imagePreviewUrl: URL.createObjectURL(file),
      }));
    }
  };

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
      const url =
        examExpectedId && examExpectedId !== "new"
          ? `${api_url}update/Exams/${examExpectedId}`
          : `${api_url}create/Exams`;

      const formData = new FormData();
      formData.append("name", examExpectedData.name);
      formData.append("code", examExpectedData.code);

      if (examExpectedData.image) {
        formData.append("image", examExpectedData.image);
      }

      const response =
        examExpectedId && examExpectedId !== "new"
          ? await axios.put(url, formData, { headers: { "Content-Type": "multipart/form-data" } })
          : await axios.post(url, formData, { headers: { "Content-Type": "multipart/form-data" } });

      if ([200, 201].includes(response.status)) {
        toast.success("Exam Expected saved successfully!");
        router.push("/admin/examExpected");
      } else {
        setError("Failed to save exam expected. Please try again.");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 409) {
          setError(err.response.data.message || "Exam name or code already exists.");
        } else {
          setError("Failed to save exam expected. Please try again.");
        }
      } else {
        setError("Failed to save exam expected. Please try again.");
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
    <div className="max-w-1xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">
        {examExpectedId && examExpectedId !== "new" ? "Edit Exam Expected" : "Create New Exam Expected"}
      </h1>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleFormSubmit} className="space-y-6" encType="multipart/form-data">
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

        <div>
          <label className="block mb-1 font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 rounded"
          />
          {examExpectedData.imagePreviewUrl && (
            <img
              src={examExpectedData.imagePreviewUrl}
              alt="Preview"
              className="mt-4 max-h-40 rounded-lg border"
            />
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? (
              <Loader className="animate-spin h-5 w-5" />
            ) : examExpectedId && examExpectedId !== "new" ? (
              "Update Exam Expected"
            ) : (
              "Publish Exam Expected"
            )}
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
