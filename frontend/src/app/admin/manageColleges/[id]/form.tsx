"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { api_url, img_url } from "@/utils/apiCall";
import { Loader } from "lucide-react";
import { State, City } from "country-state-city";
import Select from "react-select";
import LocationAutocomplete from "@/components/location/page";
import Editor from "react-simple-wysiwyg";
import { Combobox } from "@headlessui/react";
import { X } from "lucide-react";
import MultiSelectDropdown from "@/components/multiSelectDropdown/page";

const CollegeForm = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <ActualCollegeForm />;
};

const ActualCollegeForm = () => {
  const router = useRouter();
  const { id: collegeId } = useParams();

  const [collegeData, setCollegeData] = useState({
    name: "",
    description: "",
    state: "",
    city: "",
    address: "",
    location: "",
    latitude: "",
    longitude: "",
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
  const [states, setStates] = useState<{ name: string; isoCode: string }[]>([]);
  const [cities, setCities] = useState<{ name: string }[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<number | null>(null); // which tab is currently being edited


  interface Course {
    _id: string;
    name: string;
  }

  const handleSelectionChange = (courses: Course[]) => {
    setSelectedCourses(courses);
    console.log("Selected Courses:", courses);
  };

  /*** ✅ Fetch College Data ***/
  useEffect(() => {
    console.log("🔍 Retrieved collegeId:", collegeId);
  }, [collegeId]);

  useEffect(() => {
    // Fetch states for India (Country Code: "IN")
    const indianStates = State.getStatesOfCountry("IN");
    setStates(indianStates);
  }, []);

  const handleLocationSelect = (lat: number, lng: number, place: string) => {
    setCollegeData((prev) => ({
      ...prev,
      location: place,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));
  };

  useEffect(() => {
    const fetchCollegeData = async () => {
      if (!collegeId || collegeId === "new") return;

      try {
        console.log(`📡 Fetching college data for collegeId: ${collegeId}`);
        const response = await axios.get(`${api_url}colleges/${collegeId}`);
        console.log("✅ Fetched College Data:", response.data);

        const data = response.data.data;
        setCollegeData({
          name: data.name || "",
          description: data.description || "",
          state: data.state || "",
          city: data.city || "",
          address: data.address || "",
          location: data.location || "",
          latitude: data.latitude || "",
          longitude: data.longitude || "",
          rank: data.rank ? String(data.rank) : "",
          fees: data.fees ? String(data.fees) : "",
          avgPackage: data.avgPackage ? String(data.avgPackage) : "",
          established: data.established ? String(data.established) : "",
          about: data.about || "",
          website: data.website || "",
          contact: data.contact || "",
          contactEmail: data.contactEmail || "",
          tabs: data.tabs || [],
          image: null,
          imageGallery: [],
        });
        // ✅ Update Image Previews
        setImagePreview(
          data.image
            ? `${img_url}uploads/${data.image.replace(/^\/?uploads\//, "")}`
            : null
        );

        setGalleryPreview(
          Array.isArray(data.imageGallery)
            ? data.imageGallery.map(
                (img: string) =>
                  `${img_url}uploads/${img.replace(/^\/?uploads\//, "")}`
              )
            : []
        );
      } catch (err: any) {
        console.error("❌ Fetch error:", err.response?.data || err.message);
        setError("Failed to fetch college data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeData();
  }, [collegeId]);

  const handleEditorChange = (value: string) => {
    setCollegeData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  /*** ✅ Handle Input Change ***/
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      console.log("📌 Changing Field:", name, "➡️ New Value:", value); // Debugging log

      setCollegeData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [] // ✅ No dependencies required, since it doesn’t rely on external variables
  );

  /*** ✅ Handle Image Upload ***/
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCollegeData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImagePreview = () => {
    setCollegeData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  /*** ✅ Handle Gallery Upload & Remove ***/
  const handleGalleryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        const fileArray = Array.from(files);

        setCollegeData((prev) => {
          const existingFiles = prev.imageGallery || [];
          const newFiles = fileArray.filter(
            (file) =>
              !existingFiles.some((existing) => existing.name === file.name)
          );

          return { ...prev, imageGallery: [...existingFiles, ...newFiles] };
        });

        const newPreviewImages = fileArray.map((file) =>
          URL.createObjectURL(file)
        );
        setGalleryPreview((prev) => [...prev, ...newPreviewImages]);
      }
    },
    []
  );

  const removeGalleryImage = (index: number) => {
    setCollegeData((prev) => ({
      ...prev,
      imageGallery: prev.imageGallery.filter((_, i) => i !== index),
    }));

    setGalleryPreview((prev) => prev.filter((_, i) => i !== index));
  };

  /*** ✅ Handle Tabs Management ***/
  const handleTabChange = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
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

  const handleCancel = () => {
    router.push("/admin/manageColleges");
  };

  /*** ✅ Handle Form Submission ***/
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", collegeData.name);
    formData.append("description", collegeData.description);
    formData.append("state", collegeData.state); // ✅ Correct key
    formData.append("city", collegeData.city);

    if (collegeData.address) formData.append("address", collegeData.address);
    if (collegeData.location) formData.append("location", collegeData.location);
    if (collegeData.rank) formData.append("rank", String(collegeData.rank));
    if (collegeData.fees) formData.append("fees", String(collegeData.fees));
    if (collegeData.avgPackage)
      formData.append("avgPackage", String(collegeData.avgPackage));
    if (collegeData.established)
      formData.append("established", String(collegeData.established));
    if (collegeData.about) formData.append("about", collegeData.about);
    if (collegeData.website) formData.append("website", collegeData.website);
    if (collegeData.contact) formData.append("contact", collegeData.contact);
    if (collegeData.contactEmail)
      formData.append("contactEmail", collegeData.contactEmail);

    // 🔹 Convert tabs to JSON string
    if (collegeData.tabs && collegeData.tabs.length > 0) {
      formData.append("tabs", JSON.stringify(collegeData.tabs));
    }

    // Ensure image is a File before appending
    if (collegeData.image && collegeData.image instanceof File) {
      formData.append("image", collegeData.image);
    }

    // Ensure each image in gallery is a File before appending
    if (collegeData.imageGallery && Array.isArray(collegeData.imageGallery)) {
      collegeData.imageGallery.forEach((file, index) => {
        if (file instanceof File) {
          formData.append(`imageGallery`, file);
        }
      });
    }

    for (const pair of formData.entries()) {
      console.log("🔹", pair[0], pair[1]);
    }

    try {
      // 🔹 Determine API URL & Method (POST for new, PUT for update)
      const url =
        collegeId && collegeId !== "new"
          ? `${api_url}colleges/${collegeId}`
          : `${api_url}colleges`;
      const method = collegeId && collegeId !== "new" ? axios.put : axios.post;

      const response = await method(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if ([200, 201].includes(response.status)) {
        alert("College details saved successfully!");
        router.push("/admin/manageColleges");
      }
    } catch (err: any) {
      console.error(
        "❌ Error saving college:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message ||
          "Failed to save college. Please check your input."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch cities when state changes
  useEffect(() => {
    if (collegeData.state) {
      const selectedState = states.find((s) => s.name === collegeData.state);
      if (selectedState) {
        const citiesList = City.getCitiesOfState("IN", selectedState.isoCode);
        setCities(citiesList);
      } else {
        setCities([]); // Reset cities if no state is selected
      }
    }
  }, [collegeData.state, states]);

  const fieldLabels: Record<string, string> = {
    name: "College Name",
    website: "Official Website",
    contact: "Primary Phone Number",
    contactEmail: "Contact Email",
    avgPackage: "Average Package (LPA)",
    location: "Location",
  };

  return (
    <div>

    <div className="mx-5 p-8 bg-white shadow-xl rounded-2xl border border-gray-200">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center text-gray-900">
        {collegeId && collegeId !== "new"
          ? "Edit College"
          : "Create New College"}
      </h1>

           {/* Error Message */}
      {error && <p className="text-red-500 text-center mt-3">{error}</p>}

      {/* Form */}
      <form onSubmit={handleFormSubmit} className="space-y-6 mt-6">
        {/* Text Inputs */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(fieldLabels).map(([field, label]) => (
            <div key={field} className="flex flex-col">
              <label className="text-gray-700 font-medium">
                {label} <sup className="text-red-500">*</sup>
              </label>
              <input
                type={
                  field === "website"
                    ? "url"
                    : field === "contactEmail"
                    ? "email"
                    : "text"
                }
                name={field}
                value={
                  typeof collegeData[field as keyof typeof collegeData] ===
                  "string"
                    ? (collegeData[field as keyof typeof collegeData] as string)
                    : ""
                }
                onChange={handleChange}
                required
                maxLength={field === "name" ? 170 : undefined} // Restrict "name" to 170 characters
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* State Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-800 font-semibold">State</label>
              <Select
                options={states.map((state) => ({
                  value: state.name,
                  label: state.name,
                }))}
                value={
                  states.find((s) => s.name === collegeData.state)
                    ? { value: collegeData.state, label: collegeData.state }
                    : null
                }
                onChange={(selected) =>
                  setCollegeData({
                    ...collegeData,
                    state: selected?.value || "",
                    city: "",
                  })
                }
                className="w-full"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderRadius: "0.75rem",
                    borderColor: "#d1d5db",
                    boxShadow: "none",
                    "&:hover": { borderColor: "#3b82f6" },
                  }),
                }}
              />
            </div>

            {/* City Dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-800 font-semibold">City</label>
              <Select
                options={cities.map((city) => ({
                  value: city.name,
                  label: city.name,
                }))}
                value={
                  cities.find((c) => c.name === collegeData.city)
                    ? { value: collegeData.city, label: collegeData.city }
                    : null
                }
                onChange={(selected) =>
                  setCollegeData({
                    ...collegeData,
                    city: selected?.value || "",
                  })
                }
                className="w-full"
                isDisabled={!collegeData.state} // Disable if no state selected
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderRadius: "0.75rem",
                    borderColor: state.isDisabled ? "#e5e7eb" : "#d1d5db",
                    backgroundColor: state.isDisabled ? "#f3f4f6" : "white",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: state.isDisabled ? "#e5e7eb" : "#3b82f6",
                    },
                  }),
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium">Address</label>
          <textarea
            name="address"
            value={collegeData.address}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 h-28 resize-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Location</label>
          <LocationAutocomplete onLocationSelect={handleLocationSelect} />
          {collegeData.latitude && collegeData.longitude && (
            <p className="text-sm text-gray-600 mt-2">
              Selected Coordinates: {collegeData.latitude},{" "}
              {collegeData.longitude}
            </p>
          )}
              
        </div>

        {/* Number Inputs */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: "rank", label: "NIRF" },
            { key: "fees", label: "Tuition Fees (₹)" },
          ].map(({ key, label }) => (
            <div key={key} className="flex flex-col">
              <label className="text-gray-700 font-medium">{label}</label>
              <input
                type="number"
                name={key}
                value={collegeData[key as keyof typeof collegeData] as string}
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
          <div
            key={index}
            className="border p-4 rounded-xl bg-gray-50 shadow space-y-3"
          >
            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                placeholder="Tab Title"
                value={tab.title}
                onChange={(e) =>
                  handleTabChange(index, "title", e.target.value)
                }
                className="w-2/3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2">
              <button
              type="button"
              onClick={() =>
                setActiveTab(activeTab === index ? null : index)
              }
              className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              {activeTab === index ? "Close Description" : "Edit Description"}
            </button>
                <button
                  type="button"
                  onClick={() => removeTab(index)}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                  aria-label="Remove Tab"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Show Editor only when this tab is active */}
            {activeTab === index && (
              <Editor
                value={tab.description}
                onChange={(e) =>
                  handleTabChange(index, "description", e.target.value)
                }
              />
            )}
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

        {/* Description Field */}
        <div className="flex flex-col space-y-1">
          <label className="text-gray-800 font-medium">Description</label>
          <Editor
            value={collegeData.description}
            onChange={(event) => handleEditorChange(event.target.value)}
          />
        </div>

        {/* About Field */}
        <div className="flex flex-col space-y-1">
          <label className="text-gray-800 font-medium">About</label>
          <textarea
            name="about"
            value={collegeData.about}
            onChange={handleChange}
            required
            placeholder="Enter about..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-28 bg-white"
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-gray-700 font-medium">College Image</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-xl"
          />
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

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          {loading ? (
            <Loader className="animate-spin h-5 w-5" />
          ) : collegeId && collegeId !== "new" ? (
            "Update College"
          ) : (
            "Publish College"
          )}
        </button>
        {collegeId && collegeId !== "new" && (
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition ml-2 shadow-md"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
    </div>
  );
};

export default CollegeForm;
