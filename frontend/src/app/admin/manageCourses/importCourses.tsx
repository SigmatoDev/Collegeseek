"use client";

import { useState, ChangeEvent } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { api_url } from "@/utils/apiCall";

type FailedImport = {
  course: string;
  error: string;
};

type ImportResponse = {
  message: string;
  imported: number;
  updated: number;
  failedCourses: FailedImport[]; // 🔥 ALWAYS an array
};

const ImportCourses = () => {
  const [file, setFile] = useState<File | null>(null);
  const [failed, setFailed] = useState<FailedImport[]>([]);
  const [responseInfo, setResponseInfo] = useState<ImportResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Safe extraction of backend error messages
  const safeMessage = (data: any): string => {
    if (!data) return "Unknown error";

    if (typeof data.message === "string") return data.message;
    if (typeof data.error === "string") return data.error;

    return JSON.stringify(data);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await axios.post(
        `${api_url}courses/import-excel`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const data = response.data;

      toast.success(safeMessage(data));

      const failedArray = data.failedCourses || [];

      setResponseInfo({
        message: safeMessage(data),
        imported: data.imported || 0,
        updated: data.updated || 0,
        failedCourses: failedArray, // 🔥 guaranteed array
      });

      setFailed(failedArray);
      setFile(null);
    } catch (err: any) {
      console.error("UPLOAD ERROR:", err);

      const backend = err.response?.data;
      const msg = safeMessage(backend);

      toast.error(msg);

      const failedArray = backend?.failedCourses || [];

      setResponseInfo({
        message: msg,
        imported: backend?.imported || 0,
        updated: backend?.updated || 0,
        failedCourses: failedArray, // 🔥 guaranteed array
      });

      setFailed(failedArray);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setFailed([]);
    setResponseInfo(null);
  };

  return (
    <div className="mb-10">
      <h1 className="text-md font-bold pb-2">📥 Import Courses via Excel</h1>

      <div className="flex items-center gap-4 flex-wrap">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="border rounded px-3 py-2"
        />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {(failed.length > 0 || responseInfo) && (
          <button
            onClick={reset}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            Reset
          </button>
        )}
      </div>

      {responseInfo && (
        <div className="mt-4 p-4 border rounded bg-gray-50 text-sm">
          <p><strong>Message:</strong> {responseInfo.message}</p>
          <p><strong>Imported:</strong> {responseInfo.imported}</p>
          <p><strong>Updated:</strong> {responseInfo.updated}</p>

          {responseInfo.failedCourses.length > 0 && (
            <p><strong>Failed:</strong> {responseInfo.failedCourses.length}</p>
          )}
        </div>
      )}

      {failed.length > 0 && (
        <div className="mt-4 bg-red-50 border border-red-300 p-4 rounded">
          <h2 className="text-red-700 font-semibold">❌ Failed Imports:</h2>
          <ul className="list-disc pl-5 mt-2">
            {failed.map((c, i) => (
              <li key={i} className="text-sm">
                <strong>{c.course}</strong>:{" "}
                <span className="text-red-600">{c.error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImportCourses;
