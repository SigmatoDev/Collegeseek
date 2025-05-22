"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { api_url } from "@/utils/apiCall";
import toast from "react-hot-toast";

const OwnershipForm = () => {
  const router = useRouter();
  const { id: ownershipId } = useParams();

  const [ownershipData, setOwnershipData] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchOwnershipData = async () => {
      console.log(`📡 useEffect triggered for ownershipId: ${ownershipId}`);

      if (!ownershipId || ownershipId === "new") {
        console.log("No ownershipId or ownershipId is 'new', skipping fetch.");
        setIsFetching(false);
        return;
      }

      try {
        console.log(`📡 Fetching ownership data for ownershipId: ${ownershipId}`);

        const url = `${api_url}id/Ownership/${ownershipId}`;
        console.log(`🚀 API Request URL: ${url}`);

        const response = await axios.get(url);
        const data = response.data;
        console.log("📜 Ownership Data:", data);

        setOwnershipData({
          name: data.name || "",
        });
        console.log("✅ Ownership data set:", { name: data.name });
      } catch (err) {
        console.error("❌ Error fetching ownership data:", err);
        setError("Failed to fetch ownership data. Please try again.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchOwnershipData();
  }, [ownershipId]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setOwnershipData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleCancel = () => {
    router.push("/admin/ownership");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!ownershipData.name) {
      setError("Ownership name is required.");
      setLoading(false);
      return;
    }

    try {
      const url =
        ownershipId && ownershipId !== "new"
          ? `${api_url}update/Ownership/${ownershipId}`
          : `${api_url}/create/Ownership/`;
      const method = ownershipId && ownershipId !== "new" ? axios.put : axios.post;

      const response = await method(url, ownershipData);

      if ([200, 201].includes(response.status)) {
        toast.success("Ownership saved successfully!");
        router.push("/admin/ownership");
      } else {
        setError("Failed to save ownership. Please try again.");
      }
    } catch (err: any) {
      console.error(err);

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Show backend error message like "Ownership name already exists"
      } else {
        setError("Failed to save ownership. Please try again.");
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
        {ownershipId && ownershipId !== "new" ? "Edit Ownership" : "Create New Ownership"}
      </h1>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Ownership Name"
            value={ownershipData.name}
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
            {loading ? (
              <Loader className="animate-spin h-5 w-5" />
            ) : ownershipId && ownershipId !== "new" ? (
              "Update Ownership"
            ) : (
              "Publish Ownership"
            )}
          </button>
          {ownershipId && ownershipId !== "new" && (
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

export default OwnershipForm;
