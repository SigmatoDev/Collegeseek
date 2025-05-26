"use client"; // Ensures the component runs only on the client

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { CloudUpload, Save, XCircle } from "lucide-react";
import { api_url, img_url } from "@/utils/apiCall";

const Settings = () => {
  const [settings, setSettings] = useState<{
    siteName: string;
    siteLogo: File | string;
    favicon: File | string;
    tinymceApiKey: string;
  }>({
    siteName: "",
    siteLogo: "",
    favicon: "",
    tinymceApiKey: "",
  });

  const [previews, setPreviews] = useState({
    siteLogo: "",
    favicon: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${api_url}settings`);
        setSettings({
          siteName: data.siteName || "",
          siteLogo: data.siteLogo
            ? `${img_url.replace(/\/$/, "")}${data.siteLogo}`
            : "",
          favicon: data.favicon
            ? `${img_url.replace(/\/$/, "")}${data.favicon}`
            : "",
          tinymceApiKey: data.tinymceApiKey || "",
        });

        setPreviews({
          siteLogo: data.siteLogo
            ? `${img_url.replace(/\/$/, "")}${data.siteLogo}`
            : "",
          favicon: data.favicon
            ? `${img_url.replace(/\/$/, "")}${data.favicon}`
            : "",
        });
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const name = e.target.name as keyof typeof settings;

    if (file) {
      setSettings((prev) => ({ ...prev, [name]: file }));
      const objectUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [name]: objectUrl }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("siteName", settings.siteName);
    formData.append("tinymceApiKey", settings.tinymceApiKey);

    if (settings.siteLogo && typeof settings.siteLogo !== "string") {
      formData.append("siteLogo", settings.siteLogo);
    }
    if (settings.favicon && typeof settings.favicon !== "string") {
      formData.append("favicon", settings.favicon);
    }

    try {
      const { data } = await axios.put(`${api_url}settings`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSettings({
        siteName: data.settings.siteName,
        siteLogo: data.settings.siteLogo,
        favicon: data.settings.favicon,
        tinymceApiKey: data.settings.tinymceApiKey,
      });

      setPreviews({
        siteLogo: data.settings.siteLogo
          ? `${img_url.replace(/\/$/, "")}${data.settings.siteLogo}`
          : "",
        favicon: data.settings.favicon
          ? `${img_url.replace(/\/$/, "")}${data.settings.favicon}`
          : "",
      });

      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const removeImage = (name: "siteLogo" | "favicon") => {
    setSettings((prev) => ({ ...prev, [name]: "" }));
    setPreviews((prev) => ({ ...prev, [name]: "" }));
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 bg-white rounded-2xl border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        General Settings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 space-y-6 divide-y divide-gray-200">
          {/* Site Name */}
          <div className="space-y-2 pb-6">
            <label
              htmlFor="siteName"
              className="text-sm font-semibold text-gray-700"
            >
              Site Name
            </label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={settings.siteName}
              onChange={(e) =>
                setSettings({ ...settings, siteName: e.target.value })
              }
              placeholder="Enter your site name"
              className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Logo and Favicon */}
          <div className="pt-6 flex flex-col md:flex-row md:space-x-6 gap-6">
            {/* Site Logo */}
            <div className="flex-1 space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Site Logo
              </label>
              <div className="relative w-full">
                <input
                  type="file"
                  id="siteLogo"
                  name="siteLogo"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="siteLogo"
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer bg-white hover:bg-gray-100"
                >
                  <span className="text-sm text-gray-600">
                    {typeof settings.siteLogo === "string"
                      ? "Choose a file"
                      : settings.siteLogo.name}
                  </span>
                  <CloudUpload className="w-5 h-5 text-gray-500" />
                </label>
              </div>
              {previews.siteLogo && (
                <div className="mt-6 flex justify-start">
                  <div className="relative w-60 group mt-4">
                    <img
                      src={previews.siteLogo}
                      alt="Site Logo"
                      className="rounded-2xl shadow-xl object-contain w-full h-auto transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => removeImage("siteLogo")}
                      className="absolute -top-3 -right-3 bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition-colors duration-200"
                      aria-label="Remove Logo"
                    >
                      <XCircle className="w-6 h-6 text-red-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Favicon */}
            <div className="flex-1 space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Favicon
              </label>
              <div className="relative w-full">
                <input
                  type="file"
                  id="favicon"
                  name="favicon"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="favicon"
                  className="flex items-center justify-between p-3 border rounded-lg cursor-pointer bg-white hover:bg-gray-100"
                >
                  <span className="text-sm text-gray-600">
                    {typeof settings.favicon === "string"
                      ? "Choose a file"
                      : settings.favicon.name}
                  </span>
                  <CloudUpload className="w-5 h-5 text-gray-500" />
                </label>
              </div>
              {previews.favicon && (
                <div className="mt-2 relative w-16">
                  <img
                    src={previews.favicon}
                    alt="Favicon"
                    className="rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage("favicon")}
                    className="absolute top-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100"
                  >
                    <XCircle className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* TinyMCE API Key */}
          <div className="space-y-2 pt-6 pb-6">
            <label
              htmlFor="tinymceApiKey"
              className="text-sm font-semibold text-gray-700"
            >
              TinyMCE API Key (Editor)
            </label>
            <input
              type="text"
              id="tinymceApiKey"
              name="tinymceApiKey"
              value={settings.tinymceApiKey}
              onChange={(e) =>
                setSettings({ ...settings, tinymceApiKey: e.target.value })
              }
              placeholder="Enter TinyMCE API Key"
              className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-[200px] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition focus:ring-2 focus:ring-blue-400"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
