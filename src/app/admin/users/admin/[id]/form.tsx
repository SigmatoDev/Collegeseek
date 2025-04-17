"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { api_url } from "@/utils/apiCall";
import { PencilSquareIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

interface Admin {
  _id: string;
  name: string;
  email: string;
  isSuperAdmin: boolean;
}

export default function AdminEditForm() {
  const { id: adminId } = useParams();
  const router = useRouter();
  
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", isSuperAdmin: false });

  useEffect(() => {
    const fetchAdmin = async () => {
      if (!adminId) {
        setError("Admin ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          toast.error("Session expired. Please log in again.");
          router.replace("/admin/login");
          return;
        }

        const { data } = await axios.get(`${api_url}/admin/${adminId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!data.data) {
          setError("Admin not found.");
          return;
        }

        setAdmin(data.data);
        setFormData({
          name: data.data.name,
          email: data.data.email,
          isSuperAdmin: data.data.isSuperAdmin,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [adminId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please log in again.");
        router.replace("/admin/login");
        return;
      }

      await axios.put(`${api_url}/admin/${adminId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Admin updated successfully!");
      router.push("/admin/users/admin");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update admin.");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <div className="text-center text-red-500 bg-red-100 p-3 rounded">{error}</div>;

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg p-6 rounded-lg">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <PencilSquareIcon className="w-6 h-6 text-gray-700" />
        Edit Admin
      </h1>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 p-2 border w-full rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 p-2 border w-full rounded"
            required
          />
        </div>

      
        <div className="flex justify-between items-center mt-6">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            <PencilSquareIcon className="w-5 h-5" />
            Update
          </button>

          <button
            type="button"
            onClick={() => router.push("/admin/users/admin")}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
