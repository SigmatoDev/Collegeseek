"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Loader } from "lucide-react";
import { api_url } from "@/utils/apiCall";

const ProgramModeForm = () => {
  const router = useRouter();
  const { id: programModeId } = useParams();

  const [programModeData, setProgramModeData] = useState({
    name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchProgramModeData = async () => {
      if (!programModeId || programModeId === "new") {
        setIsFetching(false);
        return;
      }

      try {
        const url = `${api_url}id/program/${programModeId}`;
        const response = await axios.get(url);
        const data = response.data;

        setProgramModeData({
          name: data.name || "",
        });
      } catch (err) {
        console.error("❌ Error fetching program mode data:", err);
        setError("Failed to fetch program mode data. Please try again.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchProgramModeData();
  }, [programModeId]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProgramModeData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleCancel = () => {
    router.push("/admin/programMode");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!programModeData.name) {
      setError("Program mode name is required.");
      setLoading(false);
      return;
    }

    try {
      const url =
        programModeId && programModeId !== "new"
          ? `${api_url}update/program/${programModeId}`
          : `${api_url}/create/program/`;
      const method = programModeId && programModeId !== "new" ? axios.put : axios.post;

      const response = await method(url, programModeData);

      if ([200, 201].includes(response.status)) {
        alert("Program mode saved successfully!");
        router.push("/admin/programMode");
      } else {
        setError("Failed to save program mode. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save program mode. Please try again.");
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
        {programModeId && programModeId !== "new" ? "Edit Program Mode" : "Create New Program Mode"}
      </h1>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            name="name"
            placeholder="Program Mode Name"
            value={programModeData.name}
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
            ) : programModeId && programModeId !== "new" ? (
              "Update Program Mode"
            ) : (
              "Publish Program Mode"
            )}
          </button>
          {programModeId && programModeId !== "new" && (
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

export default ProgramModeForm;
