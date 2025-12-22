import { api_url } from "@/utils/apiCall";
import axios from "axios";
import { useEffect, useState } from "react";
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

export default function UploadForm() {
  const params = useParams();
  const fileId = params?.id;

  const [file, setFile] = useState<File | null>(null);
  const [collegeId, setCollegeId] = useState("");
  const [colleges, setColleges] = useState<College[]>([]);
  const [existingFile, setExistingFile] = useState<UploadFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingFile, setFetchingFile] = useState(true);

  const router = useRouter();

  // Fetch colleges on mount
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get(`${api_url}get/colleges`);
        setColleges(response.data.data || []);
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }
    };
    fetchColleges();
  }, []);

  // Fetch file details if fileId exists
  useEffect(() => {
    const fetchFileDetails = async () => {
      if (!fileId || fileId === "new") {
        setFetchingFile(false);
        return;
      }

      setFetchingFile(true);
      try {
        const baseUrl = api_url.endsWith("/") ? api_url : `${api_url}/`;
        const url = `${baseUrl}id/brochure/${fileId}`;
        console.log("fileId:", fileId);

        const response = await axios.get(url);
        const fileData = response.data?.data;
        if (fileData) {
          setExistingFile(fileData);
          const extractedCollegeId =
            typeof fileData.college_id === "object"
              ? fileData.college_id.$oid
              : fileData.college_id;
          setCollegeId(extractedCollegeId || "");
        }
      } catch (error) {
        console.error("Error fetching file details:", error);
      } finally {
        setFetchingFile(false);
      }
    };

    fetchFileDetails();
  }, [fileId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCollegeId(e.target.value);
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log("🟡 Submit started");
  console.log("File ID:", fileId);
  console.log("Selected file:", file);
  console.log("College ID:", collegeId);

  const formData = new FormData();
  if (file) {
    formData.append("file", file);
    console.log("📎 File appended:", file.name, file.size);
  }
  formData.append("college_id", collegeId);

  setLoading(true);

  try {
    let response;

    if (existingFile && fileId) {
      console.log("🟠 Updating file...");
      response = await axios.put(
        `${api_url}brochure-update/${fileId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } else {
      console.log("🟢 Creating new file...");
      response = await axios.post(
        `${api_url}brochure-post`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    }

    console.log("✅ Response:", response.data);
    alert(response.data.message);
    router.push("/admin/addBrochure");
  } catch (error: any) {
    console.error("❌ Upload failed");
    console.error("Status:", error?.response?.status);
    console.error("Data:", error?.response?.data);
    console.error(error);
    alert("File upload/update failed");
  } finally {
    setLoading(false);
  }
};


  const handleCancel = () => {
    // Clear form
    setFile(null);
    setCollegeId("");
    setExistingFile(null);

    // Navigate back
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
      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow space-y-4"
      >
        {existingFile && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">Current File:</p>

            {existingFile.fileName}
          </div>
        )}

        <label className="block">
          <span className="text-gray-700">
            Select File (optional for Only PDF, DOC, DOCX, and TXT are allowed.) 
          </span>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full"
          />
        </label>

        <label className="block">
          <select
            name="college_id"
            value={collegeId}
            onChange={handleCollegeChange}
            className="mt-1 p-2 border rounded w-full"
          >
            <option value="">Select College</option>
            {colleges.map((college) => (
              <option key={college._id} value={college._id}>
                {college.name}
              </option>
            ))}
          </select>
        </label>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="w-[150px] py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading
              ? existingFile
                ? "Updating..."
                : "Uploading..."
              : existingFile
              ? "Update"
              : "Upload"}
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
