// "use client";

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "next/navigation";
// import { api_url, img_url } from "@/utils/apiCall";
// import Image from "next/image";
// import Courses from "@/components/courses/coursesCard/courses";
// import DOMPurify from "dompurify";
// import Breadcrumb from "@/components/breadcrumb/breadcrumb";
// import Loader from "@/components/loader/loader";
// import { useUserStore } from "@/Store/userStore"; // Zustand store
// import { CheckCircleIcon } from "lucide-react";

// interface Tab {
//   title: string;
//   description: string;
// }

// interface CollegeData {
//   _id?: string;
//   id: string;
//   name: string;
//   description: string;
//   location: string;
//   image: string;
//   imageGallery: string[];
//   tabs: Tab[];
//   about: string;
//   website: string;
//   rank: number;
//   fees: number;
//   avgPackage: number;
//   slug: string;
// }

// export default function CollegeDetailsPage() {
//   const params = useParams();
//   const slug = params?.slug as string;

//   const [collegeData, setCollegeData] = useState<CollegeData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedTab, setSelectedTab] = useState<Tab | null>(null);
//   const [isGalleryOpen, setIsGalleryOpen] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [hasBrochure, setHasBrochure] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [alreadyShortlisted, setAlreadyShortlisted] = useState(false); // ✅ new state
//   const fallbackImage = "/image/fallback-image.webp";
//   const [mainImageSrc, setMainImageSrc] = useState<string>(fallbackImage);

//   // Zustand store
//   const { user, addToShortlist, isCollegeShortlisted } = useUserStore();

//   useEffect(() => {
//     setMounted(true); // ensure store hydration
//   }, []);

//   const isShortlisted = collegeData
//     ? isCollegeShortlisted(collegeData._id || collegeData.id)
//     : false;

//   useEffect(() => {
//     const fetchCollege = async () => {
//       try {
//         const response = await axios.get(`${api_url}/college/${slug}`);
//         if (response.data?.success) {
//           const data = response.data.data;
//           setCollegeData(data);
//           setSelectedTab(data.tabs?.[0]);

//           // Check if brochure exists
//           try {
//             const brochureUrl = `${api_url}brochure/college/${
//               data.id || data._id
//             }`;
//             const res = await fetch(brochureUrl, { method: "HEAD" });
//             setHasBrochure(res.ok);
//           } catch {
//             setHasBrochure(false);
//           }
//         } else {
//           setError("College not found.");
//         }
//       } catch (err) {
//         setError("Failed to fetch college data.");
//         console.error("🚨 Fetch Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (slug) {
//       fetchCollege();
//     }
//   }, [slug]);

//   // ✅ New Effect: Check if already shortlisted in backend
//   useEffect(() => {
//     const checkIfAlreadyShortlisted = async () => {
//       if (!user?.token || (!collegeData?._id && !collegeData?.id)) return;

//       try {
//         const res = await fetch(
//           `${api_url}get/user/shortlistedClg/by/${user.id}`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${user.token}`,
//             },
//           }
//         );

//         const data = await res.json();

//         if (res.ok && Array.isArray(data.data)) {
//           const found = data.data.some(
//             (item: any) =>
//               item.collegeId?._id === (collegeData._id || collegeData.id)
//           );
//           setAlreadyShortlisted(found);
//         }
//       } catch (err) {
//         console.error("Error checking shortlisted colleges:", err);
//       }
//     };

//     checkIfAlreadyShortlisted();
//   }, [user, collegeData]);

//   useEffect(() => {
//     if (collegeData?.image) {
//       const resolvedSrc = `${img_url}uploads/${collegeData.image.replace(
//         /^\/?uploads\//,
//         ""
//       )}`;
//       setMainImageSrc(resolvedSrc);
//     } else {
//       setMainImageSrc(fallbackImage);
//     }
//   }, [collegeData]);

//   const handleDownload = async (collegeId: string) => {
//     console.log("⬇️ Download started for collegeId:", collegeId);

//     try {
//       const url = `${api_url}brochure/college/${collegeId}`;
//       console.log("🌐 Fetching brochure from URL:", url);

//       const res = await fetch(url);
//       console.log("📡 Fetch response:", res);

//       if (!res.ok) {
//         console.error("❌ Fetch failed with status:", res.status);
//         throw new Error("Download failed");
//       }

//       const blob = await res.blob();
//       console.log("📦 Blob received:", blob);

