"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { colors } from "@/theme/colors";

interface TrendingEntry {
  name: string;
  link?: string;
}

function extractExamKey(name: string): string {
  if (!name) return "";
  const paren = name.match(/\(([^)]+)\)/);
  if (paren && paren[1]) return paren[1].trim();
  const caps = name.match(/\b([A-Z]{2,})\b/);
  if (caps && caps[1]) return caps[1];
  const first = name.split(/\s+/)[0].replace(/[^a-zA-Z0-9]/g, "");
  return first || name;
}

// ── Mobile skeleton ──────────────────────────────────────────────
function MobileSkeleton() {
  const widths = [72, 90, 64, 100, 80, 68, 110, 76];
  return (
    <div className="sm:hidden animate-pulse w-full bg-white py-3">
      <div className="flex gap-2 px-4 overflow-hidden">
        {widths.map((w, i) => (
          <div
            key={i}
            className="shrink-0 h-8 rounded-full bg-gray-200"
            style={{ width: w }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Desktop skeleton ─────────────────────────────────────────────
function DesktopSkeleton() {
  const widths = [110, 130, 95, 150, 120, 100, 140, 115, 90, 135];
  return (
    <div className="hidden sm:block animate-pulse w-full bg-white py-5">
      <div className="flex gap-4 px-6 overflow-hidden">
        {widths.map((w, i) => (
          <div
            key={i}
            className="shrink-0 h-12 rounded-full bg-gray-200"
            style={{ width: w }}
          />
        ))}
      </div>
    </div>
  );
}

// Custom dot colors mapping exactly from the reference screenshot
const accentDots = ["bg-[#F97316]", "bg-[#0EA5E9]", "bg-[#A3E635]", "bg-[#22C55E]"];
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const buildApiUrl = (path: string) => {
  if (!API_BASE_URL) return null;
  try {
    return new URL(path, API_BASE_URL).toString();
  } catch {
    return null;
  }
};

const TrendingNow = () => {
  const [exams, setExams] = useState<TrendingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrendingExams = async () => {
      const trendingNowUrl = buildApiUrl("get/trendingNow");
      if (!trendingNowUrl) {
        console.error(
          "TrendingNow: NEXT_PUBLIC_API_URL is missing or invalid.",
          API_BASE_URL
        );
        setError("Failed to fetch trending exams.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(trendingNowUrl);
        if (Array.isArray(response.data)) {
          setExams(
            response.data.map((item: any) => ({
              name: item.name,
              link: item.link,
            }))
          );
        } else {
          setError("Unexpected response format.");
        }
      } catch (err: any) {
        console.error("Error fetching trending exams:", err);
        setError("Failed to fetch trending exams.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingExams();
  }, []);

  const repeatedExams = [...exams, ...exams];

  // Convert hex to rgba with opacity
  const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const orangeColor = colors.accent.orange;

  return (
    <section className="relative w-full overflow-hidden bg-white py-2 md:py-4">
      <div className="relative mx-auto flex w-full flex-col items-center">

        {/* ── Skeletons while loading ── */}
        {loading && (
          <>
            <MobileSkeleton />
            <DesktopSkeleton />
          </>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <p className="text-red-500 text-sm font-medium text-center py-2">{error}</p>
        )}

        {/* ── Real marquee ── */}
        {!loading && !error && (
          <div className="group relative w-full overflow-hidden bg-white">
            {/* Smooth Edge Fades */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-12 md:w-28 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-12 md:w-28 bg-gradient-to-l from-white to-transparent z-10" />

            <div className="whitespace-nowrap animate-marquee group-hover:pause flex w-max gap-3 md:gap-4 px-4 md:px-6 py-2 text-base">
              {repeatedExams.map((exam, index) => {
                const examParam = extractExamKey(exam.name);
                const fallbackHref = `/college?page=1&exams=${encodeURIComponent(examParam)}`;
                const href = exam.link?.trim() ? exam.link : fallbackHref;
                const isExternal = /^https?:\/\//i.test(href);

                return (
                  <Link
                    key={`${exam.name}-${index}`}
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="
                      inline-flex items-center rounded-full
                      font-bold transition-colors duration-200
                      hover:opacity-80
                      gap-2 px-3.5 py-2 text-xs
                      md:gap-3 md:px-5 md:py-3.5 md:text-[14.5px]
                    "
                    style={{ backgroundColor: hexToRgba(orangeColor, 0.15) }}
                  >
                    <span
                      className={`rounded-full ${accentDots[index % accentDots.length]} h-2 w-2 shrink-0`}
                    />
                    <span className="truncate max-w-[240px] md:max-w-none text-slate-700 font-bold">
                      {exam.name}
                    </span>
                    <span className="text-[10px] md:text-xs font-bold tracking-widest text-gray-400 uppercase ml-1">
                      explore
                    </span>
                  </Link>
                );
              })}

              {exams.length === 0 && (
                <span className="text-gray-400 text-xs py-2 px-4 font-medium">
                  No active trends available right now.
                </span>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default TrendingNow;

// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Link from "next/link";

// interface TrendingEntry {
//   name: string;
//   link?: string;
// }

// function extractExamKey(name: string): string {
//   if (!name) return "";
//   const paren = name.match(/\(([^)]+)\)/);
//   if (paren && paren[1]) return paren[1].trim();
//   const caps = name.match(/\b([A-Z]{2,})\b/);
//   if (caps && caps[1]) return caps[1];
//   const first = name.split(/\s+/)[0].replace(/[^a-zA-Z0-9]/g, "");
//   return first || name;
// }

// // ── Mobile skeleton ──────────────────────────────────────────────
// function MobileSkeleton() {
//   const widths = [72, 90, 64, 100, 80, 68, 110, 76];
//   return (
//     <div className="sm:hidden animate-pulse w-full bg-white py-3">
//       <div className="flex gap-2 px-4 overflow-hidden">
//         {widths.map((w, i) => (
//           <div
//             key={i}
//             className="shrink-0 h-8 rounded-full bg-gray-200"
//             style={{ width: w }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// // ── Desktop skeleton ─────────────────────────────────────────────
// function DesktopSkeleton() {
//   const widths = [110, 130, 95, 150, 120, 100, 140, 115, 90, 135];
//   return (
//     <div className="hidden sm:block animate-pulse w-full bg-white py-5">
//       <div className="flex gap-4 px-6 overflow-hidden">
//         {widths.map((w, i) => (
//           <div
//             key={i}
//             className="shrink-0 h-12 rounded-full bg-gray-200"
//             style={{ width: w }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// // Custom dot colors mapping exactly from the reference screenshot
// const accentDots = ["bg-[#F97316]", "bg-[#0EA5E9]", "bg-[#A3E635]", "bg-[#22C55E]"];
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// const buildApiUrl = (path: string) => {
//   if (!API_BASE_URL) return null;
//   try {
//     return new URL(path, API_BASE_URL).toString();
//   } catch {
//     return null;
//   }
// };

// const TrendingNow = () => {
//   const [exams, setExams] = useState<TrendingEntry[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchTrendingExams = async () => {
//       const trendingNowUrl = buildApiUrl("get/trendingNow");
//       if (!trendingNowUrl) {
//         console.error(
//           "TrendingNow: NEXT_PUBLIC_API_URL is missing or invalid.",
//           API_BASE_URL
//         );
//         setError("Failed to fetch trending exams.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(trendingNowUrl);
//         if (Array.isArray(response.data)) {
//           setExams(
//             response.data.map((item: any) => ({
//               name: item.name,
//               link: item.link,
//             }))
//           );
//         } else {
//           setError("Unexpected response format.");
//         }
//       } catch (err: any) {
//         console.error("Error fetching trending exams:", err);
//         setError("Failed to fetch trending exams.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTrendingExams();
//   }, []);

//   const repeatedExams = [...exams, ...exams];

//   return (
//     <section className="relative w-full overflow-hidden bg-white py-2 md:py-4">
//       <div className="relative mx-auto flex w-full flex-col items-center">

//         {/* ── Skeletons while loading ── */}
//         {loading && (
//           <>
//             <MobileSkeleton />
//             <DesktopSkeleton />
//           </>
//         )}

//         {/* ── Error ── */}
//         {!loading && error && (
//           <p className="text-red-500 text-sm font-medium text-center py-2">{error}</p>
//         )}

//         {/* ── Real marquee ── */}
//         {!loading && !error && (
//           <div className="group relative w-full overflow-hidden bg-white">
//             {/* Smooth Edge Fades */}
//             <div className="pointer-events-none absolute left-0 top-0 h-full w-12 md:w-28 bg-gradient-to-r from-white to-transparent z-10" />
//             <div className="pointer-events-none absolute right-0 top-0 h-full w-12 md:w-28 bg-gradient-to-l from-white to-transparent z-10" />

//             <div className="whitespace-nowrap animate-marquee group-hover:pause flex w-max gap-3 md:gap-4 px-4 md:px-6 py-2 text-base">
//               {repeatedExams.map((exam, index) => {
//                 const examParam = extractExamKey(exam.name);
//                 const fallbackHref = `/college?page=1&exams=${encodeURIComponent(examParam)}`;
//                 const href = exam.link?.trim() ? exam.link : fallbackHref;
//                 const isExternal = /^https?:\/\//i.test(href);

//                 return (
//                   <Link
//                     key={`${exam.name}-${index}`}
//                     href={href}
//                     target={isExternal ? "_blank" : undefined}
//                     rel={isExternal ? "noopener noreferrer" : undefined}
//                     className="
//                       inline-flex items-center rounded-full
//                       bg-[#EBF3F1] font-medium text-slate-700
//                       transition-colors duration-200
//                       hover:bg-[#E2ECE9]
//                       gap-2 px-3.5 py-2 text-xs
//                       md:gap-3 md:px-5 md:py-3.5 md:text-[14.5px]
//                     "
//                   >
//                     <span
//                       className={`rounded-full ${accentDots[index % accentDots.length]} h-2 w-2 shrink-0`}
//                     />
//                     <span className="truncate max-w-[240px] md:max-w-none">
//                       {exam.name}
//                     </span>
//                     <span className="text-[10px] md:text-xs font-semibold tracking-widest text-gray-400 uppercase ml-1">
//                       explore
//                     </span>
//                   </Link>
//                 );
//               })}

//               {exams.length === 0 && (
//                 <span className="text-gray-400 text-xs py-2 px-4 font-medium">
//                   No active trends available right now.
//                 </span>
//               )}
//             </div>
//           </div>
//         )}

//       </div>
//     </section>
//   );
// };

// export default TrendingNow;