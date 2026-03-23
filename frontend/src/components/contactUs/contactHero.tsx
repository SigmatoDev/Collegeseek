'use client';

import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <section
      className="relative bg-center bg-cover bg-no-repeat flex items-center justify-center
        h-[35vh]
        md:h-[50vh]
      "
      style={{ backgroundImage: "url('/image/6.avif')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 backdrop-blur-sm z-10" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-20 text-center text-white max-w-3xl
          px-5 
          md:px-4
        "
      >
        <h1 className="font-extrabold mb-3 leading-tight
          text-2xl
          md:text-4xl md:mb-4 lg:text-6xl
        ">
          Let's Connect
        </h1>
        <p className="text-gray-200
          text-sm leading-relaxed
          md:text-lg lg:text-xl
        ">
          Have questions, suggestions, or need help finding your ideal college?
          {" "}
          <span className="hidden sm:inline">We're here to assist you every step of the way.</span>
          <span className="sm:hidden">We're here to help.</span>
        </p>
      </motion.div>
    </section>
  );
}