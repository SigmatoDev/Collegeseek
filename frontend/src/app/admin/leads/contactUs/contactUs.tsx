"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/outline";
import { api_url } from "@/utils/apiCall";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
}

const AdminContactUs = () => {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data } = await axios.get(`${api_url}get/contacts`);

        if (!data || !Array.isArray(data.contacts)) {
          console.error("Unexpected API response format:", data);
          setError("Invalid data format received.");
          return;
        }

        setContacts(data.contacts);
      } catch (err: any) {
        console.error("API Fetch Error:", err);
        setError(err.response?.data?.message || "Failed to load contacts.");
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      fetchContacts();
    }
  }, []);

  const handleDelete = async (contactId: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      await axios.delete(`${api_url}d/contacts/${contactId}`);
      setContacts((prev) => prev.filter((contact) => contact._id !== contactId));
      toast.success("Message deleted successfully!");
    } catch (err) {
      console.error("Error deleting message:", err);
      toast.error("Error deleting message. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Contact Us Messages</h1>
      </header>

      {loading && <p className="text-center text-gray-500">Loading messages...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto shadow-md rounded bg-white">
          <table className="table-auto w-full text-left border-collapse">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                {["Name", "Email", "Phone", "Message", "Created At", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-sm font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <tr key={contact._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-700">{contact.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{contact.email}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{contact.phone}</td>
                    <td className="px-6 py-3 text-sm text-gray-700 max-w-xs truncate" title={contact.message}>
                      {contact.message}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDelete(contact._id)}
                        className="bg-red-500 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition"
                      >
                        <TrashIcon className="h-5 w-5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No contact messages found.
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

export default AdminContactUs;
