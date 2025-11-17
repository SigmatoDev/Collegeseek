// "use client";
// import React from "react";

// interface TrendingNowProps {
//   exams: string[];
// }

// const TrendingNow: React.FC<TrendingNowProps> = ({ exams }) => {
//   const repeatedExams = [...exams, ...exams]; // duplicate for seamless scroll

//   return (
//     <section className="relative w-full bg-[#fcfcfd] py-[30px] border-y border-gray-200 overflow-hidden">
//       {/* Title */}
//       <div className="flex justify-center">
//   {/* <h2 className="relative text-4xl font-bold text-[#D36146] px-6 py-2 rounded-[50px] border-2 border-[#D36146] overflow-hidden z-10 bg-gradient-to-r from-white to-white shadow-lg">
//     <span className="relative z-10">Trending Now</span>
//   </h2> */}
//      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-[20px]">
//          Trending Now
//         </h2>

// </div>




//       {/* Scrolling Section */}
//       <div className="group relative w-full overflow-hidden ">
//         {/* Gradient Edges */}
//         <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10" />
//         <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10" />

  

//         {/* Marquee Container */}
//         <div className="whitespace-nowrap animate-marquee group-hover:pause flex w-max gap-6 px-6 mt-6 mb-3">
//           {repeatedExams.map((exam, index) => (
//             <span
//               key={index}
//               className="inline-flex items-center bg-white hover:bg-[#FFF7ED] transition duration-300 ease-in-out transform hover:scale-105 
//                  rounded-full px-4 md:px-6 py-2 text-sm md:text-lg text-black font-medium shadow-md hover:shadow-lg 
//                  border border-black" // <-- Added border here
//               aria-label={`Trending exam: ${exam}`}
//             >
//               {exam}
//             </span>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TrendingNow;
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { api_url } from "@/utils/apiCall";
import { Loader, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";

interface TrendingEntry {
  name: string;
  link?: string;
}

const TrendingNow = () => {
  const [exams, setExams] = useState<TrendingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrendingExams = async () => {
      try {
        const response = await axios.get(`${api_url}get/trendingNow`);
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
        console.error("❌ Error fetching trending exams:", err);
        setError("Failed to fetch trending exams.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingExams();
  }, []);

  const repeatedExams = [...exams, ...exams];
  const accentDots = ["bg-[#F97316]", "bg-[#D946EF]", "bg-[#0EA5E9]", "bg-[#22C55E]"];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#fef9f6] to-[#ffeee9]">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-10 left-1/4 h-40 w-40 rounded-full bg-[#ffeee9] blur-3xl" />
        <div className="absolute top-10 right-1/4 h-52 w-52 rounded-full bg-[#ffeee9] blur-[90px]" />
      </div>

      <div className="relative mx-auto flex max-w-8xl flex-col items-center text-center">
        

      

        <div className="group relative w-full overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#fef9f6] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#fbf6ff] to-transparent" />

          <div className="whitespace-nowrap animate-marquee group-hover:pause flex w-max gap-6 px-10 py-6 text-base">
            {repeatedExams.map((exam, index) => {
              const fallbackHref = `/college?streams=${encodeURIComponent(
                exam.name
              )}`;
              const href = exam.link?.trim() ? exam.link : fallbackHref;
              const isExternal = /^https?:\/\//i.test(href);

              return (
                <Link
                  key={`${exam.name}-${index}`}
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-3 rounded-full border border-white/60 bg-white/90 px-6 py-3 text-base font-semibold text-gray-900 shadow-[0_12px_30px_rgba(210,92,64,0.18)] transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_15px_45px_rgba(210,92,64,0.28)]"
                  aria-label={`Explore ${exam.name}`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      accentDots[index % accentDots.length]
                    }`}
                  />
                  {exam.name}
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-400">
                    explore
                  </span>
                </Link>
              );
            })}
            {exams.length === 0 && (
              <span className="text-gray-500">No trends available right now.</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingNow;
