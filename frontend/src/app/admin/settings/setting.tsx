"use client"; // Ensures the component runs only on the client

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { CloudUpload, Save, XCircle } from "lucide-react";
import { api_url, img_url } from "@/utils/apiCall";
import { Toaster, toast } from "react-hot-toast";

const DEFAULT_CONTACT = {
  phone: "1800-572-9877",
  email: "hello@collegeseek.in",
  address: "123 College Road, Education City",
} as const;

const DEFAULT_SOCIAL_LINKS = {
  facebook: "#",
  instagram: "#",
  linkedin: "#",
  x: "#",
  youtube: "#",
} as const;

const SOCIAL_FIELDS: { key: keyof typeof DEFAULT_SOCIAL_LINKS; label: string }[] = [
  { key: "facebook", label: "Facebook URL" },
  { key: "instagram", label: "Instagram URL" },
  { key: "linkedin", label: "LinkedIn URL" },
  { key: "x", label: "X (Twitter) URL" },
  { key: "youtube", label: "YouTube URL" },
];

type SocialLinksState = Record<keyof typeof DEFAULT_SOCIAL_LINKS, string>;

const Settings = () => {
  const [settings, setSettings] = useState<{
    siteName: string;
    siteLogo: File | string;
    favicon: File | string;
    tinymceApiKey: string;
    contactPhone: string;
    contactEmail: string;
    contactAddress: string;
    socialLinks: SocialLinksState;
  }>({
    siteName: "",
    siteLogo: "",
    favicon: "",
    tinymceApiKey: "",
    contactPhone: DEFAULT_CONTACT.phone,
    contactEmail: DEFAULT_CONTACT.email,
    contactAddress: DEFAULT_CONTACT.address,
    socialLinks: { ...DEFAULT_SOCIAL_LINKS } as SocialLinksState,
  });

  const [previews, setPreviews] = useState({
    siteLogo: "",
    favicon: "",
  });

  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${api_url}settings`);
        const mergedSocial: SocialLinksState = {
          ...DEFAULT_SOCIAL_LINKS,
          ...(data.socialLinks || {}),
        };

        setSettings({
          siteName: data.siteName || "",
          siteLogo: data.siteLogo
            ? `${img_url.replace(/\/$/, "")}${data.siteLogo}`
            : "",
          favicon: data.favicon
            ? `${img_url.replace(/\/$/, "")}${data.favicon}`
            : "",
          tinymceApiKey: data.tinymceApiKey || "",
          contactPhone: data.contactPhone || DEFAULT_CONTACT.phone,
          contactEmail: data.contactEmail || DEFAULT_CONTACT.email,
          contactAddress: data.contactAddress || DEFAULT_CONTACT.address,
          socialLinks: mergedSocial,
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

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const phone = settings.contactPhone.trim();
    const email = settings.contactEmail.trim();
    const address = settings.contactAddress.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phone || !email || !address) {
      setFormError("Phone, email, and address are required fields.");
      return;
    }

    if (!emailPattern.test(email)) {
      setFormError("Please provide a valid email address.");
      return;
    }

    setFormError(null);

    const formData = new FormData();
    formData.append("siteName", settings.siteName);
    formData.append("tinymceApiKey", settings.tinymceApiKey);
    formData.append("contactPhone", settings.contactPhone);
    formData.append("contactEmail", settings.contactEmail);
    formData.append("contactAddress", settings.contactAddress);
    Object.entries(settings.socialLinks).forEach(([key, value]) => {
      formData.append(key, value || "");
    });

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
        siteLogo: data.settings.siteLogo
          ? `${img_url.replace(/\/$/, "")}${data.settings.siteLogo}`
          : "",
        favicon: data.settings.favicon
          ? `${img_url.replace(/\/$/, "")}${data.settings.favicon}`
          : "",
        tinymceApiKey: data.settings.tinymceApiKey,
        contactPhone: data.settings.contactPhone || DEFAULT_CONTACT.phone,
        contactEmail: data.settings.contactEmail || DEFAULT_CONTACT.email,
        contactAddress:
          data.settings.contactAddress || DEFAULT_CONTACT.address,
        socialLinks: {
          ...DEFAULT_SOCIAL_LINKS,
          ...(data.settings.socialLinks || {}),
        } as SocialLinksState,
      });

      setPreviews({
        siteLogo: data.settings.siteLogo
          ? `${img_url.replace(/\/$/, "")}${data.settings.siteLogo}`
          : "",
        favicon: data.settings.favicon
          ? `${img_url.replace(/\/$/, "")}${data.settings.favicon}`
          : "",
      });

      toast.success("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings. Please try again.");
    }
  };

  const removeImage = (name: "siteLogo" | "favicon") => {
    setSettings((prev) => ({ ...prev, [name]: "" }));
    setPreviews((prev) => ({ ...prev, [name]: "" }));
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-100 space-y-4 divide-y divide-gray-200">
          {/* Site Name */}
          <div className="space-y-1 pb-4">
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
              onChange={handleInputChange}
              placeholder="Enter your site name"
              className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 pb-4">
          <div className="space-y-1">
            <label
              htmlFor="contactPhone"
              className="text-sm font-semibold text-gray-700"
              >
                Primary Phone Number
              </label>
              <input
                type="text"
                id="contactPhone"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleInputChange}
                placeholder={DEFAULT_CONTACT.phone}
                className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="contactEmail"
                className="text-sm font-semibold text-gray-700"
              >
                Primary Email Address
              </label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleInputChange}
                placeholder={DEFAULT_CONTACT.email}
                className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Logo and Favicon */}
          <div className="pt-4 flex flex-col md:flex-row md:space-x-6 gap-4">
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
          <div className="space-y-1 pt-3 pb-3">
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
              onChange={handleInputChange}
              placeholder="Enter TinyMCE API Key"
              className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-3 pt-3">
            <h3 className="text-base font-semibold text-gray-700">
              Social Media Profiles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SOCIAL_FIELDS.map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <label
                    htmlFor={key}
                    className="text-xs uppercase tracking-wide text-gray-500"
                  >
                    {label}
                  </label>
                  <input
                    type="text"
                    id={key}
                    name={key}
                    value={settings.socialLinks[key]}
                    onChange={handleSocialChange}
                    placeholder="https://"
                    className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-1 md:col-span-2">
            <label
              htmlFor="contactAddress"
              className="text-sm font-semibold text-gray-700"
            >
              Headquarters Address
            </label>
            <textarea
              id="contactAddress"
              name="contactAddress"
              value={settings.contactAddress}
              onChange={handleInputChange}
              placeholder={DEFAULT_CONTACT.address}
              className="w-full px-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={3}
            />
          </div>
        </div>

        {formError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {formError}
          </div>
        )}

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
