import { api_url } from "@/utils/apiCall";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";  // Import useRouter

interface College {
  _id: string;
  name: string;
}

interface UploadFile {
  _id: string;
  filePath: string;
  fileName: string;
  college_id: string;
}

export default function UploadForm({ fileId }: { fileId?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [collegeId, setCollegeId] = useState("");
  const [colleges, setColleges] = useState<College[]>([]);
  const [existingFile, setExistingFile] = useState<UploadFile | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter(); // Initialize useRouter

  // Fetching colleges
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get(`${api_url}f/college`);
        setColleges(response.data.data || []);
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }
    };
    fetchColleges();
  }, []);

  // Fetching file details if editing an existing file
  useEffect(() => {
    if (fileId) {
      const fetchFileDetails = async () => {
        try {
          const response = await axios.get(`${api_url}brochure/${fileId}`);
          const fileData = response.data.data;
          setExistingFile(fileData);
          setCollegeId(fileData.college_id);
        } catch (error) {
          console.error("Error fetching file details:", error);
        }
      };
      fetchFileDetails();
    }
  }, [fileId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCollegeId(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!collegeId) {
      alert("Please select a college.");
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("college_id", collegeId);

    setLoading(true);

    try {
      let response;
      if (existingFile) {
        // Update existing file
        response = await axios.put(`${api_url}brochure/${fileId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Upload new file
        response = await axios.post(`${api_url}brochure`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert(response.data.message);
      setFile(null);
      setCollegeId("");
      setExistingFile(null);

      // Redirect to /admin/addBrochure
      router.push("/admin/addBrochure"); // Redirection after successful submission
    } catch (error) {
      console.error("Upload failed:", error);
      alert("File upload/update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="max-w-[1580px] mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">

    <form onSubmit={handleSubmit} className="p-4 border rounded shadow">
      {existingFile && (
        <div className="mb-4">
          <p>
            Current File:{" "}
            <a
              href={`${api_url}${existingFile.filePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              {existingFile.fileName}
            </a>
          </p>
        </div>
      )}

      <label className="block mb-2">
        Select File (optional for update):
        <input type="file" onChange={handleFileChange} className="ml-2" />
      </label>

      <label className="block mb-2">
        Select College:
        <select
          name="college_id"
          value={collegeId}
          onChange={handleCollegeChange}
          className="p-2 border rounded"
        >
          <option value="">Select College</option>
          {colleges.map((college) => (
            <option key={college._id} value={college._id}>
              {college.name}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="p-2 bg-blue-500 text-white rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? (existingFile ? "Updating..." : "Uploading...") : existingFile ? "Update" : "Upload"}
      </button>
    </form>
    </div>
  );
}
