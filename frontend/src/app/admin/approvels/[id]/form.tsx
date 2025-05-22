"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { api_url } from "@/utils/apiCall";

const ApprovalForm = () => {
  const router = useRouter();
  const { id: approvalId } = useParams(); // Dynamically fetching the approvalId from the URL

  const [approvalData, setApprovalData] = useState({
    name: "",
    code: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true); // New state to handle loading

  useEffect(() => {
    const fetchApprovalData = async () => {
      // Log when the function is called and the current approvalId
      console.log(`📡 useEffect triggered for approvalId: ${approvalId}`);

      if (!approvalId || approvalId === "new") {
        console.log("No approvalId or approvalId is 'new', skipping fetch.");
        setIsFetching(false); // Set fetching to false immediately if it's a new approval
        return;
      }

      try {
        console.log(`📡 Fetching approval data for approvalId: ${approvalId}`);

        const url = `${api_url}id/approvals/${approvalId}`;
        console.log(`🚀 API Request URL: ${url}`); // Log the URL being called

        const response = await axios.get(url);
        console.log("📊 API Response:", response.data); // Log the full API response

        // Access the data directly, since it's not inside 'data' field
        const data = response.data; // This is the actual approval data
        console.log("📜 Approval Data:", data); // Log the approval data received

        setApprovalData({
          name: data.name || "",
          code: data.code || "",
        });
        console.log("✅ Approval data set:", { name: data.name, code: data.code });
      } catch (err) {
        console.error("❌ Error fetching approval data:", err); // Log error details
        setError("Failed to fetch approval data. Please try again.");
      } finally {
        setIsFetching(false); // Set fetching to false after data is fetched or failed
      }
    };

    fetchApprovalData();
  }, [approvalId]);

  // Updated handleChange to handle <input> and <textarea> elements
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setApprovalData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleCancel = () => {
    router.push("/admin/approvels");
  };

const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  if (!approvalData.name || !approvalData.code) {
    setError("Approval name and code are required.");
    setLoading(false);
    return;
  }

  try {
    const url = approvalId && approvalId !== "new"
      ? `${api_url}update/approvals/${approvalId}`
      : `${api_url}create/approvals`;
    const method = approvalId && approvalId !== "new" ? axios.put : axios.post;

    const response = await method(url, approvalData);  // Send approvalData as JSON

    if ([200, 201].includes(response.status)) {
      alert("Approval saved successfully!");
      router.push("/admin/approvels");
    } else {
      setError("Failed to save approval. Please try again.");
    }
  } catch (err: any) {
    console.error("❌ Error saving approval:", err);
    if (err.response && err.response.data && err.response.data.message) {
      setError(err.response.data.message);  // Show backend message like "Specialization with this name already exists"
    } else {
      setError("Failed to save approval. Please try again.");
    }
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
    <div className="max-w-[1580px] mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">
        {approvalId && approvalId !== "new" ? "Edit Approval" : "Create New Approval"}
      </h1>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            placeholder="Approval Name"
            value={approvalData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="code"
            placeholder="Approval Code"
            value={approvalData.code}
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
            {loading ? <Loader className="animate-spin h-5 w-5" /> : approvalId && approvalId !== "new" ? "Update Approval" : "Publish Approval"}
          </button>
          {approvalId && approvalId !== "new" && (
            <button type="button" onClick={handleCancel} className="bg-gray-500 text-white p-3 rounded-lg">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ApprovalForm;
