"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSearchBar from "./SearchBar";

export default function HeroSection() {
  const quoteSlides = [
    { primary: "Your Dream College is", secondary: "Just a Search Away" },
    { primary: "Guidance Shapes,", secondary: "Brighter Future." },
    { primary: "Dream Bigger,", secondary: "Reach Higher." },
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);

  const headingVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  const letterVariants = {
    initial: { opacity: 0, y: 22, rotate: 6 },
    animate: (i: number) => ({
      opacity: 1,
      y: [0, -6, 0],
      rotate: [0, -1.5, 0],
      transition: { delay: i * 0.025, duration: 0.7, ease: [0.65, 0, 0.35, 1] },
    }),
    exit: { opacity: 0, y: -18, rotate: -3, transition: { duration: 0.2 } },
  };

  const renderLine = (line: string, isAccentLine: boolean) =>
    line.split(" ").map((word, wIdx, wordsArr) => {
      const isLastTwoWords = wIdx >= wordsArr.length - 2;
      return (
        <span key={`${word}-${wIdx}`} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split("").map((char, cIdx) => (
            <motion.span
              key={`${char}-${cIdx}`}
              variants={letterVariants}
              custom={cIdx}
              initial="initial"
              animate="animate"
              exit="exit"
              className={`inline-block ${isAccentLine && isLastTwoWords ? "text-[#E65C00]" : "text-[#003366]"}`}
            >
              {char}
            </motion.span>
          ))}
        </span>
      );
    });

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quoteSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [quoteSlides.length]);

  return (
    <div
      className="
        relative flex items-center justify-start
        pt-[env(safe-area-inset-top)]
        h-[calc(100vh-25vh)] px-5
        md:h-[calc(100vh-20vh)] md:px-16 lg:px-14
        bg-cover bg-center bg-no-repeat
      "
      style={{ backgroundImage: "url('/image/heroo-bg.png')" }}
    >
      {/* Light Overlay to ensure content readability */}
      {/* <div className="absolute inset-0 bg-white/40 pointer-events-none z-0" /> */}

      {/* Main Content Layout Container */}
      <div className="relative w-full max-w-2xl md:max-w-3xl z-10 pt-4 text-left ml-0 sm:pt-12">
        
        {/* Iterating Typography Header Box */}
        <div className="min-h-[85px] sm:min-h-[130px] mb-6 md:mb-8">
          <AnimatePresence mode="wait">
            <motion.h1
              key={`${quoteSlides[quoteIndex].primary}-${quoteSlides[quoteIndex].secondary}`}
              className="font-extrabold leading-tight tracking-tight text-[1.95rem] sm:text-3xl md:text-4xl lg:text-[2.85rem] xl:text-[3.4rem]"
              variants={headingVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <span className="block overflow-hidden pb-1">
                <motion.span className="inline-flex flex-wrap justify-start">
                  {renderLine(quoteSlides[quoteIndex].primary, false)}
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span className="inline-flex flex-wrap justify-start">
                  {renderLine(quoteSlides[quoteIndex].secondary, true)}
                </motion.span>
              </span>
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Modular Tab-Based Functional Search Component */}
        <div className="w-full max-w-xl md:max-w-2xl mb-6 md:mb-8">
          <HeroSearchBar />
        </div>

        {/* Secondary Details Description Text Block */}
        <p className="font-normal leading-relaxed text-gray-700 text-sm sm:text-base md:text-lg max-w-lg md:max-w-xl">
          Explore <span className="font-semibold text-gray-900">20,000+ colleges</span>,{" "}
          <span className="font-semibold text-gray-900">5,000+ courses</span> and find the perfect match for your career.
        </p>
      </div>
    </div>
  );
}