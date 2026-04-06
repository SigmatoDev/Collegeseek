import { api_url } from "@/utils/apiCall";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface College {
  _id: string;
  name: string;
}

interface UploadFile {
  _id: string;
  filePath: string;
  fileName: string;
  college_id: string | { $oid: string };
}

const PAGE_SIZE = 20;

export default function UploadForm() {
  const params = useParams();
  const fileId = params?.id;

  const [file, setFile] = useState<File | null>(null);
  const [collegeId, setCollegeId] = useState("");
  const [colleges, setColleges] = useState<College[]>([]);
  const [total, setTotal] = useState(0);
  const [existingFile, setExistingFile] = useState<UploadFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingFile, setFetchingFile] = useState(true);

  // Dropdown state
  const [ddOpen, setDdOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const ddRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) {
        setDdOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ Fetch colleges (SERVER SIDE)
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await axios.get(
          `${api_url}get/colleges?page=${page}&limit=${PAGE_SIZE}&search=${search}`
        );
        setColleges(res.data.data || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        console.error("❌ Fetch colleges error:", err);
      }
    };

    fetchColleges();
  }, [page, search]);


  // Fetch file details
  useEffect(() => {
    const fetchFile = async () => {
      if (!fileId || fileId === "new") {
        setFetchingFile(false);
        return;
      }

      try {
        const res = await axios.get(`${api_url}id/brochure/${fileId}`);
        const fileData = res.data?.data;

        if (fileData) {
          setExistingFile(fileData);

          const id =
            typeof fileData.college_id === "object"
              ? fileData.college_id.$oid
              : fileData.college_id;

          setCollegeId(id || "");
        }
      } catch (err) {
        console.error("❌ Fetch file error:", err);
      } finally {
        setFetchingFile(false);
      }
    };

    fetchFile();
  }, [fileId]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const selectedCollege = colleges.find((c) => c._id === collegeId);

  const handleSelect = (college: College) => {
    setCollegeId(college._id);
    setDdOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // reset page on search
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 Submit triggered");

    if (!collegeId) {
      alert("Please select a college");
      return;
    }

    if (!existingFile && !file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();

    // ✅ IMPORTANT FIX → order matters
    formData.append("college_id", collegeId);

    if (file) {
      formData.append("file", file);
    }

    // DEBUG
    for (let pair of formData.entries()) {
      console.log("📦", pair[0], pair[1]);
    }

    setLoading(true);

    try {
      let res;

      if (existingFile && fileId) {
        console.log("✏️ Updating...");
        res = await axios.put(
          `${api_url}brochure-update/${fileId}`,
          formData
        );
      } else {
        console.log("📤 Uploading...");
        res = await axios.post(
          `${api_url}brochure-post`,
          formData
        );
      }

      alert(res.data.message);
      router.push("/admin/addBrochure");
    } catch (err: any) {
      console.error("❌ Upload error:", err);

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Upload failed";

      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setCollegeId("");
    setExistingFile(null);
    router.push("/admin/addBrochure");
  };

  if (fetchingFile) {
    return (
      <div className="max-w-[1580px] mx-auto p-8">
        <p className="text-gray-600">Loading file details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1580px] mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow space-y-4">
        
        {existingFile && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">Current File:</p>
            <p className="font-medium">{existingFile.fileName}</p>
          </div>
        )}

        <label className="block">
          <span className="text-gray-700">
            Select File (optional — PDF, DOC, DOCX, TXT only)
          </span>
          <input type="file" onChange={handleFileChange} className="mt-1 block w-full" />
        </label>

        {/* Dropdown */}
        <div className="relative" ref={ddRef}>
          <button
            type="button"
            onClick={() => setDdOpen((o) => !o)}
            className="w-full mt-1 p-2 border rounded flex justify-between items-center bg-white text-left"
          >
            <span className={selectedCollege ? "text-gray-900" : "text-gray-400"}>
              {selectedCollege ? selectedCollege.name : "Select College"}
            </span>
            <span className="text-gray-400 text-xs">▼</span>
          </button>

          {ddOpen && (
            <div className="absolute z-10 w-full bg-white border rounded shadow-lg mt-1">
              
              {/* Search */}
              <div className="p-2 border-b">
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search colleges..."
                  className="w-full px-3 py-1.5 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              {/* List */}
              <ul className="max-h-48 overflow-y-auto">
                {colleges.length > 0 ? (
                  colleges.map((college) => (
                    <li
                      key={college._id}
                      onClick={() => handleSelect(college)}
                      className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                        college._id === collegeId ? "text-blue-600 font-medium" : ""
                      }`}
                    >
                      {college.name}
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2 text-sm text-gray-400">No colleges found</li>
                )}
              </ul>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-3 py-2 border-t text-xs text-gray-500">
                  <span>
                    Page {page} of {totalPages}
                  </span>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-2 py-1 border rounded disabled:opacity-40"
                    >
                      ←
                    </button>

                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-2 py-1 border rounded disabled:opacity-40"
                    >
                      →
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="w-[150px] py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading
              ? existingFile ? "Updating..." : "Uploading..."
              : existingFile ? "Update" : "Upload"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="w-[150px] py-2 px-4 bg-gray-400 text-white font-semibold rounded hover:bg-gray-500"
            disabled={loading}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}