//       const fileURL = window.URL.createObjectURL(blob);
//       console.log("🔗 Blob URL created:", fileURL);

//       const a = document.createElement("a");
//       a.href = fileURL;
//       a.download = "brochure.pdf";
//       document.body.appendChild(a);

//       console.log("🖱️ Triggering download...");
//       a.click();

//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(fileURL);

//       console.log("✅ Brochure downloaded successfully");
//     } catch (error) {
//       console.error("🚨 Brochure download error:", error);
//       alert("Download failed, please try again.");
//     }
//   };

//   const handleShortlist = async () => {
//     console.log("🔍 Checking login:", user?.token);

//     // If user not logged in → save redirect + pending shortlist
//     if (!user?.token) {
//       console.warn("❌ User not logged in — redirecting to login page.");

//       // Save ONLY the path, not full domain (works on local + production)
//       const currentPath = window.location.pathname + window.location.search;

//       const existingRedirect = sessionStorage.getItem("redirectAfterLogin");

//       if (
//         !existingRedirect ||
//         existingRedirect === "null" ||
//         existingRedirect === ""
//       ) {
//         console.log("📌 Saving redirectAfterLogin:", currentPath);
//         sessionStorage.setItem("redirectAfterLogin", currentPath);
//       } else {
//         console.log("⚠️ Redirect already exists →", existingRedirect);
//       }

//       // Save pending college info
//       const pendingCollege = {
//         id: collegeData?._id || collegeData?.id,
//         name: collegeData?.name,
//         location: collegeData?.location,
//       };

//       console.log("📦 Saving pendingShortlistCollege:", pendingCollege);
//       sessionStorage.setItem(
//         "pendingShortlistCollege",
//         JSON.stringify(pendingCollege)
//       );

//       // Redirect to login (auto-adjusts domain)
//       window.location.href = "/user/auth/logIn";
//       return;
//     }

//     // User logged in → process shortlist
//     console.log("👤 User logged in — processing shortlist…");

//     const userId = user.id || user._id;
//     const collegeId = collegeData?._id || collegeData?.id;

//     try {
//       const res = await fetch(`${api_url}shortlist`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token}`,
//         },
//         body: JSON.stringify({
//           collegeId,
//           name: user.name || "",
//           email: user.email || "",
//           phone: user.phone || "",
//         }),
//       });

//       const data = await res.json();
//       console.log("📨 API Response:", data);

//       if (data.message === "User not found.") {
//         alert("Your account was not found. Please sign up first.");
//         window.location.href = "/signup";
//         return;
//       }

//       if (res.ok) {
//         console.log("✅ College shortlisted successfully!");

//         // Update locally
//         addToShortlist({
//           id: collegeData?._id || collegeData?.id || "",
//           name: collegeData?.name || "",
//           location: collegeData?.location || "",
//         });

//         setAlreadyShortlisted(true);
//       } else {
//         console.error("❌ Shortlist error:", data.message);
//         alert(data.message || "Failed to shortlist this college.");
//       }
//     } catch (err) {
//       console.error("🚨 API Request Error:", err);
//       alert("Something went wrong. Please try again.");
//     }
//   };

//   if (!mounted) return null;
//   if (loading) return <Loader />;
//   if (error)
//     return <div className="text-center py-10 text-red-500">{error}</div>;
//   if (!collegeData)
//     return <div className="text-center py-10">No college data available.</div>;

//   const imageGalleryUrls = (collegeData.imageGallery || [])
//     .map((img) => `${img_url}uploads/${img.replace(/^\/?uploads\//, "")}`)
//     .filter(Boolean);
//   const galleryImages =
//     imageGalleryUrls.length > 0 ? imageGalleryUrls : [fallbackImage];

//   const handleMainImageError = () => {
//     setMainImageSrc(fallbackImage);
//   };

//   const handleGalleryImageError = (
//     event: React.SyntheticEvent<HTMLImageElement, Event>
//   ) => {
//     const target = event.currentTarget;
//     target.src = fallbackImage;
//   };

//   return (
//     <>
//       <div className="bg-[#f6f4fb] border-b border-[#e5e2f5] pt-3 pb-3 px-4 sm:px-8">
//         <Breadcrumb
//           items={[
//             { label: "Home", href: "/" },
//             { label: "Colleges", href: "/college" },
//             { label: collegeData.name },
//           ]}
//         />
//       </div>

