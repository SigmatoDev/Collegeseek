// import { useEffect, useState } from "react";
// import axios from "axios";
// import { api_url, img_url } from "@/utils/apiCall";
// import { CurrencyRupeeIcon, MapPinIcon } from "@heroicons/react/24/outline";
// import { useRouter } from "next/navigation";
// import Modal from "@/components/counselling/model/page";
// import CounsellingForm from "@/components/counselling/counsellingForm/page";
// import DOMPurify from "dompurify";

// interface Props {
//   collegeId?: string;
//   college?: CollegeData;
// }

// interface CollegeData {
//   image: string;
//   name: string;
//   slug: string;
//   rating: number;
//   location: string;
//   city: string;
//   state: string;
//   rank: number;
//   fees: string;
//   accreditation: string;
//   avgPackage: string;
//   exams: string;
//   description: string;
//   shortlistedUsers: { image: string; name: string }[];
//   shortlistedCount: number;
//   coursesCount: number;
// }

// export default function FilterCollegeCard({ collegeId, college }: Props) {
//   const [collegeData, setCollegeData] = useState<CollegeData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const router = useRouter();

// useEffect(() => {
//   const hasMinimumData =
//     college &&
//     Boolean(college.name) &&
//     Boolean(college.slug) &&
//     Boolean(college.description);

//   if (hasMinimumData) {
//     setCollegeData(college);
//     setError(null);
//     setLoading(false);
//     return;
//   }

//   if (!collegeId) {
//     setError("Invalid college ID.");
//     setLoading(false);
//     return;
//   }

//   const fetchCollegeById = async () => {
//     setLoading(true);
//     setError(null);

//     const timerLabel = `API /colleges/${collegeId}`;
//     console.time(timerLabel);

//     try {
//       const response = await axios.get(`${api_url}/colleges/${collegeId}`);

//       console.timeEnd(timerLabel); // ⏱ API time

//       if (response.data?.success) {
//         setCollegeData(response.data.data);
//       } else {
//         setError("College data not found.");
//       }
//     } catch (error: any) {
//       console.timeEnd(timerLabel); // ensure timer ends on error
//       setError("Failed to load college data.");
//       console.error(
//         "Error fetching data:",
//         error?.response?.data || error?.message
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchCollegeById();
// }, [college, collegeId]);

//   const cleanDescription = (html: string): string => {
//     if (!html) return "";
//     const cleaned = html
//       .replace(/<li>\s*<p>/g, "<li>") // Remove opening <p> inside <li>
//       .replace(/<\/p>\s*<\/li>/g, "</li>") // Remove closing </p> inside <li>
//       .replace(/<p><\/p>/g, ""); // Remove empty <p> tags
//     return DOMPurify.sanitize(cleaned);
//   };
//   if (loading && !collegeData) {
//     return <div className="text-center p-4">Loading...</div>;
//   }
//   if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
//   if (!collegeData) return <div className="text-center p-4">...</div>;

//   const sanitizedDescription = cleanDescription(collegeData.description || "");

//   const imageUrlFinal = collegeData.image
//     ? `${img_url}uploads/${collegeData.image.replace(/^\/?uploads\//, "")}`
//     : "/logo/logo1.png";

//   return (
//     <div
//       className="border rounded-lg shadow-md p-3 md:p-4 bg-white cursor-pointer hover:shadow-lg transition-shadow"
//       onClick={() => router.push(`/colleges/${collegeData.slug}`)}
//     >
//       <div className="flex flex-col md:flex-row gap-4">
//         <img
//           src={imageUrlFinal}
//           alt={collegeData.name}
//           width={192}
//           height={128}
//           className="w-full md:w-48 h-48 md:h-32 rounded-lg object-cover"
//           loading="lazy"
//           onError={(e) =>
//             (e.currentTarget.src = "/logo/logo-removebg-preview.png")
//           }
//           onClick={(e) => {
//             e.stopPropagation();
//             setSelectedImage(imageUrlFinal);
//           }}
//         />
//         <div className="flex flex-col justify-between flex-1">
//           <h2 className="text-lg md:text-xl font-semibold mb-2">
//             {collegeData.name}
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 mb-2">
//             <div className="flex items-center gap-1">
//               <MapPinIcon className="w-[18px] h-[18px] text-blue-500" />
//               {collegeData.city} ({collegeData.state})
//             </div>
//             <div className="text-orange-500 font-semibold pl-1">
//               {collegeData.rank && collegeData.rank !== 0
//                 ? `#${collegeData.rank} NIRF`
//                 : "# N/A NIRF"}
//             </div>

