"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { api_url } from "@/utils/apiCall";
import { Loader } from "lucide-react";

const EditContactForm = () => {
  const router = useRouter();
  const { id: contactId } = useParams();

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    createdAt: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const fetchContactData = async () => {
      if (!contactId) return;

      try {
        const response = await axios.get(`${api_url}/contacts/${contactId}`);
        const data = response.data.contact;

        const formattedDate = data.createdAt
          ? new Date(data.createdAt).toISOString().split("T")[0]
          : "";

        setContactData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          subject: data.subject || "",
          message: data.message || "",
          createdAt: formattedDate,
        });
      } catch (err) {
        setError("Failed to fetch contact data. Please try again.");
      }
    };

    fetchContactData();
  }, [contactId]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleCancel = () => {
    router.push("/admin/leads/contactUs");
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!contactData.name || !contactData.email || !contactData.phone || !contactData.subject) {
      setError("Name, email, phone, and subject are required.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Object.entries(contactData).forEach(([key, value]) => {
      if (value) formData.append(key, value as string | Blob);
    });

    try {
      const url = contactId ? `${api_url}contacts/${contactId}` : "";
      const response = await axios.put(url, formData, { headers: { "Content-Type": "multipart/form-data" } });
      if ([200, 201].includes(response.status)) {
        alert("Contact updated successfully!");
        router.push("/admin/leads/contactUs");
      }
    } catch (err) {
      setError("Failed to save contact. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isHydrated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <h1 className="text-3xl font-semibold text-center text-gray-900 mb-6">Edit Contact</h1>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={contactData.name}
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
              value={contactData.email}
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
              value={contactData.phone}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700">Subject</label>
            <input
              type="text"
              name="subject"
              value={contactData.subject}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700">Message</label>
          <textarea
            name="message"
            value={contactData.message}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            rows={4}
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
          >
            {loading ? <Loader className="animate-spin h-5 w-5" /> : "Update Contact"}
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

export default EditContactForm;
