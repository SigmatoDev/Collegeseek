"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { api_url } from "@/utils/apiCall";

const StreamForm = () => {
  const router = useRouter();
  const { id: streamId } = useParams();

  const [streamData, setStreamData] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchStreamData = async () => {
      console.log(`📡 useEffect triggered for streamId: ${streamId}`);

      if (!streamId || streamId === "new") {
        console.log("No streamId or streamId is 'new', skipping fetch.");
        setIsFetching(false);
        return;
      }

      try {
        const url = `${api_url}id/streams/${streamId}`;
        console.log(`🚀 API Request URL: ${url}`);

        const response = await axios.get(url);
        console.log("📊 API Response:", response.data);

        const data = response.data;
        setStreamData({
          name: data.name || "",
        });

        console.log("✅ Stream data set:", { name: data.name });
      } catch (err) {
        console.error("❌ Error fetching stream data:", err);
        setError("Failed to fetch stream data. Please try again.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchStreamData();
  }, [streamId]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setStreamData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

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
      const url =
        streamId && streamId !== "new"
          ? `${api_url}update/streams/${streamId}`
          : `${api_url}create/streams`;
      const method = streamId && streamId !== "new" ? axios.put : axios.post;

      const response = await method(url, streamData);

      if ([200, 201].includes(response.status)) {
        alert("Stream saved successfully!");
        router.push("/admin/streams");
      } else {
        setError("Failed to save stream. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save stream. Please try again.");
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
