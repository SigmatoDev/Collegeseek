"use client";

import { useState } from "react";
import { api_url } from "@/utils/apiCall";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const ImportColleges = () => {
  const [file, setFile] = useState<File | null>(null);
  const [failed, setFailed] = useState([]);
  const [responseInfo, setResponseInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first.");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${api_url}colleges/import-excel`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(data.message);
      setFailed(data.failedColleges || []);
      setResponseInfo({
        successCount: data.successCount,
        failedCount: data.failedCount,
        message: data.message,
      });
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to import colleges.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-10">
      <h1 className="text-md font-bold pb-1">Import Colleges via Excel</h1>

      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="border border-gray-300 rounded px-3 py-2"
        />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {failed.length > 0 && (
          <div className="text-sm text-red-600">Failed: {failed.length}</div>
        )}
      </div>

      {/* Display Summary Response */}
      {responseInfo && (
        <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50 text-sm text-gray-700">
          <p>
            <strong>Message:</strong> {responseInfo.message}
          </p>
          <p>
            <strong>Success:</strong> {responseInfo.successCount}
          </p>
          <p>
            <strong>Failed:</strong> {responseInfo.failedCount}
          </p>
        </div>
      )}

      {/* Detailed Error List */}
      {failed.length > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded">
          <h2 className="text-sm font-medium text-red-700 mb-2">
            Failed Imports:
          </h2>
          <ul className="list-disc pl-5 text-sm text-gray-700">
            {failed.map((item: any, idx: number) => (
              <li key={idx}>
                {item.college}:{" "}
                <span className="text-red-500">{item.error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImportColleges;
