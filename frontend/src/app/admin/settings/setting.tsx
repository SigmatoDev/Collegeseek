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
  }>({
    siteName: "",
    siteLogo: "",
    favicon: "",
  });

  const [previews, setPreviews] = useState({
    siteLogo: "",
    favicon: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${api_url}settings`);
        setSettings({
          siteName: data.siteName || "",
          siteLogo: data.siteLogo ? `${img_url.replace(/\/$/, "")}${data.siteLogo}` : "",
          favicon: data.favicon ? `${img_url.replace(/\/$/, "")}${data.favicon}` : "",
        });
        
        setPreviews({
          siteLogo: data.siteLogo ? `${img_url.replace(/\/$/, "")}${data.siteLogo}` : "",
          favicon: data.favicon ? `${img_url.replace(/\/$/, "")}${data.favicon}` : "",
        });
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSettings();
  }, []);

  // Clean up object URLs on component unmount or preview change
  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [previews]);

  // Handle file change (upload)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const name = e.target.name as keyof typeof settings; // Ensuring valid key

    if (file) {
      setSettings((prev) => ({ ...prev, [name]: file }));
      const objectUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [name]: objectUrl }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("siteName", settings.siteName);
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

      // Update settings with the new URLs returned from the server
      setSettings({
        siteName: data.settings.siteName,
        siteLogo: data.settings.siteLogo,
        favicon: data.settings.favicon,
      });
      setPreviews({
        siteLogo: data.settings.siteLogo ? `${img_url.replace(/\/$/, "")}${data.settings.siteLogo}` : "",
        favicon: data.settings.favicon ? `${img_url.replace(/\/$/, "")}${data.settings.favicon}` : "",
      });

      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  // Remove image function
  const removeImage = (name: "siteLogo" | "favicon") => {
    setSettings((prev) => ({ ...prev, [name]: "" }));
    setPreviews((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl">
      <h3 className="text-lg font-medium mb-4">General Settings</h3>
      

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 bg-gray-100 rounded-lg">
          <div className="space-y-4">
            {/* Site Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Site Name</label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Site Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Site Logo</label>
              <div className="relative w-full">
                <input type="file" name="siteLogo" onChange={handleFileChange} className="hidden" id="siteLogo" />
                <label htmlFor="siteLogo" className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200">
                  <span>{typeof settings.siteLogo === "string" ? "Choose a file" : settings.siteLogo.name}</span>
                  <CloudUpload className="h-5 w-5 text-gray-500" />
                </label>
              </div>
              {previews.siteLogo && (
                <div className="mt-2 relative w-32">
                  <img src={previews.siteLogo} alt="Site Logo Preview" className="rounded-lg shadow-md" />
                  <button type="button" onClick={() => removeImage("siteLogo")} className="absolute top-0 right-0 bg-white p-1 rounded-full shadow-md hover:bg-gray-100">
                    <XCircle className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              )}
            </div>

            {/* Favicon */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Favicon</label>
              <div className="relative w-full">
                <input type="file" name="favicon" onChange={handleFileChange} className="hidden" id="favicon" />
                <label htmlFor="favicon" className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200">
                  <span>{typeof settings.favicon === "string" ? "Choose a file" : settings.favicon.name}</span>
                  <CloudUpload className="h-5 w-5 text-gray-500" />
                </label>
              </div>
              {previews.favicon && (
                <div className="mt-2 relative w-16">
                  <img src={previews.favicon} alt="Favicon Preview" className="rounded-lg shadow-md" />
                  <button type="button" onClick={() => removeImage("favicon")} className="absolute top-0 right-0 bg-white p-1 rounded-full shadow-md hover:bg-gray-100">
                    <XCircle className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition">
          <Save className="h-5 w-5" />
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
};

export default Settings;
