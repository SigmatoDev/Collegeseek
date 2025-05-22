"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { api_url, img_url } from "@/utils/apiCall";
import Image from "next/image";
import Courses from "@/components/courses/coursesCard/courses";
import ShortlistForm from "@/components/shortlist/shortlistForm/page";
import Modal from "@/components/shortlist/model/page";
import DOMPurify from "dompurify";
import Breadcrumb from "@/components/breadcrumb/breadcrumb";
import Loader from "@/components/loader/loader";

interface Tab {
  title: string;
  description: string;
}

interface CollegeData {
  _id: string | undefined;
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
  const [isShortlistOpen, setIsShortlistOpen] = useState(false);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const response = await axios.get(`${api_url}/college/${slug}`);
        if (response.data?.success) {
          setCollegeData(response.data.data);
          setSelectedTab(response.data.data.tabs?.[0]);
        } else {
          setError("College not found.");
        }
      } catch (err) {
        setError("Failed to fetch college data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCollege();
    }
  }, [slug]);

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
    } catch (error) {
      alert("Download failed, please try again.");
      console.error("Error:", error);
    }
  };

  if (loading) return <Loader />; // 🆕 called Loader component when loading
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!collegeData)
    return <div className="text-center py-10">No college data available.</div>;

  const imageUrlFinal = collegeData.image
    ? `${img_url}uploads/${collegeData.image.replace(/^\/?uploads\//, "")}`
    : "/logo/logo1.png";

  const imageGalleryUrls = (collegeData.imageGallery || []).map(
    (img) => `${img_url}uploads/${img.replace(/^\/?uploads\//, "")}`
  );

  return (
    <>
      <div className="pt-6 pr-4 pl-4 sm:pr-10 sm:pl-10">
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
                {imageGalleryUrls.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    width={50}
                    height={50}
                    className="rounded-full border-2 border-gray-300 hover:border-blue-500 hover:scale-110 transition-all duration-300 shadow-md"
                    alt={`Gallery ${index + 1}`}
                  />
                ))}
              </div>

              {imageGalleryUrls.length > 1 && (
                <button
                  onClick={() => setIsGalleryOpen(true)}
                  className="text-[#403A83] underline font-semibold hover:text-blue-800"
                >
                  View Gallery
                </button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() =>
                  handleDownload(collegeData.id || (collegeData as any)._id)
                }
                className="px-5 py-2 border border-[#D35B42] text-[#D35B42] rounded-lg font-medium hover:bg-[#D35B42] hover:text-white transition"
              >
                Download Brochure
              </button>

              <button
                onClick={() => setIsShortlistOpen(true)}
                className="px-5 py-2 bg-[#D35B42] text-white rounded-lg font-medium hover:bg-blue-800 transition"
              >
                Shortlist
              </button>

              {collegeData && (
                <Modal
                  isOpen={isShortlistOpen}
                  onClose={() => setIsShortlistOpen(false)}
                >
                  <ShortlistForm
                    college={{
                      id: collegeData._id,
                      name: collegeData.name,
                      location: collegeData.location,
                    }}
                  />
                </Modal>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="lg:w-1/3 w-full">
            <Image
              src={imageUrlFinal}
              width={500}
              height={500}
              className="rounded-xl shadow-lg w-full object-cover"
              alt={collegeData.name}
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

        <Courses college_id={collegeData.id || (collegeData as any)._id} />

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
        {isGalleryOpen && imageGalleryUrls.length > 1 && (
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
                    {imageGalleryUrls.map((img, index) => (
                      <div key={index} className="flex-shrink-0 w-full">
                        <Image
                          src={img}
                          width={600}
                          height={400}
                          className="rounded-xl object-cover shadow-lg"
                          alt={`Gallery ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) =>
                        (prev - 1 + imageGalleryUrls.length) %
                        imageGalleryUrls.length
                    )
                  }
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-gray-900/90 text-white rounded-full hover:scale-110 hover:bg-[#D35B42] transition-all duration-300"
                >
                  ❮
                </button>

                <button
                  onClick={() =>
                    setCurrentImageIndex(
                      (prev) => (prev + 1) % imageGalleryUrls.length
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