//       <div className="container-1 mx-auto p-6 py-[10px] px-4 sm:px-6 md:px-10 lg:px-[70px] w-full">
//         <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
//           {/* Left */}
//           <div className="lg:w-2/3 space-y-6">
//             <h1 className="text-2xl sm:text-3xl font-bold">
//               {collegeData.name}
//             </h1>
//             <p
//               className="rich-content"
//               dangerouslySetInnerHTML={{
//                 __html: DOMPurify.sanitize(collegeData.description || ""),
//               }}
//             />
//             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//               <span className="text-[#403A83] font-semibold">
//                 📍 {collegeData.location?.split(" ")[0]}
//               </span>

//               <div className="flex -space-x-3 overflow-x-auto scrollbar-hide p-1">
//                 {galleryImages.map((img, index) => (
//                   <Image
//                     key={index}
//                     src={img}
//                     width={50}
//                     height={50}
//                     className="rounded-full border-2 border-gray-300 hover:border-blue-500 hover:scale-110 transition-all duration-300 shadow-md"
//                     alt={`Gallery ${index + 1}`}
//                     onError={handleGalleryImageError}
//                   />
//                 ))}
//               </div>

//               {galleryImages.length > 1 && (
//                 <button
//                   onClick={() => setIsGalleryOpen(true)}
//                   className="text-[#403A83] underline font-semibold hover:text-blue-800"
//                 >
//                   View Gallery
//                 </button>
//               )}
//             </div>

//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//               {hasBrochure && (
//                 <button
//                   onClick={() =>
//                     handleDownload(collegeData.id || collegeData._id || "")
//                   }
//                   className="px-5 py-2 border border-[#D35B42] text-[#D35B42] rounded-lg font-medium hover:bg-[#D35B42] hover:text-white transition"
//                 >
//                   Download Brochure
//                 </button>
//               )}

//               {/* ✅ Shortlist button */}
//               <button
//                 onClick={handleShortlist}
//                 className={`flex items-center justify-center gap-2 px-5 py-2 rounded-lg font-medium transition ${
//                   isShortlisted || alreadyShortlisted
//                     ? "bg-green-700 text-white cursor-not-allowed"
//                     : "bg-[#D35B42] text-white hover:bg-blue-800"
//                 }`}
//                 disabled={isShortlisted || alreadyShortlisted}
//               >
//                 {isShortlisted || alreadyShortlisted ? (
//                   <>
//                     <CheckCircleIcon className="h-5 w-5 text-white" />
//                     Shortlisted
//                   </>
//                 ) : (
//                   "Shortlist"
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Right */}
//           <div className="lg:w-1/3 w-full">
//             <Image
//               src={mainImageSrc}
//               width={500}
//               height={500}
//               priority
//               className="rounded-xl shadow-lg w-full object-cover"
//               alt={collegeData.name}
//               onError={handleMainImageError}
//             />
//           </div>
//         </div>

//         {/* Tabs */}
//         <nav className="flex space-x-6 border-b pb-2 mt-6 text-gray-600 overflow-x-auto scrollbar-hide px-2 sm:px-0">
//           {collegeData.tabs.map((tab, index) => (
//             <button
//               key={index}
//               onClick={() => setSelectedTab(tab)}
//               className={`font-bold px-2 py-1 border-b-2 focus:outline-none ${
//                 selectedTab?.title === tab.title
//                   ? "border-[#403A83] text-[#403A83]"
//                   : "border-transparent hover:text-blue-700"
//               }`}
//             >
//               {tab.title}
//             </button>
//           ))}
//         </nav>

//         {selectedTab && (
//           <div className="mt-6">
//             <h2 className="text-lg sm:text-xl font-bold text-gray-900">
//               {selectedTab.title}
//             </h2>
//             <div
//               className="rich-content"
//               dangerouslySetInnerHTML={{
//                 __html: DOMPurify.sanitize(selectedTab.description || ""),
//               }}
//             />
//           </div>
//         )}

//         <Courses college_id={collegeData.id || collegeData._id || ""} />

//         {/* About */}
//         <div className="mt-6 mb-6">
//           <h2 className="text-lg sm:text-xl font-bold text-gray-900">
//             About {collegeData.name}
//           </h2>
//           <div
//             className="rich-content"
//             dangerouslySetInnerHTML={{
//               __html: DOMPurify.sanitize(collegeData.about),
//             }}
//           />
//         </div>

