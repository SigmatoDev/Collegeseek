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
    <div className="relative h-screen flex items-center justify-start bg-gradient-to-r from-yellow-200 to-orange-200 px-6 md:px-16 lg:px-24">
      {/* Background Image */}
      <Image
        src="/image/2.png"
        alt="Hero Image"
        layout="fill"
        objectFit="cover"
        className="opacity-40"
      />

      {/* Content */}
      <div className="relative text-left text-black max-w-2xl">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg">
          Guidance Shapes, <br /> Brighter Future.
        </h1>
        <p className="text-lg md:text-2xl mb-6 font-light leading-relaxed">
          Helping students and parents find the right college. <br />
          Shaping India’s future,{" "}
          <span className="text-yellow-600 font-semibold">
            one student at a time.
          </span>
        </p>

        {/* Buttons */}
        <div className="flex space-x-4">
          <Link href="/college">
             <Button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 font-semibold rounded-lg shadow-xl transition-all duration-300">
             Find Your College
             </Button>
          </Link>
          {/* <Button className="border border-yellow-600 text-yellow-600 px-6 py-3 font-semibold rounded-lg shadow-xl hover:bg-yellow-600 hover:text-white transition-all duration-300">
            Get Job Ready Degree
          </Button> */}
        </div>

        {/* Watch Video Link */}
        {/* <p
          className="mt-6 text-yellow-700 underline cursor-pointer hover:text-yellow-500 transition duration-300 text-lg"
          onClick={() => setIsOpen(true)}
        >
          ▶ Watch our brand film
        </p> */}
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
                className="w-full h-[250px] md:h-[400px] lg:h-[500px] rounded-2xl"
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
