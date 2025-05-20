"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative h-screen pt-[env(safe-area-inset-top)] flex items-center justify-start bg-gradient-to-r from-yellow-200 to-orange-200 px-4 sm:px-6 md:px-16 lg:px-24">
      {/* Background Image */}
      <Image
        src="/image/2a.webp"
        alt="Hero Image"
        fill
        className="object-cover opacity-55"
      />

      {/* Content */}
      <div className="relative text-left text-black max-w-4xl w-full ml-0 sm:ml-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-6 font-extrabold leading-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)] tracking-tight">
          Guidance Shapes,
          <br />
          Brighter Future.
        </h1>

        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-8 font-light leading-relaxed text-gray-800">
          Helping students and parents find the right college.
          <br className="hidden sm:block" />
          Shaping India’s future, <br className="sm:hidden" />
          <span className="text-[#D25C40] font-semibold">
            one student at a time.
          </span>
        </p>

        <div className="pt-4 mb-[110px]">
          <Link href="/college">
            <Button className="bg-[#D25C40] text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-xl shadow-lg transition-all duration-300 border border-transparent hover:bg-[#FFF7ED] hover:text-[#D25C40] hover:border-[#D25C40]">
  Find Your College
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