//         {/* Gallery Modal */}
//         {isGalleryOpen && galleryImages.length > 1 && (
//           <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-xl transition-opacity duration-300 ease-in-out">
//             <div className="bg-[#E5E7EB] p-6 rounded-2xl shadow-2xl w-[90%] sm:max-w-lg relative overflow-hidden">
//               <button
//                 onClick={() => setIsGalleryOpen(false)}
//                 className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-900/80 text-white rounded-full hover:bg-red-500 transition-all duration-300"
//                 aria-label="Close gallery"
//               >
//                 ✖
//               </button>
//               <h2 className="text-2xl font-bold mb-5 text-center text-gray-900">
//                 Gallery
//               </h2>

//               <div className="relative">
//                 <div className="w-full overflow-hidden">
//                   <div
//                     className="flex transition-transform duration-500 ease-in-out"
//                     style={{
//                       transform: `translateX(-${currentImageIndex * 100}%)`,
//                     }}
//                   >
//                     {galleryImages.map((img, index) => (
//                       <div key={index} className="flex-shrink-0 w-full">
//                         <Image
//                           src={img}
//                           width={600}
//                           height={400}
//                           className="rounded-xl object-cover shadow-lg"
//                           alt={`Gallery ${index + 1}`}
//                           onError={handleGalleryImageError}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <button
//                   onClick={() =>
//                     setCurrentImageIndex(
//                       (prev) =>
//                         (prev - 1 + galleryImages.length) % galleryImages.length
//                     )
//                   }
//                   className="absolute left-2 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-gray-900/90 text-white rounded-full hover:scale-110 hover:bg-[#D35B42] transition-all duration-300"
//                 >
//                   ❮
//                 </button>