//             <div>
//               <div className="flex items-center gap-1 font-semibold text-gray-800 mb-1">
//                 <CurrencyRupeeIcon className="w-[18px] h-[18px] text-green-500" />
//                 Fees
//               </div>
//               <div className="text-gray-600 pl-[22px]">
//                 {collegeData.fees && Number(collegeData.fees) !== 0
//                   ? `Rs. ${Number(collegeData.fees).toLocaleString(
//                       "en-IN"
//                     )} (Start From)`
//                   : " Rs. N/A (Start From)"}
//               </div>
//             </div>
//             <div>
//               <div className="flex items-center gap-1 font-semibold text-gray-800 mb-1">
//                 <CurrencyRupeeIcon className="w-[18px] h-[18px] text-purple-500" />
//                 Avg Package
//               </div>
//               <div className="text-gray-600 pl-[22px]">
//                 {collegeData.avgPackage && Number(collegeData.avgPackage) !== 0
//                   ? `${collegeData.avgPackage} LPA`
//                   : "N/A LPA"}
//               </div>
//             </div>
//           </div>

//           <div className="text-sm text-gray-600 mb-2">
//             <div
//               className="whitespace-pre-wrap break-words"
//               dangerouslySetInnerHTML={{
//                 __html: isExpanded
//                   ? sanitizedDescription
//                   : cleanDescription(
//                       collegeData.description.slice(0, 150) + "..."
//                     ),
//               }}
//             />

//             {collegeData.description.length > 150 && (
//               <button
//                 className="text-blue-500 text-xs font-semibold focus:outline-none mt-1"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setIsExpanded(!isExpanded);
//                 }}
//               >
//                 {isExpanded ? "Read Less" : "Read More"}
//               </button>
//             )}
//           </div>

//           {Array.isArray(collegeData.shortlistedUsers) &&
//             collegeData.shortlistedUsers.length > 0 && (
//               <div className="flex items-center gap-2 mt-2">
//                 <div className="flex -space-x-2">
//                   {collegeData.shortlistedUsers.map((user, index) => (
//                     <img
//                       key={index}
//                       src={
//                         user.image
//                           ? `${img_url}${user.image.replace(/^\/+/, "")}`
//                           : "/logo/default-user.png"
//                       }
//                       width={24}
//                       height={24}
//                       className="w-6 h-6 rounded-full border"
//                       alt={user.name}
//                       onError={(e) =>
//                         (e.currentTarget.src = "/logo/default-user.png")
//                       }
//                     />
//                   ))}
//                 </div>
//                 <span className="text-sm text-gray-700">
//                   Shortlisted by {collegeData.shortlistedCount ?? 0}+ students
//                 </span>
//               </div>
//             )}
//         </div>
//       </div>

//       <div className="border-t mt-4 pt-3 flex flex-col md:flex-row justify-between gap-3 text-sm text-[#441A6B]">
//         <div className="flex flex-col md:flex-row gap-3 w-full">
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setIsModalOpen(true);
//             }}
//             className="w-full md:w-auto bg-[#D35B42] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-md hover:bg-[#b84b35] transition duration-300"
//           >
//             Get Free Counselling
//           </button>

//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               router.push(`/colleges/${collegeData.slug}`);
//             }}
//             className="w-full md:w-auto border px-4 py-2 md:py-3 rounded-lg hover:bg-gray-100"
//           >
//             View Details
//           </button>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               router.push(`/college/apply?college=${collegeData.slug}`);
//             }}
//             className="w-full md:w-auto border border-dashed px-4 py-2 md:py-3 rounded-lg text-[#441A6B] bg-transparent hover:bg-[#f6f5ff]"
//           >
//             Apply Now
//           </button>
//         </div>
//       </div>

//       {isModalOpen && (
//         <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//           <div
//             className="p-4 sm:p-6 max-w-full mx-auto bg-white rounded-lg"
//             onClick={(e) => e.stopPropagation()} // prevent Modal internal click from bubbling
//           >
//             <CounsellingForm collegeId={collegeId} />
//           </div>
//         </Modal>
//       )}

