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
      <div className="flex justify-center my-10">
  <h2 className="relative text-4xl font-bold text-[#D36146] px-6 py-2 rounded-[50px] border-2 border-[#D36146] overflow-hidden z-10 bg-gradient-to-r from-white to-white shadow-lg">
    <span className="relative z-10">Trending Now</span>
  </h2>
</div>




      {/* Scrolling Section */}
      <div className="group relative w-full overflow-hidden ">
        {/* Gradient Edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent z-10" />

  

        {/* Marquee Container */}
        <div className="whitespace-nowrap animate-marquee group-hover:pause flex w-max gap-6 px-6 mt-6 mb-3">
          {repeatedExams.map((exam, index) => (
            <span
              key={index}
              className="inline-flex items-center bg-white hover:bg-[#FFF7ED] transition duration-300 ease-in-out transform hover:scale-105 
                 rounded-full px-4 md:px-6 py-2 text-sm md:text-lg text-[#D36146] font-medium shadow-md hover:shadow-lg 
                 border border-[#D25C40]" // <-- Added border here
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