//                 <button
//                   onClick={() =>
//                     setCurrentImageIndex(
//                       (prev) => (prev + 1) % galleryImages.length
//                     )
//                   }
//                   className="absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-gray-900/90 text-white rounded-full hover:scale-110 hover:bg-[#D35B42] transition-all duration-300"
//                 >
//                   ❯
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

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
import { useUserStore } from "@/Store/userStore";
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
  const [alreadyShortlisted, setAlreadyShortlisted] = useState(false);
  const fallbackImage = "/image/fallback-image.webp";
  const [mainImageSrc, setMainImageSrc] = useState<string>(fallbackImage);

  const { user, token, addToShortlist, isCollegeShortlisted } = useUserStore();

  useEffect(() => {
    setMounted(true);
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
          try {
            const brochureUrl = `${api_url}brochure/college/${data.id || data._id}`;
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
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchCollege();
  }, [slug]);

  useEffect(() => {
    const checkIfAlreadyShortlisted = async () => {
      if (!token || (!collegeData?._id && !collegeData?.id)) return;
      try {
        const res = await fetch(
          `${api_url}get/user/shortlistedClg/by/${user?._id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();
        if (res.ok && Array.isArray(data.data)) {
          const found = data.data.some(
            (item: any) =>
              item.collegeId?._id === (collegeData._id || collegeData.id),
          );
          setAlreadyShortlisted(found);
        }
      } catch (err) {
        console.error("Error checking shortlisted colleges:", err);
      }
    };
    checkIfAlreadyShortlisted();
  }, [user, token, collegeData]);

  useEffect(() => {
    if (collegeData?.image) {
      setMainImageSrc(collegeData.image);
    } else {
      setMainImageSrc(fallbackImage);
    }
  }, [collegeData]);

  const handleDownload = async (collegeId: string) => {
    try {
      const res = await fetch(`${api_url}brochure/college/${collegeId}`);
      if (!res.ok) throw new Error("Failed to fetch download URL");
      const data = await res.json();
      if (!data?.url) throw new Error("No download URL received");
      const a = document.createElement("a");
      a.href = data.url;
      a.download = data.fileName || "brochure.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("❌ Download failed:", error);
      alert("Download failed, please try again.");
    }
  };

  const handleShortlist = async () => {
    if (!token) {
      const currentPath = window.location.pathname + window.location.search;
      if (!sessionStorage.getItem("redirectAfterLogin")) {
        sessionStorage.setItem("redirectAfterLogin", currentPath);
      }
      sessionStorage.setItem(
        "pendingShortlistCollege",
        JSON.stringify({
          id: collegeData?._id || collegeData?.id,
          name: collegeData?.name,
          location: collegeData?.location,
        }),
      );
      window.location.href = "/user/auth/logIn";
      return;
    }

    const collegeId = collegeData?._id || collegeData?.id;
    try {
      const res = await fetch(`${api_url}shortlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          collegeId,
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
        }),
      });
      const data = await res.json();
      if (data.message === "User not found.") {
        alert("Your account was not found.");
        return;
      }
      if (res.ok) {
        addToShortlist({
          id: collegeId || "",
          name: collegeData?.name || "",
          location: collegeData?.location || "",
        });
        setAlreadyShortlisted(true);
      } else {
        alert(data.message || "Failed to shortlist this college.");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  if (!mounted) return null;
  if (loading) return <Loader />;
  if (error)
    return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!collegeData)
    return <div className="text-center py-10">No college data available.</div>;

  // ✅ FIX: No fallback injection — only real gallery images
  const galleryImages = (collegeData.imageGallery || []).filter(Boolean);

  const handleMainImageError = () => setMainImageSrc(fallbackImage);
  const handleGalleryImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    event.currentTarget.src = fallbackImage;
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-[#f6f4fb] border-b border-[#e5e2f5] pt-3 pb-3 px-4 sm:px-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Colleges", href: "/college" },
            { label: collegeData.name },
          ]}
        />
      </div>

      <div className="container-1 mx-auto w-full px-4 py-4 sm:px-6 md:px-10 lg:px-[70px] sm:py-[10px]">
        <div className="flex flex-col lg:flex-row items-start gap-5 lg:gap-8">
          {/* ── Left content ── */}
          <div className="w-full lg:w-2/3 space-y-4 sm:space-y-6">
            {/* College image — mobile only */}
            <div className="lg:hidden w-full">
              <Image
                src={mainImageSrc}
                width={500}
                height={300}
                priority
                className="rounded-2xl shadow-md w-full object-cover h-48 sm:h-64"
                alt={collegeData.name}
                onError={handleMainImageError}
              />
            </div>

            {/* Title */}
            <h1 className="font-bold text-gray-900 leading-tight text-xl sm:text-3xl">
              {collegeData.name}
            </h1>

            {/* Description */}
            <p
              className="rich-content text-sm sm:text-base text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(collegeData.description || ""),
              }}
            />

            {/* Location + gallery row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[#403A83] font-semibold text-sm">
                📍 {collegeData.location?.split(" ")[0]}
              </span>

              {/* ✅ Thumbnail images — click to open modal at that index */}
              {galleryImages.length > 0 && (
                <div
                  className="flex -space-x-2 overflow-x-auto"
                  style={{ scrollbarWidth: "none" }}
                >
                  {galleryImages.slice(0, 5).map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      width={36}
                      height={36}
                      className="rounded-full border-2 border-white hover:border-blue-500 hover:scale-110 transition-all duration-300 shadow-md shrink-0 w-8 h-8 sm:w-[50px] sm:h-[50px] cursor-pointer"
                      alt={`Gallery ${index + 1}`}
                      onError={handleGalleryImageError}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setIsGalleryOpen(true);
                      }}
                    />
                  ))}
                </div>
              )}

              {/* ✅ FIX: show button when > 0 real images exist
              {galleryImages.length > 0 && (
                <button
                  onClick={() => {
                    setCurrentImageIndex(0);
                    setIsGalleryOpen(true);
                  }}
                  className="text-[#403A83] underline font-semibold text-xs sm:text-sm hover:text-blue-800"
                >
                  View Gallery ({galleryImages.length})
                </button>
              )} */}
            </div>

            {/* Action buttons */}
            <div className="flex flex-row gap-2 sm:gap-4 flex-wrap">
              {hasBrochure && (
                <button
                  onClick={() =>
                    handleDownload(collegeData.id || collegeData._id || "")
                  }
                  className="flex-1 sm:flex-none border border-[#fd4c00] text-[#fd4c00] rounded-lg font-medium hover:bg-[#D35B42] hover:text-white transition px-3 py-2 text-xs sm:px-5 sm:py-2 sm:text-sm"
                >
                  Download Brochure
                </button>
              )}
              <button
                onClick={handleShortlist}
                disabled={isShortlisted || alreadyShortlisted}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg font-medium transition px-3 py-2 text-xs sm:px-5 sm:py-2 sm:text-sm
                  ${
                    isShortlisted || alreadyShortlisted
                      ? "bg-green-700 text-white cursor-not-allowed"
                      : "bg-[#fd4c00] text-white hover:bg-blue-800"
                  }`}
              >
                {isShortlisted || alreadyShortlisted ? (
                  <>
                    <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    Shortlisted
                  </>
                ) : (
                  "Shortlist"
                )}
              </button>
            </div>
          </div>

          {/* ── Right: main image — desktop only ── */}
          {/* ── Right: main image — desktop only ── */}
          {/* ✅ FIX: constrain height so it matches left content naturally */}
          <div className="hidden lg:flex lg:w-1/3 w-full items-start">
            <div className="relative w-full h-64 xl:h-[400px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src={mainImageSrc}
                fill
                priority
                className="object-cover"
                alt={collegeData.name}
                onError={handleMainImageError}
              />
            </div>
          </div>
        </div>

        {/* Tab nav */}
        <nav
          className="flex border-b pb-2 mt-5 sm:mt-6 text-gray-600 gap-4 sm:gap-6 sm:space-x-6 overflow-x-auto px-0"
          style={{ scrollbarWidth: "none" }}
        >
          {collegeData.tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setSelectedTab(tab)}
              className={`font-bold border-b-2 focus:outline-none shrink-0 transition px-1 py-1 text-xs sm:text-sm sm:px-2
                ${
                  selectedTab?.title === tab.title
                    ? "border-[#403A83] text-[#403A83]"
                    : "border-transparent hover:text-blue-700"
                }`}
            >
              {tab.title}
            </button>
          ))}
        </nav>

        {/* Tab content */}
        {selectedTab && (
          <div className="mt-4 sm:mt-6">
            <h2 className="font-bold text-gray-900 text-base sm:text-xl">
              {selectedTab.title}
            </h2>
            <div
              className="rich-content text-sm sm:text-base"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(selectedTab.description || ""),
              }}
            />
          </div>
        )}

        <Courses college_id={collegeData.id || collegeData._id || ""} />

        {/* About */}
        {/* <div className="mt-5 mb-5 sm:mt-6 sm:mb-6">
          <h2 className="font-bold text-gray-900 mb-2 text-base sm:text-xl">
            About {collegeData.name}
          </h2>
          <div
            className="rich-content text-sm sm:text-base"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(collegeData.about),
            }}
          />
        </div> */}

        {/* ✅ Gallery Modal — fixed conditions */}
        {isGalleryOpen && galleryImages.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-xl transition-opacity duration-300 ease-in-out">
            <div className="bg-[#E5E7EB] p-6 rounded-2xl shadow-2xl w-[90%] sm:max-w-lg relative">
              {/* Close button */}
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-gray-900/80 text-white rounded-full hover:bg-red-500 transition-all duration-300 z-10"
                aria-label="Close gallery"
              >
                ✖
              </button>

              <h2 className="text-xl sm:text-2xl font-bold mb-5 text-center text-gray-900">
                Gallery
              </h2>

              {/* Slider */}
              <div className="relative overflow-hidden rounded-xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentImageIndex * 100}%)`,
                  }}
                >
                  {galleryImages.map((img, index) => (
                    <div key={index} className="flex-shrink-0 w-full">
                      <div className="relative w-full h-64 sm:h-80">
                        <Image
                          src={img}
                          fill
                          className="object-cover rounded-xl shadow-lg"
                          alt={`Gallery ${index + 1}`}
                          onError={handleGalleryImageError}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Prev button — only show if more than 1 image */}
                {galleryImages.length > 1 && (
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (prev) =>
                          (prev - 1 + galleryImages.length) %
                          galleryImages.length,
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-900/90 text-white rounded-full hover:scale-110 hover:bg-[#D35B42] transition-all duration-300"
                  >
                    ❮
                  </button>
                )}

                {/* Next button — only show if more than 1 image */}
                {galleryImages.length > 1 && (
                  <button
                    onClick={() =>
                      setCurrentImageIndex(
                        (prev) => (prev + 1) % galleryImages.length,
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-900/90 text-white rounded-full hover:scale-110 hover:bg-[#D35B42] transition-all duration-300"
                  >
                    ❯
                  </button>
                )}
              </div>

              {/* Dot indicators — only show if more than 1 image */}
              {galleryImages.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? "bg-[#403A83] scale-125"
                          : "bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
