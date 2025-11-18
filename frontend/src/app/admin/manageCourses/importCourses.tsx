"use client";

import { useState, ChangeEvent } from "react";
import { api_url } from "@/utils/apiCall";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

type FailedImport = {
  course: string;
  error: string;
};

type ImportResponse = {
  message: string;
  imported: number;
  updated: number;
  failedCourses?: FailedImport[];
};

const ImportCourses = () => {
  const [file, setFile] = useState<File | null>(null);
  const [failed, setFailed] = useState<FailedImport[]>([]);
  const [responseInfo, setResponseInfo] = useState<ImportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      console.log("📂 File selected:", e.target.files[0].name); // ✅ log file
      setFile(e.target.files[0]);
    }
  };

 const handleUpload = async () => {
  if (!file) {
    console.warn("⚠️ No file selected for upload");
    return toast.error("Please select a file first.");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    setLoading(true);
    console.log("⏳ Uploading file:", file.name);

    const response = await axios.post(
      `${api_url}courses/import-excel`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    const data = response.data;

    // ✅ Success
    console.log("✅ Server Response:", data);
    toast.success(data.message);

    setFailed(data.failedCourses || []);
    setResponseInfo({
      message: data.message,
      imported: data.imported,
      updated: data.updated,
      failedCourses: data.failedCourses || [],
    });

    setFile(null);

  } catch (error: any) {
    console.error("🚨 Upload failed:", error);

    if (error.response) {
      // 🔍 Log backend error for debugging
      console.error("📡 Backend error details:", error.response.data);

      const backendMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        "Failed to import courses.";

      toast.error(backendMessage);

      setResponseInfo({
        message: backendMessage,
        imported: error.response.data?.imported || 0,
        updated: error.response.data?.updated || 0,
        failedCourses: error.response.data?.failedCourses || [],
      });

      const failedRows = error.response.data?.failedCourses || [];
      setFailed(failedRows);

      // 🔔 Notify each failed row
      failedRows.forEach((f: any) => {
        toast.error(`${f.course}: ${f.error}`);
      });

    } else {
      // ❌ Fatal or network level error
      console.error("❌ Unexpected error:", error.message);
      toast.error(error.message || "Unexpected error occurred");
    }
  } finally {
    setLoading(false);
  }
};



  const reset = () => {
    console.log("🔄 Resetting import state"); // ✅ log reset
    setFile(null);
    setFailed([]);
    setResponseInfo(null);
  };

  return (
    <div className="mb-10">
      <h1 className="text-md font-bold pb-1">📥 Import Courses via Excel</h1>

      <div className="flex items-center flex-wrap gap-4">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="border border-gray-300 rounded px-3 py-2"
        />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {(failed.length > 0 || responseInfo) && (
          <button
            onClick={reset}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Reset
          </button>
        )}
      </div>

      {responseInfo && (
        <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50 text-sm text-gray-700 space-y-1">
          <p>
            <strong>Message:</strong> {responseInfo.message}
          </p>
          <p>
            <strong>Imported:</strong> {responseInfo.imported}
          </p>
          <p>
            <strong>Updated:</strong> {responseInfo.updated}
          </p>
          {responseInfo.failedCourses &&
            responseInfo.failedCourses.length > 0 && (
              <p>
                <strong>Failed:</strong> {responseInfo.failedCourses.length}
              </p>
            )}
        </div>
      )}

      {failed.length > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded">
          <h2 className="text-sm font-semibold text-red-700 mb-2">
            ❌ Failed Imports:
          </h2>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            {failed.map((item, idx) => (
              <li key={idx}>
                {item.course}:{" "}
                <span className="text-red-500">{item.error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImportCourses;
