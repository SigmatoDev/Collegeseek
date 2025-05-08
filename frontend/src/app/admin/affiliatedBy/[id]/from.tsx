"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { api_url } from "@/utils/apiCall";

const AffiliatedByForm = () => {
  const router = useRouter();
  const { id: affiliatedById } = useParams();

  const [affiliatedData, setAffiliatedData] = useState({
    name: "",
    code: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchAffiliatedData = async () => {
      console.log("Fetching affiliated data for ID:", affiliatedById);

      if (!affiliatedById || affiliatedById === "new") {
        setIsFetching(false);
        return;
      }

      try {
        const url = `${api_url}id/affiliated/${affiliatedById}`;
        const response = await axios.get(url);

        // ✅ Fix: Accessing nested data
        const data = response.data?.data;

        if (!data) {
          setError("No data received.");
        } else {
          setAffiliatedData({
            name: data.name || "",
            code: data.code || "",
          });
        }
      } catch (err) {
        console.error("Error fetching affiliated data:", err);
        setError("Failed to fetch affiliated data. Please try again.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchAffiliatedData();
  }, [affiliatedById]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAffiliatedData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleCancel = () => {
    router.push("/admin/affiliatedBy");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!affiliatedData.name || !affiliatedData.code) {
      setError("Affiliated name and code are required.");
      setLoading(false);
      return;
    }

    try {
      const url =
        affiliatedById && affiliatedById !== "new"
          ? `${api_url}update/affiliated/${affiliatedById}`
          : `${api_url}create/affiliated`;
      const method =
        affiliatedById && affiliatedById !== "new" ? axios.put : axios.post;

      const response = await method(url, affiliatedData);

      if ([200, 201].includes(response.status)) {
        alert("AffiliatedBy saved successfully!");
        router.push("/admin/affiliatedBy");
      } else {
        setError("Failed to save affiliated data. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save affiliated data. Please try again.");
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
        {affiliatedById && affiliatedById !== "new"
          ? "Edit Affiliated By"
          : "Create New Affiliated By"}
      </h1>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            placeholder="Affiliated Name"
            value={affiliatedData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="code"
            placeholder="Affiliated Code"
            value={affiliatedData.code}
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
            ) : affiliatedById && affiliatedById !== "new" ? (
              "Update Affiliated"
            ) : (
              "Publish Affiliated"
            )}
          </button>
          {affiliatedById && affiliatedById !== "new" && (
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

export default AffiliatedByForm;
