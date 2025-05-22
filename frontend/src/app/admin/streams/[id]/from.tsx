"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { api_url } from "@/utils/apiCall";
import toast from "react-hot-toast";

const StreamForm = () => {
  const router = useRouter();
  const { id: streamId } = useParams();

  const [streamData, setStreamData] = useState({ name: "" });
  const [file, setFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchStreamData = async () => {
      if (!streamId || streamId === "new") {
        setIsFetching(false);
        return;
      }

      try {
        const url = `${api_url}id/streams/${streamId}`;
        const response = await axios.get(url);
        const data = response.data;

        setStreamData({ name: data.name || "" });

        if (data.image) {
          // Replace backslashes with forward slashes for URL correctness
          const normalizedImagePath = data.image.replace(/\\/g, "/");

          // Remove trailing slash from api_url if exists
          const baseUrl = api_url.endsWith("/") ? api_url.slice(0, -1) : api_url;

          // Remove '/api' if it exists at the end of baseUrl
          const imageBaseUrl = baseUrl.endsWith("/api") ? baseUrl.slice(0, -4) : baseUrl;

          // Combine to create the full image URL
          const fullImageUrl = `${imageBaseUrl}/${normalizedImagePath}`;

          setExistingImage(fullImageUrl);
        }
      } catch (err) {
        setError("Failed to fetch stream data. Please try again.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchStreamData();
  }, [streamId]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setStreamData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const previewURL = URL.createObjectURL(selectedFile);
      setPreviewImage(previewURL);
    } else {
      setPreviewImage(null);
    }
  };

  const handleCancel = () => {
    router.push("/admin/streams");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!streamData.name) {
      setError("Stream name is required.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", streamData.name);
      if (file) {
        formData.append("image", file);
      }

      const url =
        streamId && streamId !== "new"
          ? `${api_url}update/streams/${streamId}`
          : `${api_url}create/streams`;

      const method = streamId && streamId !== "new" ? axios.put : axios.post;

      const response = await method(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if ([200, 201].includes(response.status)) {
        toast.success("Stream saved successfully!");
        router.push("/admin/streams");
      } else {
        setError("Failed to save stream. Please try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save stream.");
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
        {streamId && streamId !== "new" ? "Edit Stream" : "Create New Stream"}
      </h1>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <input
          type="text"
          name="name"
          placeholder="Stream Name"
          value={streamData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-3 border rounded-lg"
        />

        {(previewImage || existingImage) && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
            <img
              src={previewImage || existingImage!}
              alt="Stream Preview"
              className="h-40 rounded-lg border"
            />
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? (
              <Loader className="animate-spin h-5 w-5" />
            ) : streamId && streamId !== "new" ? (
              "Update Stream"
            ) : (
              "Publish Stream"
            )}
          </button>
          {streamId && streamId !== "new" && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white p-3 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StreamForm;
