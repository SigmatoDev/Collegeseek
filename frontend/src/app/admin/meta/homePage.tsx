"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { api_url } from "@/utils/apiCall";
import toast from "react-hot-toast";

export default function MetaEditor() {
  const [form, setForm] = useState({
    page: "home",
    title: "",
    description: "",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogUrl: "",
    ogSiteName: "",
    ogType: "website",
    xTitle: "",
    xDescription: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await axios.get(`${api_url}get/meta?page=home`);
        setForm((prev) => ({ ...prev, ...res.data }));
      } catch (error) {
        console.error("Failed to fetch meta:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeta();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSave = async () => {
    try {
      await axios.post(`${api_url}update/meta`, form);
      toast.success("Meta updated successfully"); // ✅ toast instead of alert
    } catch (err) {
      console.error("Failed to save", err);
      toast.error("Error updating meta"); // ✅ toast error
    }
  };

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-[1600px] mx-auto mt-10 bg-white border border-gray-200 shadow-lg rounded-xl p-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Meta Editor - Home Page</h2>

      {/* General Meta */}
      <InputField name="title" label="Meta Title" value={form.title} onChange={handleChange} />
      <TextAreaField name="description" label="Meta Description" value={form.description} onChange={handleChange} />
      <InputField name="keywords" label="Meta Keywords (comma separated)" value={form.keywords} onChange={handleChange} />

      {/* Open Graph */}
      <h3 className="text-xl font-semibold mt-6 text-gray-700">Open Graph (OG)</h3>
      <InputField name="ogTitle" label="OG Title" value={form.ogTitle} onChange={handleChange} />
      <TextAreaField name="ogDescription" label="OG Description" value={form.ogDescription} onChange={handleChange} />
      <InputField name="ogUrl" label="OG URL" value={form.ogUrl} onChange={handleChange} />
      <InputField name="ogSiteName" label="OG Site Name" value={form.ogSiteName} onChange={handleChange} />
      <InputField name="ogType" label="OG Type" value={form.ogType} onChange={handleChange} />

      {/* X (Twitter) */}
      <h3 className="text-xl font-semibold mt-6 text-gray-700">X (formerly Twitter)</h3>
      <InputField name="xTitle" label="X Title" value={form.xTitle} onChange={handleChange} />
      <TextAreaField name="xDescription" label="X Description" value={form.xDescription} onChange={handleChange} />

      {/* Save */}
      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow transition-all duration-200"
        >
          Save Meta
        </button>
      </div>
    </div>
  );
}

function InputField({ name, label, value, onChange }: any) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function TextAreaField({ name, label, value, onChange }: any) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
