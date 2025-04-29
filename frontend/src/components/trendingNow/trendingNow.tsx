"use client";
import React from "react";

interface TrendingNowProps {
  exams: string[];
}

const TrendingNow: React.FC<TrendingNowProps> = ({ exams }) => {
  const repeatedExams = [...exams, ...exams]; // duplicate for seamless scroll

  return (
    <section className="relative w-full bg-[#fcfcfd] py-[30px] border-y border-gray-200 overflow-hidden">
      {/* Title */}
      <div className="flex justify-center">  
        <h2 className="text-4xl font-semibold text-gray-800 flex items-center py-2 gap-2">
          Trending Now
        </h2>
      </div>

      {/* Scrolling Section */}
      <div className="group relative w-full overflow-hidden py-7">
        {/* Gradient Edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10" />

        {/* Marquee Container */}
        <div className="whitespace-nowrap animate-marquee group-hover:pause flex w-max gap-6 px-6">
          {repeatedExams.map((exam, index) => (
            <span
              key={index}
              className="inline-flex items-center bg-yellow-100 hover:bg-blue-100 transition duration-300 ease-in-out transform hover:scale-105 rounded-full px-4 md:px-6 py-2 text-sm md:text-lg text-[#D25C40] font-medium shadow-md hover:shadow-lg"
              aria-label={`Trending exam: ${exam}`}
            >
              {exam}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingNow;
