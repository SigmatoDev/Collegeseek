"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { colors } from "@/theme/colors";

interface CityCard {
  name: string;
  image: string;
  slug?: string;
  queryNames?: string[];
}

const CITIES: CityCard[] = [
  { name: "Bengaluru", image: "/image/cities/bangalore.webp", queryNames: ["Bengaluru", "Bangalore"] },
  { name: "Mumbai", image: "/image/cities/mumbai.webp" },
  { name: "New Delhi", image: "/image/cities/delhi.webp", queryNames: ["Delhi NCR", "Delhi", "New Delhi"] },
  { name: "Pune", image: "/image/cities/pune.webp" },
  { name: "Hyderabad", image: "/image/cities/hyderbad.webp", queryNames: ["Hyderabad"] },
  { name: "Chennai", image: "/image/cities/chennai.webp" },
  { name: "Kolkata", image: "/image/cities/kolkata.webp" },
  { name: "Ahmedabad", image: "/image/cities/ahmedabad.webp" },
];

const normalizeName = (name: string) => name.toLowerCase().trim();
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const buildApiUrl = (path: string) => {
  if (!API_BASE_URL) return null;
  try {
    return new URL(path, API_BASE_URL).toString();
  } catch {
    return null;
  }
};

const formatCity = (name: string) => {
  return name
    .split(" ")
    .map((w, i) =>
      i === 0
        ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        : w.toLowerCase()
    )
    .join("+");
};

