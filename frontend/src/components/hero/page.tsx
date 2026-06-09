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
    { primary: "Guidance Shapes,", secondary: "Brighter Future." },
    { primary: "Dream Bigger,", secondary: "Reach Higher." },
    { primary: "Curiosity Sparks,", secondary: "Innovative Journeys." },
    { primary: "Focused Choices,", secondary: "Limitless Careers." },
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
    <div
      className="
      relative flex items-center justify-start
      bg-gradient-to-r from-blue-50 to-orange-100
      pt-[env(safe-area-inset-top)]

      /* Mobile: shorter height, centered content */
      h-[calc(100vh-40vh)] px-5
      
      /* Desktop: original height and padding — unchanged */
      md:h-[calc(100vh-28vh)] md:px-16 lg:px-24
    "
    >
      {/* Background Image */}
      <Image
        src="/image/2a.webp"
        alt="Hero Image"
        fill
        priority
        loading="eager"
        sizes="100vw"
        className="object-cover opacity-80"
      />

      {/* Content */}
      <div
        className="
        relative w-full max-w-4xl

        /* Mobile: left-aligned, less top padding */
        pt-10 text-left ml-0

        /* Desktop: left-aligned, original spacing — unchanged */
        sm:pt-28 sm:text-left sm:ml-8
      "
      >
        {/* Animated heading */}
        <div className="min-h-[90px] sm:min-h-[140px]">
          <AnimatePresence mode="wait">
            <motion.h1
              key={`${quoteSlides[quoteIndex].primary}-${quoteSlides[quoteIndex].secondary}`}
              className="
                font-extrabold leading-tight tracking-tight text-[#141019] mb-4

                /* Mobile: smaller, readable size */
                text-[1.75rem]

                /* Desktop: original responsive sizes — unchanged */
                sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl sm:mb-6
              "
              variants={headingVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <span className="block overflow-hidden">
                <motion.span className="inline-flex flex-wrap justify-start">
                  {renderLine(quoteSlides[quoteIndex].primary)}
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span className="inline-flex flex-wrap justify-start">
                  {renderLine(quoteSlides[quoteIndex].secondary)}
                </motion.span>
              </span>
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Subtext */}
        <p
          className="
  font-light leading-relaxed text-gray-800 mb-5
  text-sm
  sm:text-lg md:text-xl lg:text-2xl xl:text-3xl sm:mb-8
"
        >
          Helping students and parents find the
          <br className="sm:hidden" />
          right college
          <br className="hidden sm:block" />
          Shaping India's future, <br className="sm:hidden" />
          <span className="text-[#D25C40] font-semibold">
            one student at a time.
          </span>
        </p>

        {/* CTA Buttons */}
        <div
          className="
          flex gap-3 pt-2

          /* Mobile: side-by-side horizontal row */
          flex-row items-center justify-start

          /* Desktop: side-by-side, left-aligned — unchanged */
          sm:flex-row sm:items-start sm:justify-start sm:gap-4 sm:pt-4 sm:mb-10
        "
        >
          <Link href="/college" className="w-auto">
            <Button
              className="
              group bg-[#D25C40] text-white font-semibold rounded-xl shadow-lg
              transition-all duration-300 border border-transparent
              hover:bg-[#FFF7ED] hover:text-[#D25C40] hover:border-[#D25C40]
              flex items-center justify-center gap-2

              /* Mobile: auto width, no text wrap */
              py-2.5 text-[11px] px-4 

              /* Desktop: auto width — unchanged */
              sm:text-lg sm:px-8 sm:py-4 sm:gap-3
            "
            >
              Find Your College
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>

          <div className="relative inline-block w-auto">
            <Link href="/courses" className="w-auto">
              <Button
                className="
                group bg-[#635dc1] text-white font-semibold rounded-xl shadow-lg
                transition duration-300 hover:bg-[#4c46a4] border border-transparent
                flex items-center justify-center gap-2

                /* Mobile: auto width, no text wrap */
                py-2.5 text-[11px] px-4 

                /* Desktop: auto width — unchanged */
                sm:text-lg sm:px-8 sm:py-4 sm:gap-3
              "
              >
                <span>Course Finder</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>

            {/* NEW badge — repositioned for mobile */}
            <span
              className="
              absolute rounded-full bg-white text-[#635dc1] font-semibold shadow

              /* Mobile: top-right of button */
              -top-2 -right-2 px-2 py-0.5 text-[10px]

              /* Desktop: original position — unchanged */
              sm:-top-2 sm:-right-2 sm:text-xs sm:px-2.5
            "
            >
              NEW
            </span>
          </div>
        </div>

        {/* Mobile: slide indicator dots */}
        <div className="flex justify-start gap-1.5 mt-5 sm:hidden">
          {quoteSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setQuoteIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === quoteIndex ? "w-5 bg-[#D25C40]" : "w-1.5 bg-gray-400/50"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
