import { api_url } from "@/utils/apiCall";
import axios from "axios";
import { Loader } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CounsellingData {
  name: string;
  email: string;
  phone: string;
  college: string;
  message: string;
  createdAt: string;
}

const EditCounsellingForm = () => {
  const router = useRouter();
  const { id: counsellingId } = useParams();

  const [counsellingData, setCounsellingData] = useState<CounsellingData | null>(null); // Explicitly define the type
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCounsellingData = async () => {
      if (!counsellingId) return;

      try {
        const response = await axios.get(`${api_url}/counselling/${counsellingId}`);
        const data = response.data.data;  // Ensure you are accessing the correct part of the response

        setCounsellingData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          college: data.college || "",
          message: data.message || "",
          createdAt: data.createdAt ? new Date(data.createdAt).toISOString().split("T")[0] : "",
        });
      } catch (err: any) {
        setError("Failed to fetch counselling data. Please try again.");
      }
    };
    fetchCounsellingData();
  }, [counsellingId]);

  // Prevent rendering until data is fetched
  if (counsellingData === null) {
    return <div className="text-center">Loading...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (counsellingData) {
      setCounsellingData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleCancel = () => {
    router.push("/admin/leads/getFreeCounselling/");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!counsellingData.name || !counsellingData.email || !counsellingData.phone || !counsellingData.college) {
      setError("Name, email, phone, and college are required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(`${api_url}/counselling/${counsellingId}`, counsellingData);
      if ([200, 201].includes(response.status)) {
        alert("Counselling request updated successfully!");
        router.push("/admin/leads/getFreeCounselling/");
      }
    } catch (err) {
      setError("Failed to save counselling request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1580px] mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">Edit Counselling Request</h1>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={counsellingData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={counsellingData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={counsellingData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700">College</label>
            <input
              type="text"
              name="college"
              value={counsellingData.college}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        {/* Message Input */}
        <div>
          <label className="block text-gray-700">Message</label>
          <textarea
            name="message"
            value={counsellingData.message}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            rows={4}
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            {loading ? <Loader className="animate-spin h-5 w-5" /> : "Update Counselling Request"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white p-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCounsellingForm;
