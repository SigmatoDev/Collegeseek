"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  const [isOpen, setIsOpen] = useState(false);
  const quoteSlides = [
    {
      primary: "Guidance Shapes,",
      secondary: "Brighter Future.",
    },
    {
      primary: "Dream Bigger,",
      secondary: "Reach Higher.",
    },
    {
      primary: "Curiosity Sparks,",
      secondary: "Innovative Journeys.",
    },
    {
      primary: "Focused Choices,",
      secondary: "Limitless Careers.",
    },
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
      transition: {
        delay: i * 0.025,
        duration: 0.7,
        ease: [0.65, 0, 0.35, 1],
      },
    }),
    exit: { opacity: 0, y: -18, rotate: -3, transition: { duration: 0.2 } },
  };

  const renderLine = (line: string) =>
    line.split("").map((char, index) => (
      <motion.span
        key={`${char}-${index}`}
        variants={letterVariants}
        custom={index}
        initial="initial"
        animate="animate"
        exit="exit"
        className="inline-block"
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ));

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quoteSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [quoteSlides.length]);

  return (
    <div className="relative h-[calc(100vh-28vh)] pt-[env(safe-area-inset-top)] flex items-center justify-start bg-gradient-to-r from-blue-50 to-orange-100 px-4 sm:px-6 md:px-16 lg:px-24">
      {/* Background Image */}
      <Image
        src="/image/2a.webp"
        alt="Hero Image"
        fill
        className="object-cover opacity-80"
      />

      {/* Content */}
      <div className="relative pt-28 text-left text-black max-w-4xl w-full ml-0 sm:ml-8">
        <div className="min-h-[140px]">
          <AnimatePresence mode="wait">
            <motion.h1
              key={`${quoteSlides[quoteIndex].primary}-${quoteSlides[quoteIndex].secondary}`}
              className="text-2xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl mb-6 font-extrabold leading-tight tracking-tight text-[#141019]"
              variants={headingVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <span className="block overflow-hidden">
                <motion.span
                  className="inline-flex flex-wrap"
                  initial={false}
                  animate="animate"
                  exit="exit"
                >
                  {renderLine(quoteSlides[quoteIndex].primary)}
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  className="inline-flex flex-wrap"
                  initial={false}
                  animate="animate"
                  exit="exit"
                >
                  {renderLine(quoteSlides[quoteIndex].secondary)}
                </motion.span>
              </span>
            </motion.h1>
          </AnimatePresence>
        </div>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-8 font-light leading-relaxed text-gray-800">
          Helping students and parents find the right college.
          <br className="hidden sm:block" />
          Shaping India’s future, <br className="sm:hidden" />
          <span className="text-[#D25C40] font-semibold">
            one student at a time.
          </span>
        </p>

        <div className="pt-4 mb-[110px] flex flex-wrap gap-4">
          <Link href="/college">
            <Button className="group bg-[#D25C40] text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-xl shadow-lg transition-all duration-300 border border-transparent hover:bg-[#FFF7ED] hover:text-[#D25C40] hover:border-[#D25C40] flex items-center gap-3">
              Find Your College
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>

          <Link href="/courses" className="relative">
            <Button className="group bg-[#635dc1] text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-xl shadow-lg transition duration-300 hover:bg-[#4c46a4] border border-transparent flex items-center gap-3">
              <span>Course Finder</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              <span className="absolute -top-3 -right-3 rounded-full bg-white text-[#635dc1] px-3 py-0.5 text-xs font-semibold shadow">
                NEW
              </span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="relative bg-gray-900 rounded-2xl shadow-2xl overflow-hidden w-[90%] md:w-[60%] lg:w-[50%]"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition duration-300"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>

              {/* Embedded Video */}
              <iframe
                className="w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] rounded-2xl"
                src="https://www.youtube.com/embed/your-video-id"
                title="Brand Film"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
