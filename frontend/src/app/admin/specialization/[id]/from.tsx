"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { api_url } from "@/utils/apiCall";
import toast from "react-hot-toast";

const SpecializationForm = () => {
  const router = useRouter();
  const { id: specializationId } = useParams();

  const [specializationData, setSpecializationData] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchSpecializationData = async () => {
      if (!specializationId || specializationId === "new") {
        setIsFetching(false);
        return;
      }

      try {
        const url = `${api_url}id/Specialization/${specializationId}`;
        const response = await axios.get(url);
        const data = response.data;

        setSpecializationData({
          name: data.name || "",
        });
      } catch (err) {
        console.error("❌ Error fetching specialization data:", err);
        setError("Failed to fetch specialization data. Please try again.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchSpecializationData();
  }, [specializationId]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSpecializationData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  const handleCancel = () => {
    router.push("/admin/specialization");
  };
const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  if (!specializationData.name) {
    setError("Specialization name is required.");
    setLoading(false);
    return;
  }

  try {
    const url =
      specializationId && specializationId !== "new"
        ? `${api_url}update/Specialization/${specializationId}`
        : `${api_url}create/Specialization/`;

    const method =
      specializationId && specializationId !== "new" ? axios.put : axios.post;

    const response = await method(url, specializationData);

    if ([200, 201].includes(response.status)) {
      toast.success("Specialization saved successfully!");
      router.push("/admin/specialization");
    } else {
      setError("Failed to save specialization. Please try again.");
    }
  } catch (err: any) {
    console.error(err);

    // If backend sends a 409 Conflict error for duplicate name
    if (err.response && err.response.status === 409) {
      setError("A specialization with this name already exists.");
    } else {
      setError("Failed to save specialization. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-1xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">
        {specializationId && specializationId !== "new"
          ? "Edit Specialization"
          : "Create New Specialization"}
      </h1>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Specialization Name"
            value={specializationData.name}
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
            {loading ? (
              <Loader className="animate-spin h-5 w-5" />
            ) : specializationId && specializationId !== "new" ? (
              "Update Specialization"
            ) : (
              "Publish Specialization"
            )}
          </button>

          {specializationId && specializationId !== "new" && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white p-3 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SpecializationForm;
