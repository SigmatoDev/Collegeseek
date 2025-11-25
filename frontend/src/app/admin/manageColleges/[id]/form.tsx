"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { api_url, img_url } from "@/utils/apiCall";
import { Loader, TrashIcon } from "lucide-react";
import { State, City } from "country-state-city";
import Select from "react-select";
import LocationAutocomplete from "@/components/location/page";
import { Editor } from "@tinymce/tinymce-react";
import ApprovalDropdown from "@/components/approvels/page";
import AffiliatedByDropdown from "@/components/affiliatedBy/page";
import ExamExpectedDropdown from "@/components/examExpected/page";
import OwnershipDropdown from "@/components/ownership/page";
import StreamDropdown from "@/components/streamsDropdown/page";
import { toast } from "react-hot-toast";

import FeaturedComponent from "@/components/feahered/page";
import ConfirmModal from "@/components/confirmModal/confirmModal";

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
    stream: [] as string[],
    approvel: [] as string[],
    affiliatedby: "",
    examExpected: [] as string[], // ✅ FIXED: explicitly typed as string[]
    ownership: "",
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
    contactNumbers: [{ type: "Mobile", number: "" }],
    contactEmail: "",
    featured: "", // Add the featured status
    image: null as File | null,
    imageGallery: [] as File[],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<any>({});

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);
  const [states, setStates] = useState<{ name: string; isoCode: string }[]>([]);
  const [cities, setCities] = useState<{ name: string }[]>([]);
  const [activeTab, setActiveTab] = useState<number | null>(null); // which tab is currently being edited
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  // State for dynamically fetched TinyMCE API key
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const [dynamicApiKey, setDynamicApiKey] = useState<string | null>(null);

  interface Course {
    _id: string;
    name: string;
  }

  /*** ✅ Fetch College Data ***/
  useEffect(() => {
    // console.log("🔍 Retrieved collegeId:", collegeId);
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

  // Fetch TinyMCE API key from backend
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axios.get(`${api_url}settings`);
        if (response.data?.tinymceApiKey) {
          setDynamicApiKey(response.data.tinymceApiKey);
        } else {
          // console.error("API key not found in settings response");
          setDynamicApiKey(""); // fallback empty string or handle differently
        }
      } catch (err) {
        // console.error("Failed to fetch TinyMCE API key", err);
        setDynamicApiKey("");
      }
    };

    fetchApiKey();
  }, []);

  useEffect(() => {
    const fetchCollegeData = async () => {
      if (!collegeId || collegeId === "new") return;

      try {
        // console.log(`📡 Fetching college data for collegeId: ${collegeId}`);
        const response = await axios.get(`${api_url}colleges/${collegeId}`);
        // console.log("✅ Fetched College Data:", response.data);

        const data = response.data.data;
        setCollegeData({
          name: data.name || "",
          description: data.description || "",
          state: data.state || "",
          city: data.city || "",
          stream: data.stream || [],
          approvel: data.approvel || [],
          affiliatedby: data.affiliatedby || "",
          examExpected: data.examExpected || [],
          ownership: data.ownership || "",
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
          contactNumbers: Array.isArray(data.contactNumbers)
            ? data.contactNumbers
            : data.contact
            ? [{ type: "Mobile", number: data.contact }] // ✅ fallback if old API returns single `contact`
            : [{ type: "Mobile", number: "" }],
          contactEmail: data.contactEmail || "",
          tabs: data.tabs || [],
          featured: data.featured || "", // Add the featured status
          image: null,
          imageGallery: [],
        });
        // console.log(
        //   "Featured prop passed to FeaturedComponent:",
        //   data.featured
        // );

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

  const handleeditorChange = (value: string) => {
    setCollegeData((prev) => ({
      ...prev,
      about: value,
    }));
  };

  /*** ✅ Handle Input Change ***/
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      // Validation: Name should not contain numbers
      if (name === "name" && /\d/.test(value)) {
        return;
      }

      // Validation: Contact should contain only numbers
      if (name === "contact" && /[^0-9]/.test(value)) {
        return;
      }

      setCollegeData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
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

    // ---------------------------------------
    // 🔥 FIELD-LEVEL VALIDATION (UPDATED)
    // ---------------------------------------
    const newErrors: any = {};

    // Required basic fields
    if (!collegeData.name?.trim()) newErrors.name = "Name is required";
    if (!collegeData.description?.trim())
      newErrors.description = "Description is required";
    if (!collegeData.state?.trim()) newErrors.state = "State is required";
    if (!collegeData.city?.trim()) newErrors.city = "City is required";
    if (!collegeData.affiliatedby?.trim())
      newErrors.affiliatedby = "Affiliated by is required";
    if (!collegeData.ownership?.trim())
      newErrors.ownership = "Ownership is required";

    // Multi-select required fields
    if (!collegeData.stream || collegeData.stream.length === 0)
      newErrors.stream = "Stream is required";

    if (!collegeData.examExpected || collegeData.examExpected.length === 0)
      newErrors.examExpected = "Exam Expected is required";

    if (!collegeData.approvel || collegeData.approvel.length === 0)
      newErrors.approvel = "Approval is required";

    // ---------------------------
    // 🔥 NEW FIELD VALIDATIONS
    // ---------------------------

    // Website
    if (!collegeData.website?.trim()) newErrors.website = "Website is required";

    // Contact Email
    if (!collegeData.contactEmail?.trim())
      newErrors.contactEmail = "Contact email is required";

    // Avg Package
    if (!collegeData.avgPackage?.trim())
      newErrors.avgPackage = "Average package is required";

    // Location
    if (!collegeData.location?.trim())
      newErrors.location = "Location is required";
    // Address  ✅ NEW REQUIRED FIELD
    if (!collegeData.address?.trim()) newErrors.address = "Address is required";

    // Rank
    if (!collegeData.rank?.toString().trim())
      newErrors.rank = "Rank is required";

    // Fees
    if (!collegeData.fees?.toString().trim())
      newErrors.fees = "Fees are required";

    if (!collegeData.about?.trim())
      newErrors.about = "About section is required";

    // Contact Numbers
    if (
      !collegeData.contactNumbers ||
      collegeData.contactNumbers.length === 0 ||
      !collegeData.contactNumbers[0].number?.trim()
    ) {
      newErrors.contactNumbers = "At least one contact number is required";
    }

    // If any errors → stop submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Clear errors if valid
    setErrors({});

    // ---------------------------------------
    // 📦 FORM DATA (AS IS)
    // ---------------------------------------
    const formData = new FormData();
    formData.append("name", collegeData.name);
    formData.append("description", collegeData.description);
    formData.append("state", collegeData.state);
    formData.append("city", collegeData.city);
    formData.append("affiliatedby", collegeData.affiliatedby);
    formData.append("ownership", collegeData.ownership);
    formData.append("stream", JSON.stringify(collegeData.stream));
    formData.append("examExpected", JSON.stringify(collegeData.examExpected));
    formData.append("approvel", JSON.stringify(collegeData.approvel));
    formData.append("featured", isFeatured.toString());

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

    if (collegeData.contactNumbers && collegeData.contactNumbers.length > 0) {
      formData.append(
        "contactNumbers",
        JSON.stringify(collegeData.contactNumbers)
      );
    }

    if (collegeData.contactEmail)
      formData.append("contactEmail", collegeData.contactEmail);

    if (typeof collegeData.featured === "boolean") {
      formData.append("featured", collegeData.featured ? "true" : "false");
    }

    if (collegeData.tabs && collegeData.tabs.length > 0) {
      formData.append("tabs", JSON.stringify(collegeData.tabs));
    }

    if (collegeData.image && collegeData.image instanceof File) {
      formData.append("image", collegeData.image);
    }

    if (collegeData.imageGallery && Array.isArray(collegeData.imageGallery)) {
      collegeData.imageGallery.forEach((file) => {
        if (file instanceof File) formData.append("imageGallery", file);
      });
    }

    // ---------------------------------------
    // 📡 API REQUEST (AS IS)
    // ---------------------------------------
    try {
      const url =
        collegeId && collegeId !== "new"
          ? `${api_url}colleges/${collegeId}`
          : `${api_url}colleges`;

      const method = collegeId && collegeId !== "new" ? axios.put : axios.post;

      const response = await method(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if ([200, 201].includes(response.status)) {
        toast.success("College details saved successfully!");
        router.push("/admin/manageColleges");
      }
    } catch (err: any) {
      console.error(
        "❌ Error saving college:",
        err.response?.data || err.message
      );

      const backendError = err.response?.data;

      if (backendError?.missingFields?.length > 0) {
        const missingList = backendError.missingFields.join(", ");
        toast.error(`Missing required fields: ${missingList}`);
        setError(`Missing required fields: ${missingList}`);
      } else if (backendError?.details) {
        toast.error(backendError.details);
        setError(backendError.details);
      } else if (backendError?.error) {
        toast.error(backendError.error);
        setError(backendError.error);
      } else if (backendError?.message) {
        toast.error(backendError.message);
        setError(backendError.message);
      } else {
        toast.error("Failed to save college. Please check your input.");
        setError("Failed to save college. Please check your input.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCollegeData({ ...collegeData, [e.target.name]: e.target.value });
  };

  // Handler to manage the selected values
  // Example handler for multiselect

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
    name: "College Name (e.g., IIT Delhi)",
    website: "Official Website (e.g., https://www.iitd.ac.in)",
    contactNumbers: "Contact Numbers (Mobile / Landline)",
    contactEmail: "Contact Email (e.g., info@iitd.ac.in)",
    avgPackage: "Average Package (LPA) (e.g., 15.5)",
    location: "Location (e.g., New Delhi, Delhi)",
  };

  const handleFeaturedToggle = (newState: boolean) => {
    setIsFeatured(newState); // Update the state to the new featured value
    console.log("Featured status:", newState); // You can handle the logic here (e.g., API calls)
  };

  // Show loader while TinyMCE API key is loading
  if (dynamicApiKey === null) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-[1580px] mx-auto p-[40px] border rounded-lg shadow">
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
              <div key={field} className="flex flex-col mb-4">
                <label className="text-gray-700 font-medium">
                  {label} <sup className="text-red-500">*</sup>
                </label>

                {/* ----------------------------------------------- */}
                {/* CONTACT NUMBERS FIELD  */}
                {/* ----------------------------------------------- */}
                {field === "contactNumbers" ? (
                  <>
                    {(collegeData.contactNumbers?.length
                      ? collegeData.contactNumbers
                      : [{ type: "Mobile", number: "" }]
                    ).map((contact, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        {/* TYPE SELECT */}
                        <select
                          value={contact.type}
                          onChange={(e) => {
                            const updated = [
                              ...(collegeData.contactNumbers || []),
                            ];
                            updated[index] = updated[index] || {
                              type: "Mobile",
                              number: "",
                            };
                            updated[index].type = e.target.value as
                              | "Mobile"
                              | "Landline";
                            setCollegeData((prev) => ({
                              ...prev,
                              contactNumbers: updated,
                            }));
                          }}
                          className="p-2 border rounded-lg min-w-[100px]"
                        >
                          <option value="Mobile">Mobile</option>
                          <option value="Landline">Landline</option>
                        </select>

                        {/* NUMBER INPUT */}
                        <input
                          type="text"
                          value={contact.number || ""}
                          onChange={(e) => {
                            let value = e.target.value;

                            // ✅ Allow only digits for Mobile
                            if (contact.type === "Mobile") {
                              value = value.replace(/\D/g, ""); // remove non-digits
                              if (value.length > 10) return; // limit to 10 digits
                            }

                            // (Landline can take any input)

                            const updated = [
                              ...(collegeData.contactNumbers || []),
                            ];
                            updated[index] = updated[index] || {
                              type: "Mobile",
                              number: "",
                            };
                            updated[index].number = value;

                            setCollegeData((prev) => ({
                              ...prev,
                              contactNumbers: updated,
                            }));
                          }}
                          placeholder={
                            contact.type === "Mobile"
                              ? "e.g., 9876543210"
                              : "e.g., 011-23456789"
                          }
                          className={`flex-1 p-3 border rounded-xl focus:ring-2 outline-none ${
                            errors.contactNumbers
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />

                        {/* DELETE + ADD */}
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => setModalIndex(index)}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>

                          {index ===
                            (collegeData.contactNumbers?.length || 0) - 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setCollegeData((prev) => ({
                                  ...prev,
                                  contactNumbers: [
                                    ...(prev.contactNumbers || []),
                                    { type: "Mobile", number: "" },
                                  ],
                                }))
                              }
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            >
                              +
                            </button>
                          )}
                        </div>

                        <ConfirmModal
                          isOpen={modalIndex === index}
                          onClose={() => setModalIndex(null)}
                          onConfirm={() => {
                            setCollegeData((prev) => ({
                              ...prev,
                              contactNumbers: (
                                prev.contactNumbers || []
                              ).filter((_, i) => i !== index),
                            }));
                            setModalIndex(null);
                          }}
                          message="Are you sure you want to remove this number?"
                        />
                      </div>
                    ))}

                    {errors.contactNumbers && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.contactNumbers}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    {/* ----------------------------------------------- */}
                    {/* NORMAL INPUT FIELDS  */}
                    {/* ----------------------------------------------- */}
                    <input
                      type={
                        field === "website"
                          ? "text" // ✅ FIXED (was: url)
                          : field === "contactEmail"
                          ? "email"
                          : "text"
                      }
                      inputMode={field === "website" ? "url" : undefined} // ✅ Added
                      name={field}
                      value={
                        typeof collegeData[
                          field as keyof typeof collegeData
                        ] === "string"
                          ? (collegeData[
                              field as keyof typeof collegeData
                            ] as string)
                          : ""
                      }
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-xl focus:ring-2 outline-none ${
                        errors[field] ? "border-red-500" : "border-gray-300"
                      }`}
                      maxLength={field === "name" ? 170 : undefined}
                    />

                    {errors[field] && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors[field]}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* State Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-800 font-medium">State</label>
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
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                )}
              </div>

              {/* City Dropdown */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-800 font-medium">City</label>
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
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-6 items-center">
            <div className="w-full max-w-[800px]">
              <label className="text-gray-800 font-medium">
                Select Streams
              </label>

              <StreamDropdown
                defaultSelected={collegeData?.stream ?? []}
                onSelectionChange={(selectedStreams) => {
                  const streamIds = selectedStreams.map((s) => s._id);
                  setCollegeData((prev) => ({
                    ...prev,
                    stream: streamIds,
                  }));
                }}
              />
              {errors.stream && (
                <p className="text-red-500 text-sm mt-1">{errors.stream}</p>
              )}
            </div>
            <div className="w-full max-w-[800px]">
              <label className="text-gray-800 font-medium">
                Select Approval
              </label>

              <ApprovalDropdown
                defaultSelected={collegeData?.approvel ?? []}
                onSelectionChange={(selectedApprovels) => {
                  const approvelNames = selectedApprovels.map(
                    (a: { _id: string }) => a._id
                  ); // Convert Approval[] to string[]
                  setCollegeData((prevData) => ({
                    ...prevData,
                    approvel: approvelNames,
                  }));
                }}
              />
              {errors.approvel && (
                <p className="text-red-500 text-sm mt-1">{errors.approvel}</p>
              )}
            </div>
          </div>

          <div>
            <label className="text-gray-800 font-medium">
              Select ExamExpected
            </label>

            <ExamExpectedDropdown
              defaultSelected={collegeData?.examExpected ?? []}
              onSelectionChange={(selectedExams) => {
                const examNames = selectedExams.map(
                  (e: { _id: string }) => e._id
                ); // Convert Exam[] to string[]
                setCollegeData((prevData) => ({
                  ...prevData,
                  examExpected: examNames,
                }));
              }}
            />
            {errors.examExpected && (
              <p className="text-red-500 text-sm mt-1">{errors.examExpected}</p>
            )}
          </div>
          <div className="flex space-x-6 items-center">
            <div className="w-full max-w-[800px]">
              <AffiliatedByDropdown
                code="affiliatedby"
                value={collegeData.affiliatedby}
                onChange={handleSelectChange}
                label="Affiliated By"
              />
              {errors.affiliatedby && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.affiliatedby}
                </p>
              )}
            </div>
            <div className="w-full max-w-[800px]">
              <OwnershipDropdown
                name="ownership"
                value={collegeData.ownership}
                onChange={handleSelectChange}
                label="Ownership"
              />
              {errors.ownership && (
                <p className="text-red-500 text-sm mt-1">{errors.ownership}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Address</label>
            <textarea
              name="address"
              value={collegeData.address}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 h-28 resize-none"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">
              Location{" "}
              <span className="text-gray-700 font-medium mb-2">
                (optional or Google Map Link)
              </span>
            </label>
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
              { key: "rank", label: "NIRF Rank (e.g., 5)" },
              {
                key: "fees",
                label: "Average Tuition Fees (₹) (e.g., 2,00,000)",
              },
            ].map(({ key, label }) => (
              <div key={key} className="flex flex-col">
                <label className="text-gray-700 font-medium">{label}</label>

                <input
                  type="number"
                  name={key}
                  value={collegeData[key as keyof typeof collegeData] as string}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* 🔥 ERROR Display */}
                {errors[key] && (
                  <p className="text-red-500 text-sm mt-1">{errors[key]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Tabs Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              College Features
            </h2>

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
                        {activeTab === index
                          ? "Close Description"
                          : "Edit Description"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalIndex(index)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                        aria-label="Remove Tab"
                      >
                        ✕
                      </button>
                      <ConfirmModal
                        isOpen={modalIndex === index}
                        onClose={() => setModalIndex(null)}
                        onConfirm={() => {
                          removeTab(index);
                          setModalIndex(null);
                        }}
                        message="Are you sure you want to remove this tab?"
                      />
                    </div>
                  </div>

                  {/* Show Editor only when this tab is active */}
                  {activeTab === index && (
                    <Editor
                      apiKey={dynamicApiKey}
                      value={tab.description} // Value from each tab
                      onEditorChange={(content) =>
                        handleTabChange(index, "description", content)
                      }
                      init={{
                        plugins:
                          "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                        toolbar:
                          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                      }}
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
          <label
            htmlFor="shortDescription"
            className="block mb-1 font-semibold"
          >
            Short Description
          </label>
          <Editor
            apiKey={dynamicApiKey}
            id="shortDescription"
            value={collegeData.description}
            onEditorChange={(content, editor) => {
              handleEditorChange(content); // content is the typed HTML
            }}
          />
           {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}

          {/* About Field */}
          <div className="flex flex-col space-y-1">
            <label className="text-gray-800 font-medium">About</label>
            <Editor
              apiKey={dynamicApiKey}
              value={collegeData.about}
              init={{
                plugins:
                  "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
              }}
              onEditorChange={handleeditorChange}
              textareaName="about"
            />
              {errors.about && (
              <p className="text-red-500 text-sm mt-1">{errors.about}</p>
            )}
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

          <FeaturedComponent
            initialFeatured={Boolean(collegeData.featured)} // <- force boolean
            onToggleFeatured={handleFeaturedToggle}
          />

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
