"use client";

import { useState, ChangeEvent } from "react";
import { api_url } from "@/utils/apiCall";
import axios from "axios";
import { toast } from "react-hot-toast";

type FailedImport = {
  rowNumber?: number;
  college: string;
  error: string;
};

type ImportResponse = {
  message: string;
  successCount: number;
  failedCount: number;
  failedColleges: FailedImport[];
};

const ImportColleges = () => {
  const [file, setFile] = useState<File | null>(null);
  const [failed, setFailed] = useState<FailedImport[]>([]);
  const [responseInfo, setResponseInfo] = useState<ImportResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const safeText = (value: unknown, fallback = ""): string => {
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (value && typeof value === "object") {
      const data = value as { text?: unknown; result?: unknown; message?: unknown; error?: unknown };
      return safeText(data.text ?? data.result ?? data.message ?? data.error, fallback);
    }
    return fallback;
  };

  const getMessage = (data: any): string =>
    safeText(data?.message ?? data?.error ?? data?.details, "Import failed.");

  const getFailedColleges = (data: any): FailedImport[] => {
    const failedItems = Array.isArray(data?.failedColleges)
      ? data.failedColleges
      : Array.isArray(data?.failed)
        ? data.failed
        : [];

    return failedItems.map((item: any, index: number) => ({
      rowNumber: typeof item?.rowNumber === "number" ? item.rowNumber : undefined,
      college: safeText(item?.college, `Row ${index + 1}`),
      error: safeText(item?.error ?? item?.message, "Unknown error"),
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file first.");
    const maxExcelFileSizeMb = 100;

    if (file.size > maxExcelFileSizeMb * 1024 * 1024) {
      return toast.error(`Excel file is too large. Maximum allowed size is ${maxExcelFileSizeMb}MB.`);
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const { data } = await axios.post(`${api_url}colleges/import-excel`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const failedColleges = getFailedColleges(data);
      const message = getMessage(data);

      toast.success(message);
      setFailed(failedColleges);
      setResponseInfo({
        message,
        successCount: Number(data.successCount) || 0,
        failedCount: Number(data.failedCount ?? failedColleges.length) || 0,
        failedColleges,
      });

      setFile(null); // Clear file input
    } catch (error: any) {
      console.error("Upload failed", error);
      const data = error.response?.data;
      const failedColleges = getFailedColleges(data);
      const message = getMessage(data);

      toast.error(message);
      setFailed(failedColleges);
      setResponseInfo({
        message,
        successCount: Number(data?.successCount) || 0,
        failedCount: Number(data?.failedCount ?? failedColleges.length) || 0,
        failedColleges,
      });
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
      <h1 className="text-md font-bold pb-1">📥 Import Colleges via Excel</h1>

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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
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
            <strong>Success:</strong> {responseInfo.successCount}
          </p>
          <p>
            <strong>Failed:</strong> {responseInfo.failedCount}
          </p>
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
                {item.rowNumber ? `Row ${item.rowNumber} - ` : ""}
                {item.college}: <span className="text-red-500">{item.error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImportColleges;
