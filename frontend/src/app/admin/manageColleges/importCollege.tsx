// "use client";

// import { useState, ChangeEvent } from "react";
// import { api_url } from "@/utils/apiCall";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// type FailedImport = {
//   rowNumber?: number;
//   college: string;
//   error: string;
// };

// type ImportResponse = {
//   message: string;
//   successCount: number;
//   failedCount: number;
//   failedColleges: FailedImport[];
// };

// const ImportColleges = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [failed, setFailed] = useState<FailedImport[]>([]);
//   const [responseInfo, setResponseInfo] = useState<ImportResponse | null>(null);
//   const [loading, setLoading] = useState(false);

//   const safeText = (value: unknown, fallback = ""): string => {
//     if (typeof value === "string") return value;
//     if (typeof value === "number" || typeof value === "boolean") return String(value);
//     if (value && typeof value === "object") {
//       const data = value as { text?: unknown; result?: unknown; message?: unknown; error?: unknown };
//       return safeText(data.text ?? data.result ?? data.message ?? data.error, fallback);
//     }
//     return fallback;
//   };

//   const getMessage = (data: any): string =>
//     safeText(data?.message ?? data?.error ?? data?.details, "Import failed.");

//   const getFailedColleges = (data: any): FailedImport[] => {
//     const failedItems = Array.isArray(data?.failedColleges)
//       ? data.failedColleges
//       : Array.isArray(data?.failed)
//         ? data.failed
//         : [];

//     return failedItems.map((item: any, index: number) => ({
//       rowNumber: typeof item?.rowNumber === "number" ? item.rowNumber : undefined,
//       college: safeText(item?.college, `Row ${index + 1}`),
//       error: safeText(item?.error ?? item?.message, "Unknown error"),
//     }));
//   };

//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.[0]) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) return toast.error("Please select a file first.");
//     const maxExcelFileSizeMb = 100;

//     if (file.size > maxExcelFileSizeMb * 1024 * 1024) {
//       return toast.error(`Excel file is too large. Maximum allowed size is ${maxExcelFileSizeMb}MB.`);
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setLoading(true);
//       const { data } = await axios.post(`${api_url}colleges/import-excel`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const failedColleges = getFailedColleges(data);
//       const message = getMessage(data);

//       toast.success(message);
//       setFailed(failedColleges);
//       setResponseInfo({
//         message,
//         successCount: Number(data.successCount) || 0,
//         failedCount: Number(data.failedCount ?? failedColleges.length) || 0,
//         failedColleges,
//       });

//       setFile(null); // Clear file input
//     } catch (error: any) {
//       console.error("Upload failed", error);
//       const data = error.response?.data;
//       const failedColleges = getFailedColleges(data);
//       const message = getMessage(data);

//       toast.error(message);
//       setFailed(failedColleges);
//       setResponseInfo({
//         message,
//         successCount: Number(data?.successCount) || 0,
//         failedCount: Number(data?.failedCount ?? failedColleges.length) || 0,
//         failedColleges,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const reset = () => {
//     setFile(null);
//     setFailed([]);
//     setResponseInfo(null);
//   };

//   return (
//     <div className="mb-10">
//       <h1 className="text-md font-bold pb-1">📥 Import Colleges via Excel</h1>

//       <div className="flex items-center flex-wrap gap-4">
//         <input
//           type="file"
//           accept=".xlsx,.xls"
//           onChange={handleFileChange}
//           className="border border-gray-300 rounded px-3 py-2"
//         />

//         <button
//           onClick={handleUpload}
//           disabled={!file || loading}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
//         >
//           {loading ? "Uploading..." : "Upload"}
//         </button>

//         {(failed.length > 0 || responseInfo) && (
//           <button
//             onClick={reset}
//             className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
//           >
//             Reset
//           </button>
//         )}
//       </div>

//       {responseInfo && (
//         <div className="mt-4 p-4 border border-gray-200 rounded bg-gray-50 text-sm text-gray-700 space-y-1">
//           <p>
//             <strong>Message:</strong> {responseInfo.message}
//           </p>
//           <p>
//             <strong>Success:</strong> {responseInfo.successCount}
//           </p>
//           <p>
//             <strong>Failed:</strong> {responseInfo.failedCount}
//           </p>
//         </div>
//       )}

//       {failed.length > 0 && (
//         <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded">
//           <h2 className="text-sm font-semibold text-red-700 mb-2">
//             ❌ Failed Imports:
//           </h2>
//           <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
//             {failed.map((item, idx) => (
//               <li key={idx}>
//                 {item.rowNumber ? `Row ${item.rowNumber} - ` : ""}
//                 {item.college}: <span className="text-red-500">{item.error}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ImportColleges;
"use client";

