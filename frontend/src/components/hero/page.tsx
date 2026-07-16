"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import HeroSearchBar from "./SearchBar";

export default function HeroSection() {
  const slides = [
    {
      primary: "Your Dream College is",
      secondary: "Just a Search Away",
      bgImage: "/image/heroo-bg.png"
    },
    {
      primary: "Guidance Shapes,",
      secondary: "Brighter Future.",
      bgImage: "/image/heroo-bg-2.png"
    },
    {
      primary: "Dream Bigger,",
      secondary: "Reach Higher.",
      bgImage: "/image/heroo-bg-3.png"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const headingVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } },
  };

  const bgVariants = {
    initial: { opacity: 0, scale: 1.05 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 1.05,
      transition: { duration: 0.5, ease: "easeIn" }
    }
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
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div
      className="
        relative flex items-center justify-start
        pt-[env(safe-area-inset-top)]
        min-h-[480px] sm:min-h-[520px] md:min-h-[580px] lg:min-h-[580px] xl:min-h-[600px] 2xl:min-h-[680px]
        px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16
        overflow-hidden
      "
    >
      {/* Background Image with Slide Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0 bg-cover sm:bg-left md:bg-center lg:bg-center xl:bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${slides[currentSlide].bgImage}')` }}
          variants={bgVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        />
      </AnimatePresence>

      {/* Content Container */}
      <div className="relative w-full max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl z-10 pt-2 sm:pt-4 md:pt-6 text-left">
        
        {/* Slide Content with Animation */}
        <div className="min-h-[80px] sm:min-h-[100px] md:min-h-[120px] lg:min-h-[140px] xl:min-h-[160px] mb-3 sm:mb-4 md:mb-5 lg:mb-6">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentSlide}
              className="font-extrabold leading-tight tracking-tight text-[1.8rem] sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl"
              variants={headingVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <span className="block overflow-hidden pb-0.5 sm:pb-1">
                <motion.span className="inline-flex flex-wrap justify-start">
                  {renderLine(slides[currentSlide].primary, false)}
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span className="inline-flex flex-wrap justify-start">
                  {renderLine(slides[currentSlide].secondary, true)}
                </motion.span>
              </span>
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl mb-4 sm:mb-5 md:mb-6">
          <HeroSearchBar />
        </div>

        {/* Stats Text */}
        <p className="font-normal leading-relaxed text-gray-700 text-xs sm:text-sm md:text-base lg:text-lg max-w-lg md:max-w-xl lg:max-w-2xl">
          Explore <span className="font-semibold text-gray-900">20,000+ colleges</span>,{" "}
          <span className="font-semibold text-gray-900">5,000+ courses</span> and find the perfect match for your career.
        </p>
      </div>

      {/* Navigation - Full Right Bottom Corner */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 right-4 sm:right-6 md:right-8 lg:right-12 xl:right-16 flex items-center gap-3 z-20">
        {/* Prev Button */}
        <button
          onClick={prevSlide}
          className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/90 hover:bg-white shadow-md hover:shadow-lg flex items-center justify-center text-[#003366] hover:text-[#E65C00] transition-all duration-300 border border-gray-200"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Slide Indicators */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index
                  ? "w-6 sm:w-7 md:w-8 h-1.5 sm:h-2 bg-[#E65C00]"
                  : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/90 hover:bg-white shadow-md hover:shadow-lg flex items-center justify-center text-[#003366] hover:text-[#E65C00] transition-all duration-300 border border-gray-200"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import HeroSearchBar from "./SearchBar";

// export default function HeroSection() {
//   const quoteSlides = [
//     { primary: "Your Dream College is", secondary: "Just a Search Away" },
//     { primary: "Guidance Shapes,", secondary: "Brighter Future." },
//     { primary: "Dream Bigger,", secondary: "Reach Higher." },
//   ];

//   const [quoteIndex, setQuoteIndex] = useState(0);

//   const headingVariants = {
//     initial: { opacity: 0, y: 20 },
//     animate: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.3, ease: "easeOut" },
//     },
//     exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
//   };

//   const letterVariants = {
//     initial: { opacity: 0, y: 22, rotate: 6 },
//     animate: (i: number) => ({
//       opacity: 1,
//       y: [0, -6, 0],
//       rotate: [0, -1.5, 0],
//       transition: { delay: i * 0.025, duration: 0.7, ease: [0.65, 0, 0.35, 1] },
//     }),
//     exit: { opacity: 0, y: -18, rotate: -3, transition: { duration: 0.2 } },
//   };

//   const renderLine = (line: string, isAccentLine: boolean) =>
//     line.split(" ").map((word, wIdx, wordsArr) => {
//       const isLastTwoWords = wIdx >= wordsArr.length - 2;
//       return (
//         <span key={`${word}-${wIdx}`} className="inline-block whitespace-nowrap mr-[0.25em]">
//           {word.split("").map((char, cIdx) => (
//             <motion.span
//               key={`${char}-${cIdx}`}
//               variants={letterVariants}
//               custom={cIdx}
//               initial="initial"
//               animate="animate"
//               exit="exit"
//               className={`inline-block ${isAccentLine && isLastTwoWords ? "text-[#E65C00]" : "text-[#003366]"}`}
//             >
//               {char}
//             </motion.span>
//           ))}
//         </span>
//       );
//     });

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setQuoteIndex((prev) => (prev + 1) % quoteSlides.length);
//     }, 6000);
//     return () => clearInterval(timer);
//   }, [quoteSlides.length]);

//   return (
//     <div
//       className="
//         relative flex items-center justify-start
//         pt-[env(safe-area-inset-top)]
//         h-[calc(100vh-25vh)] px-5
//         md:h-[calc(100vh-20vh)] md:px-16 lg:px-14
//         bg-cover bg-center bg-no-repeat
//       "
//       style={{ backgroundImage: "url('/image/heroo-bg.png')" }}
//     >
//       {/* Light Overlay to ensure content readability */}
//       {/* <div className="absolute inset-0 bg-white/40 pointer-events-none z-0" /> */}

//       {/* Main Content Layout Container */}
//       <div className="relative w-full max-w-2xl md:max-w-3xl z-10 pt-4 text-left ml-0 sm:pt-12">
        
//         {/* Iterating Typography Header Box */}
//         <div className="min-h-[85px] sm:min-h-[130px] mb-6 md:mb-8">
//           <AnimatePresence mode="wait">
//             <motion.h1
//               key={`${quoteSlides[quoteIndex].primary}-${quoteSlides[quoteIndex].secondary}`}
//               className="font-extrabold leading-tight tracking-tight text-[1.95rem] sm:text-3xl md:text-4xl lg:text-[2.85rem] xl:text-[3.4rem]"
//               variants={headingVariants}
//               initial="initial"
//               animate="animate"
//               exit="exit"
//             >
//               <span className="block overflow-hidden pb-1">
//                 <motion.span className="inline-flex flex-wrap justify-start">
//                   {renderLine(quoteSlides[quoteIndex].primary, false)}
//                 </motion.span>
//               </span>
//               <span className="block overflow-hidden">
//                 <motion.span className="inline-flex flex-wrap justify-start">
//                   {renderLine(quoteSlides[quoteIndex].secondary, true)}
//                 </motion.span>
//               </span>
//             </motion.h1>
//           </AnimatePresence>
//         </div>

//         {/* Modular Tab-Based Functional Search Component */}
//         <div className="w-full max-w-xl md:max-w-2xl mb-6 md:mb-8">
//           <HeroSearchBar />
//         </div>

//         {/* Secondary Details Description Text Block */}
//         <p className="font-normal leading-relaxed text-gray-700 text-sm sm:text-base md:text-lg max-w-lg md:max-w-xl">
//           Explore <span className="font-semibold text-gray-900">20,000+ colleges</span>,{" "}
//           <span className="font-semibold text-gray-900">5,000+ courses</span> and find the perfect match for your career.
//         </p>
//       </div>
//     </div>
//   );
// }