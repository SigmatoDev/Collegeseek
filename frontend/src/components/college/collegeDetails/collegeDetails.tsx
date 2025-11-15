"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { api_url, img_url } from "@/utils/apiCall";
import Image from "next/image";
import Courses from "@/components/courses/coursesCard/courses";
import DOMPurify from "dompurify";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import Loader from "@/components/loader/loader";
import { useUserStore } from "@/Store/userStore"; // Zustand store
import { CheckCircleIcon } from "lucide-react";

interface Tab {
  title: string;
  description: string;
}

interface CollegeData {
  _id?: string;
  id: string;
  name: string;
  description: string;
  location: string;
  image: string;
  imageGallery: string[];
  tabs: Tab[];
  about: string;
  website: string;
  rank: number;
  fees: number;
  avgPackage: number;
  slug: string;
}

export default function CollegeDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [collegeData, setCollegeData] = useState<CollegeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<Tab | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasBrochure, setHasBrochure] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [alreadyShortlisted, setAlreadyShortlisted] = useState(false); // ✅ new state
  const fallbackImage = "/image/fallback-image.webp";
  const [mainImageSrc, setMainImageSrc] = useState<string>(fallbackImage);

  // Zustand store
  const { user, addToShortlist, isCollegeShortlisted } = useUserStore();

  useEffect(() => {
    setMounted(true); // ensure store hydration
  }, []);

  const isShortlisted = collegeData
    ? isCollegeShortlisted(collegeData._id || collegeData.id)
    : false;

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const response = await axios.get(`${api_url}/college/${slug}`);
        if (response.data?.success) {
          const data = response.data.data;
          setCollegeData(data);
          setSelectedTab(data.tabs?.[0]);

          // Check if brochure exists
          try {
            const brochureUrl = `${api_url}brochure/college/${
              data.id || data._id
            }`;
            const res = await fetch(brochureUrl, { method: "HEAD" });
            setHasBrochure(res.ok);
          } catch {
            setHasBrochure(false);
          }
        } else {
          setError("College not found.");
        }
      } catch (err) {
        setError("Failed to fetch college data.");
        console.error("🚨 Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCollege();
    }
  }, [slug]);

  // ✅ New Effect: Check if already shortlisted in backend
  useEffect(() => {
    const checkIfAlreadyShortlisted = async () => {
      if (!user?.token || (!collegeData?._id && !collegeData?.id)) return;

      try {
        const res = await fetch(
          `${api_url}get/user/shortlistedClg/by/${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok && Array.isArray(data.data)) {
          const found = data.data.some(
            (item: any) =>
              item.collegeId?._id === (collegeData._id || collegeData.id)
          );
          setAlreadyShortlisted(found);
        }
      } catch (err) {
        console.error("Error checking shortlisted colleges:", err);
      }
    };

    checkIfAlreadyShortlisted();
  }, [user, collegeData]);

  useEffect(() => {
    if (collegeData?.image) {
      const resolvedSrc = `${img_url}uploads/${collegeData.image.replace(
        /^\/?uploads\//,
        ""
      )}`;
      setMainImageSrc(resolvedSrc);
    } else {
      setMainImageSrc(fallbackImage);
    }
  }, [collegeData]);

  const handleDownload = async (collegeId: string) => {
    try {
      const url = `${api_url}brochure/college/${collegeId}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const fileURL = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = fileURL;
      a.download = "brochure.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      console.log("📄 Brochure downloaded successfully");
    } catch (error) {
      alert("Download failed, please try again.");
      console.error("🚨 Brochure download error:", error);
    }
  };

 const handleShortlist = async () => {
  if (!user?.token) {
    console.warn("❌ User not logged in — redirecting to login page.");

    // ✅ Store the selected college in sessionStorage before redirecting
    sessionStorage.setItem(
      "pendingShortlistCollege",
      JSON.stringify({
        id: collegeData?._id || collegeData?.id,
        name: collegeData?.name,
        location: collegeData?.location,
      })
    );

    // Redirect to login
    window.location.href = "/user/auth/logIn";
    return;
  }

  // ✅ Continue with your existing shortlist logic
  const userId = user.id || user._id;
  const collegeId = collegeData?._id || collegeData?.id;

  try {
    const res = await fetch(`${api_url}shortlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        collegeId,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }),
    });

    const data = await res.json();

    if (data.message === "User not found.") {
      alert("Your account was not found. Please sign up first.");
      window.location.href = "/signup";
      return;
    }

    if (res.ok) {
      alert("College successfully shortlisted!");
      addToShortlist({
        id: collegeData?._id || collegeData?.id || "",
        name: collegeData?.name || "",
        location: collegeData?.location || "",
      });
      setAlreadyShortlisted(true);
    } else {
      alert(data.message || "Failed to shortlist this college.");
    }
  } catch (err) {
    console.error("🚨 API Request Error:", err);
    alert("Something went wrong. Please try again.");
  }
};


  if (!mounted) return null;
  if (loading) return <Loader />;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!collegeData)
    return <div className="text-center py-10">No college data available.</div>;

  const imageGalleryUrls = (collegeData.imageGallery || [])
    .map((img) => `${img_url}uploads/${img.replace(/^\/?uploads\//, "")}`)
    .filter(Boolean);
  const galleryImages =
    imageGalleryUrls.length > 0 ? imageGalleryUrls : [fallbackImage];

  const handleMainImageError = () => {
    setMainImageSrc(fallbackImage);
  };

  const handleGalleryImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = event.currentTarget;
    target.src = fallbackImage;
  };

  return (
    <>
      <div className="bg-[#f6f4fb] border-b border-[#e5e2f5] pt-3 pb-3 px-4 sm:px-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Colleges", href: "/college" },
            { label: collegeData.name },
          ]}
        />
      </div>

      <div className="container-1 mx-auto p-6 py-[10px] px-4 sm:px-6 md:px-10 lg:px-[70px] w-full">
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          {/* Left */}
          <div className="lg:w-2/3 space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold">
              {collegeData.name}
            </h1>
            <p
              className="rich-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(collegeData.description || ""),
              }}
            />
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <span className="text-[#403A83] font-semibold">
                📍 {collegeData.location?.split(" ")[0]}
              </span>

              <div className="flex -space-x-3 overflow-x-auto scrollbar-hide p-1">
                {galleryImages.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    width={50}
                    height={50}
                    className="rounded-full border-2 border-gray-300 hover:border-blue-500 hover:scale-110 transition-all duration-300 shadow-md"
                    alt={`Gallery ${index + 1}`}
                    onError={handleGalleryImageError}
                  />
                ))}
              </div>

              {galleryImages.length > 1 && (
                <button
                  onClick={() => setIsGalleryOpen(true)}
                  className="text-[#403A83] underline font-semibold hover:text-blue-800"
                >
                  View Gallery
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {hasBrochure && (
                <button
                  onClick={() =>
                    handleDownload(collegeData.id || collegeData._id || "")
                  }
                  className="px-5 py-2 border border-[#D35B42] text-[#D35B42] rounded-lg font-medium hover:bg-[#D35B42] hover:text-white transition"
                >
                  Download Brochure
                </button>
              )}

              {/* ✅ Shortlist button */}
              <button
                onClick={handleShortlist}
                className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-medium transition ${
                  isShortlisted || alreadyShortlisted
                    ? "bg-green-700 text-white cursor-not-allowed"
                    : "bg-[#D35B42] text-white hover:bg-blue-800"
                }`}
                disabled={isShortlisted || alreadyShortlisted}
              >
                {isShortlisted || alreadyShortlisted ? (
                  <>
                    <CheckCircleIcon className="h-5 w-5 text-white" />
                    Shortlisted
                  </>
                ) : (
                  "Shortlist"
                )}
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="lg:w-1/3 w-full">
            <Image
              src={mainImageSrc}
              width={500}
              height={500}
              priority
              className="rounded-xl shadow-lg w-full object-cover"
              alt={collegeData.name}
              onError={handleMainImageError}
            />
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex space-x-6 border-b pb-2 mt-6 text-gray-600 overflow-x-auto scrollbar-hide px-2 sm:px-0">
          {collegeData.tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setSelectedTab(tab)}
              className={`font-bold px-2 py-1 border-b-2 focus:outline-none ${
                selectedTab?.title === tab.title
                  ? "border-[#403A83] text-[#403A83]"
                  : "border-transparent hover:text-blue-700"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </nav>

        {selectedTab && (
          <div className="mt-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {selectedTab.title}
            </h2>
            <div
              className="rich-content"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(selectedTab.description || ""),
              }}
            />
          </div>
        )}

        <Courses college_id={collegeData.id || collegeData._id || ""} />

        {/* About */}
        <div className="mt-6 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            About {collegeData.name}
          </h2>
          <div
            className="rich-content"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(collegeData.about),
            }}
          />
        </div>

        {/* Gallery Modal */}
        {isGalleryOpen && galleryImages.length > 1 && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-xl transition-opacity duration-300 ease-in-out">
            <div className="bg-[#E5E7EB] p-6 rounded-2xl shadow-2xl w-[90%] sm:max-w-lg relative overflow-hidden">
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-900/80 text-white rounded-full hover:bg-red-500 transition-all duration-300"
                aria-label="Close gallery"
              >
                ✖
              </button>
              <h2 className="text-2xl font-bold mb-5 text-center text-gray-900">
                Gallery
              </h2>

              <div className="relative">
                <div className="w-full overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                      transform: `translateX(-${currentImageIndex * 100}%)`,
                    }}
                  >
                    {galleryImages.map((img, index) => (
                      <div key={index} className="flex-shrink-0 w-full">
                        <Image
                          src={img}
                          width={600}
                          height={400}
                          className="rounded-xl object-cover shadow-lg"
                          alt={`Gallery ${index + 1}`}
                          onError={handleGalleryImageError}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) =>
                        (prev - 1 + galleryImages.length) %
                        galleryImages.length
                    )
                  }
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-gray-900/90 text-white rounded-full hover:scale-110 hover:bg-[#D35B42] transition-all duration-300"
                >
                  ❮
                </button>

                <button
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) => (prev + 1) % galleryImages.length
                    )
                  }
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-gray-900/90 text-white rounded-full hover:scale-110 hover:bg-[#D35B42] transition-all duration-300"
                >
                  ❯
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
