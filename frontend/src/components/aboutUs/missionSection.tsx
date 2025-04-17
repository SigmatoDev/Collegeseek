'use client';

import { motion } from "framer-motion";

const MissionSection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-white via-[#ffffff] to-white text-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold leading-tight md:text-5xl text-indigo-700">
            What Drives Us
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We strive to support students on their path to greatness by providing clear guidance and opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            className="bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-xl border-t-4 border-indigo-500"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-3xl font-bold text-indigo-600">Our Mission</h3>
            <p className="mt-6 text-lg text-gray-700 leading-relaxed">
              We are dedicated to helping students discover the best educational institutions that align with their aspirations, skills, and career ambitions. Together, we create pathways to success.
            </p>
          </motion.div>

          <motion.div
            className="bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-xl border-t-4 border-emerald-500"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3 className="text-3xl font-bold text-emerald-600">Our Vision</h3>
            <p className="mt-6 text-lg text-gray-700 leading-relaxed">
              To empower students with the knowledge and resources they need to make informed decisions about their educational journey, ultimately leading them to fulfilling careers and personal growth.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