import { useRef, useState, ChangeEvent } from "react";
import { api_url } from "@/utils/apiCall";
import axios from "axios";
import { toast } from "react-hot-toast";

type FailedImport = {
  rowNumber?: number;
  college: string;
  error: string;
};

type CollegeResult = {
  id?: string;
  name: string;
  slug?: string;
};

type ImportResponse = {
  success: boolean;
  message: string;

  createdCount: number;
  updatedCount: number;
  failedCount: number;
  totalProcessed: number;

  createdColleges: CollegeResult[];
  updatedColleges: CollegeResult[];
  failedColleges: FailedImport[];

  // Backward compatibility
  successCount?: number;
  failed?: FailedImport[];
};

const ImportColleges = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);

  const [failed, setFailed] = useState<FailedImport[]>([]);
  const [created, setCreated] = useState<CollegeResult[]>([]);
  const [updated, setUpdated] = useState<CollegeResult[]>([]);

  const [responseInfo, setResponseInfo] =
    useState<ImportResponse | null>(null);

  const [loading, setLoading] = useState(false);

  // ============================================================
  // SAFE TEXT
  // ============================================================

  const safeText = (
    value: unknown,
    fallback = ""
  ): string => {
    if (typeof value === "string") {
      return value;
    }

    if (
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return String(value);
    }

    if (
      value &&
      typeof value === "object"
    ) {
      const data = value as {
        text?: unknown;
        result?: unknown;
        message?: unknown;
        error?: unknown;
        details?: unknown;
      };

      return safeText(
        data.text ??
          data.result ??
          data.message ??
          data.error ??
          data.details,
        fallback
      );
    }

    return fallback;
  };

  // ============================================================
  // GET MESSAGE
  // ============================================================

  const getMessage = (
    data: any,
    fallback = "Import failed."
  ): string => {
    return safeText(
      data?.message ??
        data?.error ??
        data?.details,
      fallback
    );
  };

  // ============================================================
  // GET FAILED COLLEGES
  // ============================================================

  const getFailedColleges = (
    data: any
  ): FailedImport[] => {
    const failedItems =
      Array.isArray(data?.failedColleges)
        ? data.failedColleges
        : Array.isArray(data?.failed)
          ? data.failed
          : [];

    return failedItems.map(
      (item: any, index: number) => ({
        rowNumber:
          typeof item?.rowNumber === "number"
            ? item.rowNumber
            : undefined,

        college: safeText(
          item?.college,
          `Row ${index + 1}`
        ),

        error: safeText(
          item?.error ??
            item?.message,
          "Unknown error"
        ),
      })
    );
  };

  // ============================================================
  // GET CREATED COLLEGES
  // ============================================================

  const getCreatedColleges = (
    data: any
  ): CollegeResult[] => {
    if (
      !Array.isArray(
        data?.createdColleges
      )
    ) {
      return [];
    }

    return data.createdColleges.map(
      (item: any) => ({
        id: safeText(item?.id),
        name: safeText(
          item?.name,
          "Unknown college"
        ),
        slug: safeText(item?.slug),
      })
    );
  };

  // ============================================================
  // GET UPDATED COLLEGES
  // ============================================================

  const getUpdatedColleges = (
    data: any
  ): CollegeResult[] => {
    if (
      !Array.isArray(
        data?.updatedColleges
      )
    ) {
      return [];
    }

    return data.updatedColleges.map(
      (item: any) => ({
        id: safeText(item?.id),
        name: safeText(
          item?.name,
          "Unknown college"
        ),
        slug: safeText(item?.slug),
      })
    );
  };

  // ============================================================
  // FILE CHANGE
  // ============================================================

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedExtensions = [
      ".xlsx",
      ".xls",
    ];

    const fileName =
      selectedFile.name.toLowerCase();

    const isExcelFile =
      allowedExtensions.some(
        (extension) =>
          fileName.endsWith(extension)
      );

    if (!isExcelFile) {
      toast.error(
        "Please select an Excel file (.xlsx or .xls)."
      );

      e.target.value = "";
      setFile(null);

      return;
    }

    const maxExcelFileSizeMb = 100;

    if (
      selectedFile.size >
      maxExcelFileSizeMb *
        1024 *
        1024
    ) {
      toast.error(
        `Excel file is too large. Maximum allowed size is ${maxExcelFileSizeMb}MB.`
      );

      e.target.value = "";
      setFile(null);

      return;
    }

    setFile(selectedFile);

    // Clear old results when selecting another file
    setFailed([]);
    setCreated([]);
    setUpdated([]);
    setResponseInfo(null);
  };

  // ============================================================
  // UPLOAD
  // ============================================================

  const handleUpload = async () => {
    if (!file) {
      toast.error(
        "Please select an Excel file first."
      );
      return;
    }

    const maxExcelFileSizeMb = 100;

    if (
      file.size >
      maxExcelFileSizeMb *
        1024 *
        1024
    ) {
      toast.error(
        `Excel file is too large. Maximum allowed size is ${maxExcelFileSizeMb}MB.`
      );

      return;
    }

    const formData = new FormData();

    formData.append(
      "file",
      file
    );

    try {
      setLoading(true);

      // Clear previous results
      setFailed([]);
      setCreated([]);
      setUpdated([]);
      setResponseInfo(null);

      const response =
        await axios.post(
          `${api_url}colleges/import-excel`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },

            // Optional timeout
            timeout:
              10 * 60 * 1000,
          }
        );

      const data =
        response.data || {};

      const failedColleges =
        getFailedColleges(data);

      const createdColleges =
        getCreatedColleges(data);

      const updatedColleges =
        getUpdatedColleges(data);

      const message =
        getMessage(
          data,
          "College import completed."
        );

      const createdCount =
        Number(
          data.createdCount ??
            createdColleges.length
        ) || 0;

      const updatedCount =
        Number(
          data.updatedCount ??
            updatedColleges.length
        ) || 0;

      const failedCount =
        Number(
          data.failedCount ??
            failedColleges.length
        ) || 0;

      const totalProcessed =
        Number(
          data.totalProcessed ??
            createdCount +
              updatedCount +
              failedCount
        ) || 0;

      const result: ImportResponse =
        {
          success:
            data.success !== false,

          message,

          createdCount,
          updatedCount,
          failedCount,
          totalProcessed,

          createdColleges,
          updatedColleges,
          failedColleges,

          // Backward compatibility
          successCount:
            Number(
              data.successCount ??
                createdCount +
                  updatedCount
            ) || 0,

          failed:
            failedColleges,
        };

      setResponseInfo(result);
      setFailed(failedColleges);
      setCreated(createdColleges);
      setUpdated(updatedColleges);

      // ========================================================
      // SUCCESS TOAST
      // ========================================================

      if (
        failedCount > 0 &&
        createdCount === 0 &&
        updatedCount === 0
      ) {
        toast.error(
          `Import failed. ${failedCount} row(s) failed.`
        );
      } else if (
        failedCount > 0
      ) {
        toast.success(
          `Import completed: ${createdCount} created, ${updatedCount} updated, ${failedCount} failed.`
        );
      } else {
        toast.success(
          `Import completed: ${createdCount} created, ${updatedCount} updated.`
        );
      }

      // Clear selected file
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }
    } catch (error: any) {
      console.error(
        "❌ College import failed:",
        error
      );

      const data =
        error?.response?.data || {};

      const failedColleges =
        getFailedColleges(data);

      const createdColleges =
        getCreatedColleges(data);

      const updatedColleges =
        getUpdatedColleges(data);

      const message =
        getMessage(
          data,
          error?.message ||
            "Failed to import colleges."
        );

      const createdCount =
        Number(
          data?.createdCount ??
            createdColleges.length
        ) || 0;

      const updatedCount =
        Number(
          data?.updatedCount ??
            updatedColleges.length
        ) || 0;

      const failedCount =
        Number(
          data?.failedCount ??
            failedColleges.length
        ) || 0;

      const totalProcessed =
        Number(
          data?.totalProcessed ??
            createdCount +
              updatedCount +
              failedCount
        ) || 0;

      const result: ImportResponse =
        {
          success: false,

          message,

          createdCount,
          updatedCount,
          failedCount,
          totalProcessed,

          createdColleges,
          updatedColleges,
          failedColleges,

          successCount:
            createdCount +
            updatedCount,

          failed:
            failedColleges,
        };

      setResponseInfo(result);
      setFailed(failedColleges);
      setCreated(createdColleges);
      setUpdated(updatedColleges);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // RESET
  // ============================================================

  const reset = () => {
    setFile(null);
    setFailed([]);
    setCreated([]);
    setUpdated([]);
    setResponseInfo(null);

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="mb-10">
      {/* ======================================================
          TITLE
      ====================================================== */}

      <h1 className="text-md font-bold pb-3">
        📥 Import Colleges via Excel
      </h1>

      {/* ======================================================
          UPLOAD AREA
      ====================================================== */}

      <div className="flex items-center flex-wrap gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          disabled={loading}
          className="border border-gray-300 rounded px-3 py-2 bg-white"
        />

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Importing..."
            : "Upload"}
        </button>

        {(failed.length > 0 ||
          created.length > 0 ||
          updated.length > 0 ||
          responseInfo) && (
          <button
            type="button"
            onClick={reset}
            disabled={loading}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition disabled:opacity-50"
          >
            Reset
          </button>
        )}
      </div>

      {/* ======================================================
          SELECTED FILE
      ====================================================== */}

      {file && !loading && (
        <div className="mt-3 text-sm text-gray-600">
          📄 Selected file:{" "}
          <strong>
            {file.name}
          </strong>
        </div>
      )}

      {/* ======================================================
          LOADING
      ====================================================== */}

      {loading && (
        <div className="mt-4 p-4 rounded border border-blue-200 bg-blue-50 text-blue-700">
          <div className="font-medium">
            ⏳ Importing colleges...
          </div>

          <div className="text-sm mt-1">
            Please wait. Large Excel files or
            image uploads may take some time.
          </div>
        </div>
      )}

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      {responseInfo && (
        <div className="mt-5 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="font-semibold text-gray-800 mb-3">
            📊 Import Summary
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* CREATED */}

            <div className="p-3 rounded bg-green-100 border border-green-200">
              <div className="text-xs text-green-700">
                Created
              </div>

              <div className="text-2xl font-bold text-green-700">
                {responseInfo.createdCount}
              </div>
            </div>

            {/* UPDATED */}

            <div className="p-3 rounded bg-blue-100 border border-blue-200">
              <div className="text-xs text-blue-700">
                Updated
              </div>

              <div className="text-2xl font-bold text-blue-700">
                {responseInfo.updatedCount}
              </div>
            </div>

            {/* FAILED */}

            <div className="p-3 rounded bg-red-100 border border-red-200">
              <div className="text-xs text-red-700">
                Failed
              </div>

              <div className="text-2xl font-bold text-red-700">
                {responseInfo.failedCount}
              </div>
            </div>

            {/* TOTAL */}

            <div className="p-3 rounded bg-gray-100 border border-gray-200">
              <div className="text-xs text-gray-700">
                Total Processed
              </div>

              <div className="text-2xl font-bold text-gray-700">
                {responseInfo.totalProcessed}
              </div>
            </div>
          </div>

          {/* MESSAGE */}

          <div className="mt-4 text-sm text-gray-700">
            <strong>
              Message:
            </strong>{" "}
            {responseInfo.message}
          </div>
        </div>
      )}

      {/* ======================================================
          CREATED COLLEGES
      ====================================================== */}

      {created.length > 0 && (
        <div className="mt-5 bg-green-50 border border-green-200 p-4 rounded-lg">
          <h2 className="text-sm font-semibold text-green-700 mb-3">
            ✅ Created Colleges ({created.length})
          </h2>

          <div className="space-y-2">
            {created.map(
              (college, index) => (
                <div
                  key={
                    college.id ||
                    `${college.name}-${index}`
                  }
                  className="bg-white border border-green-100 rounded p-3"
                >
                  <div className="font-medium text-gray-800">
                    {index + 1}.{" "}
                    {college.name}
                  </div>

                  {college.slug && (
                    <div className="text-xs text-gray-500 mt-1">
                      Slug:{" "}
                      {college.slug}
                    </div>
                  )}

                  {college.id && (
                    <div className="text-xs text-gray-400 mt-1">
                      ID:{" "}
                      {college.id}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ======================================================
          UPDATED COLLEGES
      ====================================================== */}

      {updated.length > 0 && (
        <div className="mt-5 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h2 className="text-sm font-semibold text-blue-700 mb-3">
            🔄 Updated Colleges ({updated.length})
          </h2>

          <div className="space-y-2">
            {updated.map(
              (college, index) => (
                <div
                  key={
                    college.id ||
                    `${college.name}-${index}`
                  }
                  className="bg-white border border-blue-100 rounded p-3"
                >
                  <div className="font-medium text-gray-800">
                    {index + 1}.{" "}
                    {college.name}
                  </div>

                  {college.slug && (
                    <div className="text-xs text-gray-500 mt-1">
                      Slug:{" "}
                      {college.slug}
                    </div>
                  )}

                  {college.id && (
                    <div className="text-xs text-gray-400 mt-1">
                      ID:{" "}
                      {college.id}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ======================================================
          FAILED COLLEGES
      ====================================================== */}

      {failed.length > 0 && (
        <div className="mt-5 bg-red-50 border border-red-200 p-4 rounded-lg">
          <h2 className="text-sm font-semibold text-red-700 mb-3">
            ❌ Failed Imports ({failed.length})
          </h2>

          <div className="space-y-2">
            {failed.map(
              (item, index) => (
                <div
                  key={`${item.rowNumber || "row"}-${index}`}
                  className="bg-white border border-red-100 rounded p-3"
                >
                  <div className="font-medium text-gray-800">
                    {item.rowNumber
                      ? `Row ${item.rowNumber} - `
                      : ""}
                    {item.college}
                  </div>

                  <div className="text-sm text-red-500 mt-1">
                    {item.error}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportColleges;