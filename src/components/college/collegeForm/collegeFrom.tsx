"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { api_url } from "@/utils/apiCall";

const CollegeForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const collegeId = searchParams.get("collegeId");

  const [collegeData, setCollegeData] = useState({
    name: "",
    description: "",
    state: "",
    city: "",
    address: "",
    location: "",
    rank: "",
    fees: "",
    avgPackage: "",
    established: "",
    tabs: [] as { title: string; description: string }[],
    about: "",
    website: "",
    contact: "",
    contactEmail: "",
    image: null as File | null,
    imageGallery: [] as File[],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);

  useEffect(() => {
    if (collegeId) fetchCollegeData(collegeId);
  }, [collegeId]);

  const fetchCollegeData = async (id: string) => {
    try {
      const { data } = await axios.get(`${api_url}colleges/${id}`);
      setCollegeData({ ...data, tabs: JSON.parse(data.tabs || "[]"), image: null, imageGallery: [] });

      if (data.image) setImagePreview(`${api_url}uploads/${data.image}`);
      if (data.imageGallery) {
        setGalleryPreview(data.imageGallery.map((img: string) => `${api_url}uploads/${img}`));
      }
    } catch (err) {
      console.error("Error fetching college data:", err);
      setError("Failed to fetch college data. Please try again.");
    }
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setCollegeData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCollegeData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const removeImagePreview = () => {
    setCollegeData((prev) => ({ ...prev, image: null }));
    setImagePreview(null); // ✅ No more TypeScript error
  };
 
  
  

// Function to handle gallery image removal
const handleGalleryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (files) {
    const fileArray = Array.from(files);

    // Filter out duplicate images
    setCollegeData((prev) => {
      const existingFiles = prev.imageGallery || [];
      
      const newFiles = fileArray.filter(
        (file) => !existingFiles.some((existingFile) => existingFile.name === file.name)
      );

      return { ...prev, imageGallery: [...existingFiles, ...newFiles] };
    });

    // Update galleryPreview separately
    const newPreviewImages = fileArray
      .filter((file) => !galleryPreview.includes(URL.createObjectURL(file))) // Prevent duplicate previews
      .map((file) => URL.createObjectURL(file));

    setGalleryPreview((prev) => [...prev, ...newPreviewImages]);
  }
}, [galleryPreview]);

const removeGalleryImage = (index: number) => {
  setCollegeData((prev) => ({
    ...prev,
    imageGallery: prev.imageGallery.filter((_, i) => i !== index),
  }));

  setGalleryPreview((prev) => prev.filter((_, i) => i !== index));
};
  

  const handleTabChange = (index: number, field: "title" | "description", value: string) => {
    setCollegeData((prev) => {
      const newTabs = [...prev.tabs];
      newTabs[index][field] = value;
      return { ...prev, tabs: newTabs };
    });
  };

  const addTab = () => {
    setCollegeData((prev) => ({
      ...prev,
      tabs: [...prev.tabs, { title: "", description: "" }],
    }));
  };

  const removeTab = (index: number) => {
    setCollegeData((prev) => ({
      ...prev,
      tabs: prev.tabs.filter((_, i) => i !== index),
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData();
    Object.entries(collegeData).forEach(([key, value]) => {
      if (key === "image" && value) {
        formData.append("image", value as File);
      } else if (key === "imageGallery") {
        collegeData.imageGallery.forEach((file) => {
          formData.append("imageGallery", file);
        });
      } else if (key === "tabs") {
        formData.append("tabs", JSON.stringify(value));
      } else if (value) {
        formData.append(key, value as string);
      }
    });

    try {
      const url = collegeId ? `${api_url}colleges/${collegeId}` : `${api_url}colleges`;
      const method = collegeId ? axios.put : axios.post;

      const response = await method(url, formData, { headers: { "Content-Type": "multipart/form-data" } });

      if ([200, 201].includes(response.status)) {
        alert("College details saved successfully!");
        router.push("/admin/manageColleges");
      }
    } catch (err: any) {
      console.error("API Request Error:", err);
      setError(err.response?.data?.message || "Failed to save college. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 
  
   

    return (
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-2xl border border-gray-200">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-900">
          {collegeId ? "Edit College" : "Add New College"}
        </h1>
  
        {/* Error Message */}
        {error && <p className="text-red-500 text-center mt-3">{error}</p>}
  
        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-6 mt-6">
          {/* Text Inputs */}
          <div className="grid grid-cols-2 gap-4">
            {["name", "state", "city", "address", "location", "website", "contact", "contactEmail", "avgPackage"].map(
              (field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-gray-700 font-medium">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === "website" ? "url" : field === "contactEmail" ? "email" : "text"}
                    name={field}
                    value={collegeData[field as keyof typeof collegeData] as string}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )
            )}
          </div>
  
          {/* Number Inputs */}
          <div className="grid grid-cols-2 gap-4">
            {["rank", "fees"].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-gray-700 font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type="number"
                  name={field}
                  value={collegeData[field as keyof typeof collegeData] as string}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            ))}
          </div>
  
          {/* Tabs Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">College Features</h2>
            <div className="space-y-3">
              {collegeData.tabs.map((tab, index) => (
                <div key={index} className="border p-4 rounded-xl flex items-center gap-3 bg-gray-50 shadow">
                  <input
                    type="text"
                    placeholder="Tab Title"
                    value={tab.title}
                    onChange={(e) => handleTabChange(index, "title", e.target.value)}
                    className="w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Short Description"
                    value={tab.description}
                    onChange={(e) => handleTabChange(index, "description", e.target.value)}
                    className="w-2/3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeTab(index)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                    aria-label="Remove Tab"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addTab}
              className="bg-blue-600 text-white p-3 rounded-xl w-full hover:bg-blue-700 transition"
            >
              + Add Tab
            </button>
          </div>
  
          {/* Text Areas */}
          <div className="grid grid-cols-2 gap-4">
            {["description", "about"].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-gray-700 font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <textarea
                  name={field}
                  value={collegeData[field as keyof typeof collegeData] as string}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 h-28 resize-none"
                />
              </div>
            ))}
          </div>
  
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">College Image</label>
            <input type="file" name="image" onChange={handleFileChange} className="w-full p-3 border border-gray-300 rounded-xl" />
            {imagePreview && (
  <div className="relative w-24 h-24">
    <img
      src={imagePreview}
      alt="Preview"
      className="w-full h-full object-cover rounded-xl border border-gray-300"
    />
    <button
      type="button"
      onClick={removeImagePreview}
      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-sm hover:bg-red-600"
      aria-label="Remove Image"
    >
      ✕
    </button>
  </div>
)}
          </div>
  {/* Gallery Upload */}
<div className="space-y-2">
  <label className="text-gray-700 font-medium">Image Gallery</label>
  <input
    type="file"
    multiple
    name="imageGallery"
    onChange={handleGalleryChange}
    className="w-full p-3 border border-gray-300 rounded-xl"
  />
  <div className="flex flex-wrap gap-2">
    {galleryPreview.map((img, index) => (
      <div key={index} className="relative w-24 h-24">
        <img
          src={img}
          alt={`Gallery Preview ${index}`}
          className="w-full h-full object-cover rounded-xl border border-gray-300"
        />
        <button
          type="button"
          onClick={() => removeGalleryImage(index)}
          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-sm hover:bg-red-600"
          aria-label="Remove Image"
        >
          ✕
        </button>
      </div>
    ))}
  </div>
</div>

  
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-xl transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : collegeId ? "Update College" : "Add College"}
          </button>
        </form>
      </div>
    );
  }
  

export default CollegeForm;