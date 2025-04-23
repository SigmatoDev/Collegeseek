"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { api_url } from "@/utils/apiCall"; // Ensure api_url is correct
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      console.log("Fetching users...");
      // No token required for admin
      const config = {}; // No Authorization header needed for admin

      // Fetch users from the API
      const res = await axios.get(`${api_url}get/users`, config);
      console.log("Users fetched successfully:", res.data); // Log the response
      setUsers(res.data.data); // Set the users data into state
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to load users.");
    } finally {
      setLoading(false); // Set loading to false once data is fetched
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      // No token required for delete action (admin access)
      const config = {}; // No Authorization header needed for admin

      await axios.delete(`${api_url}users/${id}`, config); // Send delete request
      setUsers(users.filter((user) => user._id !== id)); // Update state after deleting
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user.");
    }
  };

  const handleExport = () => {
    const data = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    }));
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(jsonBlob);
    link.download = "users_data.json";
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Users</h1>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 font-medium text-gray-600">Name</th>
                <th className="px-6 py-3 font-medium text-gray-600">Email</th>
                <th className="px-6 py-3 font-medium text-gray-600">Phone</th>
                <th className="px-6 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length ? (
                users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.phone}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => router.push(`/admin/users/users/${user._id}`)}
                        className="bg-blue-500 text-white px-3 py-2 rounded flex items-center"
                      >
                        <PencilSquareIcon className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white px-3 py-2 rounded flex items-center"
                      >
                        <TrashIcon className="w-4 h-4" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center px-6 py-6 text-gray-500">
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

export default Users;