const TopStudyCities = () => {
  const [cityStats, setCityStats] = useState<Record<string, number>>({});
  const [courseStats, setCourseStats] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCounts = async () => {
      const collegesUrl = buildApiUrl("get/colleges/filter");
      const coursesUrl = buildApiUrl("get/courses/count/by-city");

      if (!collegesUrl || !coursesUrl) {
        console.error(
          "TopStudyCities: NEXT_PUBLIC_API_URL is missing or invalid.",
          API_BASE_URL
        );
        setCityStats({});
        setCourseStats({});
        return;
      }

      try {
        const [collegeResults, courseRes] = await Promise.all([
          Promise.all(
            CITIES.map(async (city) => {
              const res = await fetch(collegesUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  cities: city.queryNames || [city.name],
                  page: 1,
                  limit: 1,
                }),
              });
              if (!res.ok) return { name: city.name, count: undefined };
              const data = await res.json();
              const total =
                data?.totalColleges ||
                data?.total ||
                data?.pagination?.total ||
                (Array.isArray(data?.allCollegeIds) ? data.allCollegeIds.length : undefined) ||
                (Array.isArray(data?.colleges) ? data.colleges.length : undefined) ||
                (typeof data?.totalPages === "number" && typeof data?.limit === "number"
                  ? data.totalPages * data.limit
                  : undefined);
              return { name: city.name, count: Number.isFinite(total) ? Number(total) : undefined };
            })
          ),
          fetch(coursesUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cities: CITIES.flatMap((c) => c.queryNames || [c.name]) }),
          }),
        ]);

        const collegeMap: Record<string, number> = {};
        collegeResults.forEach(({ name, count }) => {
          if (count !== undefined && count !== null) collegeMap[normalizeName(name)] = count;
        });
        setCityStats(collegeMap);

        if (courseRes.ok) {
          const courseData = await courseRes.json();
          const counts = courseData?.counts || {};
          const normalized: Record<string, number> = {};
          Object.entries(counts || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null) normalized[normalizeName(key)] = value as number;
          });
          setCourseStats(normalized);
        } else {
          setCourseStats({});
        }
      } catch (e) {
        console.error("Failed to fetch city stats", e);
      }
    };
    fetchCounts();
  }, []);

  return (
    <section className="relative py-8 sm:py-12" style={{ backgroundColor: "#fdfeff" }}>
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 space-y-6 sm:space-y-8">

        {/* Heading — left aligned */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em]" style={{ color: colors.accent.red }}>
              TOP STUDY PLACES
            </p>
            <h3 className="text-xl sm:text-3xl font-extrabold leading-tight" style={{ color: colors.primary.dark }}>
              Discover the cities students love the most
            </h3>
          </div>
          <p className="text-md md:text-md text-gray-500 max-w-md hidden sm:block font-light">
            Explore curated college lists by city and find programs that match your goals and lifestyle.
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {CITIES.map((city, index) => (
            <Link
              key={city.name}
              href={`/college?cities=${formatCity(city.slug || city.name)}`}
              className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200 bg-white shadow-[0_8px_30px_#f0f0f8] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_#f3f3fb] hover:border-[#e35235]"
            >

              {/* ── MOBILE card layout: horizontal icon + name, stats below ── */}
              <div className="sm:hidden flex flex-col p-3 gap-2.5">
                {/* Icon + name row */}
                <div className="flex items-center gap-2.5">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-inner">
                    <Image
                      src={city.image}
                      alt={`${city.name} icon`}
                      width={40}
                      height={40}
                      sizes="40px"
                      className="h-full w-full object-contain p-1"
                    />
                  </div>
                  <p className="text-sm font-bold" style={{ color: colors.primary.dark }}>{city.name}</p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl bg-white/80 px-2 py-2 shadow-sm border" style={{ borderColor: colors.accent.orange + '30' }}>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] block truncate" style={{ color: colors.accent.red, fontFamily: "'Inter', sans-serif" }}>Colleges</span>
                    <span className="text-sm font-bold block truncate" style={{ color: colors.primary.dark }}>
                      {cityStats[normalizeName(city.name)] ?? "--"}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white/80 px-2 py-2 shadow-sm border" style={{ borderColor: colors.accent.orange + '30' }}>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] block truncate" style={{ color: colors.accent.red, fontFamily: "'Inter', sans-serif" }}>Courses</span>
                    <span className="text-sm font-bold block truncate" style={{ color: colors.primary.dark }}>
                      {courseStats[normalizeName(city.name)] ?? "--"}
                    </span>
                  </div>
                </div>

                {/* Explore label */}
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] opacity-0 group-hover:opacity-100 transition" style={{ color: colors.accent.red }}>
                  Explore →
                </span>
              </div>

              {/* ── DESKTOP card layout ── */}
              <div className="hidden sm:block">
                <div className="flex items-center gap-4 px-5 pt-5">
                  <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-inner">
                    <Image
                      src={city.image}
                      alt={`${city.name} icon`}
                      width={64}
                      height={64}
                      sizes="64px"
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-bold" style={{ color: colors.primary.dark }}>{city.name}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 px-5 pb-5 pt-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 shadow-sm border" style={{ borderColor: colors.accent.orange + '30' }}>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: colors.accent.red, fontFamily: "'Inter', sans-serif" }}>Colleges</span>
                        <span className="text-lg font-bold" style={{ color: colors.primary.dark }}>
                          {cityStats[normalizeName(city.name)] ?? "--"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 shadow-sm border" style={{ borderColor: colors.accent.orange + '30' }}>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.15em]" style={{ color: colors.accent.red, fontFamily: "'Inter', sans-serif" }}>Courses</span>
                        <span className="text-lg font-bold" style={{ color: colors.primary.dark }}>
                          {courseStats[normalizeName(city.name)] ?? "--"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-bold" style={{ color: colors.primary.dark }}>Explore colleges & courses</p>
                    <p className="text-xs text-gray-500">View curated lists and programs in {city.name}.</p>
                    <span className="text-[13px] font-bold uppercase tracking-[0.3em] opacity-0 transition group-hover:opacity-100" style={{ color: colors.accent.red }}>
                      Explore →
                    </span>
                  </div>
                </div>
              </div>

            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopStudyCities;


// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// interface CityCard {
//   name: string;
//   image: string;
//   slug?: string;
//   queryNames?: string[];
// }

// const CITIES: CityCard[] = [
//   { name: "Bengaluru", image: "/image/cities/bangalore.webp", queryNames: ["Bengaluru", "Bangalore"] },
//   { name: "Mumbai", image: "/image/cities/mumbai.webp" },
//   { name: "New Delhi", image: "/image/cities/delhi.webp", queryNames: ["Delhi NCR", "Delhi", "New Delhi"] },
//   { name: "Pune", image: "/image/cities/pune.webp" },
//   { name: "Hyderabad", image: "/image/cities/hyderbad.webp", queryNames: ["Hyderabad"] },
//   { name: "Chennai", image: "/image/cities/chennai.webp" },
//   { name: "Kolkata", image: "/image/cities/kolkata.webp" },
//   { name: "Ahmedabad", image: "/image/cities/ahmedabad.webp" },
// ];

// const normalizeName = (name: string) => name.toLowerCase().trim();
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// const buildApiUrl = (path: string) => {
//   if (!API_BASE_URL) return null;
//   try {
//     return new URL(path, API_BASE_URL).toString();
//   } catch {
//     return null;
//   }
// };

// const formatCity = (name: string) => {
//   return name
//     .split(" ")
//     .map((w, i) =>
//       i === 0
//         ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
//         : w.toLowerCase()
//     )
//     .join("+");
// };

// const TopStudyCities = () => {
//   const [cityStats, setCityStats] = useState<Record<string, number>>({});
//   const [courseStats, setCourseStats] = useState<Record<string, number>>({});

//   useEffect(() => {
//     const fetchCounts = async () => {
//       const collegesUrl = buildApiUrl("get/colleges/filter");
//       const coursesUrl = buildApiUrl("get/courses/count/by-city");

//       if (!collegesUrl || !coursesUrl) {
//         console.error(
//           "TopStudyCities: NEXT_PUBLIC_API_URL is missing or invalid.",
//           API_BASE_URL
//         );
//         setCityStats({});
//         setCourseStats({});
//         return;
//       }

//       try {
//         const [collegeResults, courseRes] = await Promise.all([
//           Promise.all(
//             CITIES.map(async (city) => {
//               const res = await fetch(collegesUrl, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                   cities: city.queryNames || [city.name],
//                   page: 1,
//                   limit: 1,
//                 }),
//               });
//               if (!res.ok) return { name: city.name, count: undefined };
//               const data = await res.json();
//               const total =
//                 data?.totalColleges ||
//                 data?.total ||
//                 data?.pagination?.total ||
//                 (Array.isArray(data?.allCollegeIds) ? data.allCollegeIds.length : undefined) ||
//                 (Array.isArray(data?.colleges) ? data.colleges.length : undefined) ||
//                 (typeof data?.totalPages === "number" && typeof data?.limit === "number"
//                   ? data.totalPages * data.limit
//                   : undefined);
//               return { name: city.name, count: Number.isFinite(total) ? Number(total) : undefined };
//             })
//           ),
//           fetch(coursesUrl, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ cities: CITIES.flatMap((c) => c.queryNames || [c.name]) }),
//           }),
//         ]);

//         const collegeMap: Record<string, number> = {};
//         collegeResults.forEach(({ name, count }) => {
//           if (count !== undefined && count !== null) collegeMap[normalizeName(name)] = count;
//         });
//         setCityStats(collegeMap);

//         if (courseRes.ok) {
//           const courseData = await courseRes.json();
//           const counts = courseData?.counts || {};
//           const normalized: Record<string, number> = {};
//           Object.entries(counts || {}).forEach(([key, value]) => {
//             if (value !== undefined && value !== null) normalized[normalizeName(key)] = value as number;
//           });
//           setCourseStats(normalized);
//         } else {
//           setCourseStats({});
//         }
//       } catch (e) {
//         console.error("Failed to fetch city stats", e);
//       }
//     };
//     fetchCounts();
//   }, []);

//   return (
//     <section className="relative py-8 sm:py-12">
//       <div className="absolute inset-0 bg-gradient-to-r from-[#fff1e7] via-[#f2e9ff] to-[#ece4ff]" />
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,214,106,0.35),_transparent_55%)]" />
//       <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 space-y-6 sm:space-y-8">

//         {/* Heading — compact on mobile */}
//         <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#c25541]">
//               Top Study Places
//             </p>
//             <h3 className="text-xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
//               Discover the cities students love the most
//             </h3>
//           </div>
//           <p className="text-xs sm:text-sm text-gray-500 max-w-md hidden sm:block">
//             Explore curated college lists by city and find programs that match your goals and lifestyle.
//           </p>
//         </div>

//         {/* 
//           Mobile:  2-column compact cards
//           Desktop: 4-column full cards — unchanged 
//         */}
//         <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
//           {CITIES.map((city, index) => (
//             <Link
//               key={city.name}
//               href={`/college?cities=${formatCity(city.slug || city.name)}`}
//               className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/60 bg-gradient-to-br from-white/90 to-white/60 shadow-[0_18px_40px_rgba(99,93,193,0.14)] transition hover:-translate-y-1.5"
//             >

//               {/* ── MOBILE card layout: horizontal icon + name, stats below ── */}
//               <div className="sm:hidden flex flex-col p-3 gap-2.5">
//                 {/* Icon + name row */}
//                 <div className="flex items-center gap-2.5">
//                   <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-inner">
//                     <Image
//                       src={city.image}
//                       alt={`${city.name} icon`}
//                       width={40}
//                       height={40}
//                       sizes="40px"
//                       className="h-full w-full object-contain p-1"
//                     />
//                   </div>
//                   <p className="text-sm font-bold text-gray-900 leading-tight">{city.name}</p>
//                 </div>

//                 {/* Stats row */}
//                 <div className="grid grid-cols-2 gap-2">
//                   <div className="rounded-xl bg-white/80 px-2 py-2 shadow-sm border border-orange-50 min-w-0 overflow-hidden">
//                     <span className="text-[8px] uppercase tracking-[0.1em] text-[#c25541] block truncate">Colleges</span>
//                     <span className="text-sm font-semibold text-gray-900 block truncate">
//                       {cityStats[normalizeName(city.name)] ?? "--"}
//                     </span>
//                   </div>
//                   <div className="rounded-xl bg-white/80 px-2 py-2 shadow-sm border border-orange-50 min-w-0 overflow-hidden">
//                     <span className="text-[8px] uppercase tracking-[0.1em] text-[#c25541] block truncate">Courses</span>
//                     <span className="text-sm font-semibold text-gray-900 block truncate">
//                       {courseStats[normalizeName(city.name)] ?? "--"}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Explore label */}
//                 <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c25541] opacity-0 group-hover:opacity-100 transition">
//                   Explore →
//                 </span>
//               </div>

//               {/* ── DESKTOP card layout: original — unchanged ── */}
//               <div className="hidden sm:block">
//                 <div className="flex items-center gap-4 px-5 pt-5">
//                   <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-inner">
//                     <Image
//                       src={city.image}
//                       alt={`${city.name} icon`}
//                       width={64}
//                       height={64}
//                       sizes="64px"
//                       className="h-full w-full object-contain p-2"
//                     />
//                   </div>
//                   <div>
//                     <p className="text-lg font-bold text-gray-900">{city.name}</p>
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-3 px-5 pb-5 pt-3">
//                   <div className="grid grid-cols-2 gap-3">
//                     <div className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 shadow-sm border border-orange-50">
//                       <div className="flex flex-col">
//                         <span className="text-[11px] uppercase tracking-[0.25em] text-[#c25541]">Colleges</span>
//                         <span className="text-lg font-semibold text-gray-900">
//                           {cityStats[normalizeName(city.name)] ?? "--"}
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 shadow-sm border border-orange-50">
//                       <div className="flex flex-col">
//                         <span className="text-[11px] uppercase tracking-[0.25em] text-[#c25541]">Courses</span>
//                         <span className="text-lg font-semibold text-gray-900">
//                           {courseStats[normalizeName(city.name)] ?? "--"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="flex flex-col gap-2">
//                     <p className="text-sm font-semibold text-gray-900">Explore colleges & courses</p>
//                     <p className="text-xs text-gray-600">View curated lists and programs in {city.name}.</p>
//                     <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c25541] opacity-0 transition group-hover:opacity-100">
//                       Explore →
//                     </span>
//                   </div>
//                 </div>
//               </div>

//             </Link>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TopStudyCities;
