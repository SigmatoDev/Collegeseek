'use client';

import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <section
      className="relative h-[50vh] bg-center bg-cover bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: "url('/image/6.avif')" }} // ✅ CORRECT path
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 backdrop-blur-sm z-10" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-20 text-center text-white px-4 max-w-3xl"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
          Let’s Connect
        </h1>
        <p className="text-lg md:text-xl text-gray-200">
          Have questions, suggestions, or need help finding your ideal college? We're here to assist you every step of the way.
        </p>
      </motion.div>
    </section>
  );
}
