"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { api_url } from "@/utils/apiCall";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid"; // Hero Icons

interface User {
  _id: string;
  name: string;
  email: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem("token");

        if (!token) {
          toast.error("Session expired. Redirecting to login...");
          router.replace("/admin/auth/login");
          return;
        }

        const { data } = await axios.get(`${api_url}/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!data.success || !Array.isArray(data.data)) {
          console.error("Unexpected API response:", data);
          setError("Invalid data format received.");
          return;
        }

        setUsers(data.data);
      } catch (err: any) {
        console.error("API Error:", err);
        setError(err.response?.data?.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      fetchUsers();
    }
  }, []);

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized access. Please log in.");
        return;
      }

      await axios.delete(`${api_url}/admin/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prev) => prev.filter((user) => user._id !== userId));
      toast.success("User deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Admins</h1>

      {loading && (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong> <span className="block sm:inline">{error}</span>
          <button
            onClick={() => setError(null)}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            ✖
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                {["Name", "Email", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-gray-600 font-semibold text-sm">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-700">{user.name}</td>
                    <td className="px-6 py-4 text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 flex space-x-3">
                      <button
                        onClick={() => router.push(`/admin/users/admin/${user._id}`)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                        <span>Edit</span>
                      </button>
                      {/* <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition"
                      >
                        <TrashIcon className="h-5 w-5" />
                        <span>Delete</span>
                      </button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