//       {selectedImage && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 sm:p-0"
//           onClick={() => setSelectedImage(null)}
//         >
//           <div
//             className="relative bg-white rounded-lg w-full max-w-2xl mx-auto"
//             onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside image
//           >
//             <button
//               onClick={() => setSelectedImage(null)}
//               className="absolute top-2 right-2 text-white bg-gray-800 px-2 py-1 rounded"
//             >
//               ✕
//             </button>
//             <img
//               src={selectedImage}
//               alt="Selected Image"
//               className="rounded-lg w-full h-auto"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import { api_url, img_url } from "@/utils/apiCall";
import { CurrencyRupeeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Modal from "@/components/counselling/model/page";
import CounsellingForm from "@/components/counselling/counsellingForm/page";
import DOMPurify from "dompurify";

interface Props {
  collegeId?: string;
  college?: CollegeData;
}

interface CollegeData {
  image: string;
  name: string;
  slug: string;
  rating: number;
  location: string;
  city: string;
  state: string;
  rank: number;
  fees: string;
  accreditation: string;
  avgPackage: string;
  exams: string;
  description: string;
  shortlistedUsers: { image: string; name: string }[];
  shortlistedCount: number;
  coursesCount: number;
}

// ── Skeleton card — matches exact mobile + desktop layout ──────────
function FilterCollegeCardSkeleton() {
  return (
    <div className="border rounded-lg shadow-md bg-white animate-pulse p-3 md:p-4">
      {/* Mobile skeleton */}
      <div className="md:hidden flex flex-col gap-3">
        <div className="flex gap-3">
          <div className="w-24 h-24 rounded-xl bg-gray-200 shrink-0" />
          <div className="flex flex-col justify-center gap-2 flex-1 min-w-0">
            <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
            <div className="h-3 w-1/2 bg-gray-100 rounded-full" />
            <div className="h-3 w-1/3 bg-orange-100 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-green-50 border border-green-100 px-3 py-2 space-y-1.5">
            <div className="h-2.5 w-10 bg-green-200 rounded-full" />
            <div className="h-3 w-16 bg-gray-200 rounded-full" />
          </div>
          <div className="rounded-xl bg-purple-50 border border-purple-100 px-3 py-2 space-y-1.5">
            <div className="h-2.5 w-16 bg-purple-200 rounded-full" />
            <div className="h-3 w-12 bg-gray-200 rounded-full" />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-gray-100 rounded-full" />
          <div className="h-3 w-5/6 bg-gray-100 rounded-full" />
          <div className="h-3 w-2/3 bg-gray-100 rounded-full" />
        </div>
        <div className="border-t pt-3 grid grid-cols-3 gap-2">
          <div className="h-8 rounded-lg bg-orange-200" />
          <div className="h-8 rounded-lg bg-gray-100 border" />
          <div className="h-8 rounded-lg bg-gray-100 border border-dashed" />
        </div>
      </div>

      {/* Desktop skeleton */}
      <div className="hidden md:block">
        <div className="flex gap-4">
          <div className="w-48 h-32 rounded-lg bg-gray-200 shrink-0" />
          <div className="flex flex-col flex-1 justify-between gap-2">
            <div className="h-5 w-2/3 bg-gray-200 rounded-full" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="h-3.5 w-40 bg-gray-100 rounded-full" />
              <div className="h-3.5 w-24 bg-orange-100 rounded-full" />
              <div className="space-y-1.5">
                <div className="h-3 w-14 bg-gray-200 rounded-full" />
                <div className="h-3 w-36 bg-gray-100 rounded-full" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-20 bg-gray-200 rounded-full" />
                <div className="h-3 w-28 bg-gray-100 rounded-full" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-gray-100 rounded-full" />
              <div className="h-3 w-5/6 bg-gray-100 rounded-full" />
              <div className="h-3 w-3/4 bg-gray-100 rounded-full" />
            </div>
          </div>
        </div>
        <div className="border-t mt-4 pt-3 flex gap-3">
          <div className="h-10 w-44 rounded-lg bg-orange-200" />
          <div className="h-10 w-32 rounded-lg bg-gray-100 border" />
          <div className="h-10 w-28 rounded-lg bg-gray-100 border border-dashed" />
        </div>
      </div>
    </div>
  );
}

export default function FilterCollegeCard({ collegeId, college }: Props) {
  const [collegeData, setCollegeData] = useState<CollegeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasMinimumData =
      college &&
      Boolean(college.name) &&
      Boolean(college.slug) &&
      Boolean(college.description);

    if (hasMinimumData) {
      setCollegeData(college);
      setError(null);
      setLoading(false);
      return;
    }

    if (!collegeId) {
      setError("Invalid college ID.");
      setLoading(false);
      return;
    }

    const fetchCollegeById = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${api_url}/colleges/${collegeId}`);
        if (response.data?.success) {
          setCollegeData(response.data.data);
        } else {
          setError("College data not found.");
        }
      } catch (error: any) {
        setError("Failed to load college data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeById();
  }, [college, collegeId]);

  const cleanDescription = (html: string): string => {
    if (!html) return "";
    const cleaned = html
      .replace(/<li>\s*<p>/g, "<li>")
      .replace(/<\/p>\s*<\/li>/g, "</li>")
      .replace(/<p><\/p>/g, "");
    return DOMPurify.sanitize(cleaned);
  };

  // ── Show skeleton while loading ──
  if (loading && !collegeData) return <FilterCollegeCardSkeleton />;
  if (error)
    return <div className="text-center p-4 text-red-500 text-sm">{error}</div>;
  if (!collegeData) return <FilterCollegeCardSkeleton />;

  const sanitizedDescription = cleanDescription(collegeData.description || "");
  const imageUrlFinal = collegeData.image
    ? collegeData.image // full S3 URL
    : "/logo/logo1.png";

  return (
    <div
      className="border rounded-lg shadow-md bg-white cursor-pointer hover:shadow-lg transition-shadow
        p-3 md:p-4
      "
      onClick={() => router.push(`/colleges/${collegeData.slug}`)}
    >
      {/* MOBILE layout */}
      <div className="md:hidden flex flex-col gap-3">
        <div className="flex gap-3">
          <img
            src={imageUrlFinal}
            alt={collegeData.name}
            width={96}
            height={96}
            className="w-24 h-24 rounded-xl object-cover shrink-0"
            loading="lazy"
            onError={(e) =>
              (e.currentTarget.src = "/logo/logo-removebg-preview.png")
            }
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(imageUrlFinal);
            }}
          />
          <div className="flex flex-col justify-center gap-1 min-w-0">
            <h2 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
              {collegeData.name}
            </h2>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPinIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="truncate">
                {collegeData.city}, {collegeData.state}
              </span>
            </div>
            {collegeData.rank && collegeData.rank !== 0 ? (
              <span className="text-xs font-semibold text-orange-500">
                #{collegeData.rank} NIRF
              </span>
            ) : (
              <span className="text-xs text-gray-400"># N/A NIRF</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-green-50 border border-green-100 px-3 py-2">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-green-700 uppercase tracking-wide mb-0.5">
              <CurrencyRupeeIcon className="w-3.5 h-3.5" /> Fees
            </div>
            <p className="text-xs text-gray-700">
              {collegeData.fees && Number(collegeData.fees) !== 0
                ? `₹${Number(collegeData.fees).toLocaleString("en-IN")}`
                : "N/A"}
            </p>
          </div>
          <div className="rounded-xl bg-purple-50 border border-purple-100 px-3 py-2">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-purple-700 uppercase tracking-wide mb-0.5">
              <CurrencyRupeeIcon className="w-3.5 h-3.5" /> Avg Package
            </div>
            <p className="text-xs text-gray-700">
              {collegeData.avgPackage && Number(collegeData.avgPackage) !== 0
                ? `${collegeData.avgPackage} LPA`
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="text-xs text-gray-600 leading-relaxed">
          <div
            className="whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{
              __html: isExpanded
                ? sanitizedDescription
                : cleanDescription(
                    collegeData.description.slice(0, 120) + "...",
                  ),
            }}
          />
          {collegeData.description.length > 120 && (
            <button
              className="text-blue-500 text-xs font-semibold mt-1"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          )}
        </div>

        {Array.isArray(collegeData.shortlistedUsers) &&
          collegeData.shortlistedUsers.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                {collegeData.shortlistedUsers.slice(0, 3).map((user, index) => (
                  <img
                    key={index}
                    src={
                      user.image
                        ? `${img_url}${user.image.replace(/^\/+/, "")}`
                        : "/logo/default-user.png"
                    }
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded-full border border-white"
                    alt={user.name}
                    onError={(e) =>
                      (e.currentTarget.src = "/logo/default-user.png")
                    }
                  />
                ))}
              </div>
              <span className="text-[11px] text-gray-500">
                {collegeData.shortlistedCount ?? 0}+ students shortlisted
              </span>
            </div>
          )}

        <div className="border-t pt-3 grid grid-cols-3 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="col-span-1 bg-[#D35B42] text-white text-[11px] font-semibold px-2 py-2 rounded-lg shadow-sm hover:bg-[#b84b35] transition text-center leading-tight"
          >
            Free Counselling
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/colleges/${collegeData.slug}`);
            }}
            className="col-span-1 border text-[11px] font-semibold px-2 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition text-center"
          >
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/college/apply?college=${collegeData.slug}`);
            }}
            className="col-span-1 border border-dashed text-[11px] font-semibold px-2 py-2 rounded-lg text-[#441A6B] hover:bg-[#f6f5ff] transition text-center"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* DESKTOP layout — unchanged */}
      <div className="hidden md:block">
        <div className="flex flex-col md:flex-row gap-4">
          <img
            src={imageUrlFinal}
            alt={collegeData.name}
            width={192}
            height={128}
            className="w-full md:w-48 h-48 md:h-32 rounded-lg object-cover"
            loading="lazy"
            onError={(e) =>
              (e.currentTarget.src = "/logo/logo-removebg-preview.png")
            }
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(imageUrlFinal);
            }}
          />
          <div className="flex flex-col justify-between flex-1">
            <h2 className="text-lg md:text-xl font-semibold mb-2">
              {collegeData.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 mb-2">
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-[18px] h-[18px] text-blue-500" />
                {collegeData.city} ({collegeData.state})
              </div>
              <div className="text-orange-500 font-semibold pl-1">
                {collegeData.rank && collegeData.rank !== 0
                  ? `#${collegeData.rank} NIRF`
                  : "# N/A NIRF"}
              </div>
              <div>
                <div className="flex items-center gap-1 font-semibold text-gray-800 mb-1">
                  <CurrencyRupeeIcon className="w-[18px] h-[18px] text-green-500" />
                  Fees
                </div>
                <div className="text-gray-600 pl-[22px]">
                  {collegeData.fees && Number(collegeData.fees) !== 0
                    ? `Rs. ${Number(collegeData.fees).toLocaleString("en-IN")} (Start From)`
                    : " Rs. N/A (Start From)"}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 font-semibold text-gray-800 mb-1">
                  <CurrencyRupeeIcon className="w-[18px] h-[18px] text-purple-500" />
                  Avg Package
                </div>
                <div className="text-gray-600 pl-[22px]">
                  {collegeData.avgPackage &&
                  Number(collegeData.avgPackage) !== 0
                    ? `${collegeData.avgPackage} LPA`
                    : "N/A LPA"}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              <div
                className="whitespace-pre-wrap break-words"
                dangerouslySetInnerHTML={{
                  __html: isExpanded
                    ? sanitizedDescription
                    : cleanDescription(
                        collegeData.description.slice(0, 150) + "...",
                      ),
                }}
              />
              {collegeData.description.length > 150 && (
                <button
                  className="text-blue-500 text-xs font-semibold focus:outline-none mt-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </div>
            {Array.isArray(collegeData.shortlistedUsers) &&
              collegeData.shortlistedUsers.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex -space-x-2">
                    {collegeData.shortlistedUsers.map((user, index) => (
                      <img
                        key={index}
                        src={
                          user.image
                            ? `${img_url}${user.image.replace(/^\/+/, "")}`
                            : "/logo/default-user.png"
                        }
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full border"
                        alt={user.name}
                        onError={(e) =>
                          (e.currentTarget.src = "/logo/default-user.png")
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-700">
                    Shortlisted by {collegeData.shortlistedCount ?? 0}+ students
                  </span>
                </div>
              )}
          </div>
        </div>
        <div className="border-t mt-4 pt-3 flex flex-col md:flex-row justify-between gap-3 text-sm text-[#441A6B]">
          <div className="flex flex-col md:flex-row gap-3 w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="w-full md:w-auto bg-[#D35B42] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-md hover:bg-[#b84b35] transition duration-300"
            >
              Get Free Counselling
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/colleges/${collegeData.slug}`);
              }}
              className="w-full md:w-auto border px-4 py-2 md:py-3 rounded-lg hover:bg-gray-100"
            >
              View Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/college/apply?college=${collegeData.slug}`);
              }}
              className="w-full md:w-auto border border-dashed px-4 py-2 md:py-3 rounded-lg text-[#441A6B] bg-transparent hover:bg-[#f6f5ff]"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div
            className="p-4 sm:p-6 max-w-full mx-auto bg-white rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <CounsellingForm
              collegeId={
                collegeId ??
                (collegeData as any)?._id ??
                collegeData?.name ??
                "global"
              }
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </Modal>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4 sm:p-0"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative bg-white rounded-lg w-full max-w-2xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white bg-gray-800 px-2 py-1 rounded"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Selected Image"
              className="rounded-lg w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
