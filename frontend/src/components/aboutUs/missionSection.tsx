// 'use client';

// import { motion } from "framer-motion";

// const MissionSection = () => {
//   return (
//     <section className="py-24 bg-gradient-to-br from-white via-[#ffffff] to-white text-gray-800">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl font-extrabold leading-tight md:text-5xl text-[#39317E]">
//             What Drives Us
//           </h2>
//           <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
//             We strive to support students on their path to greatness by providing clear guidance and opportunities.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//           <motion.div
//             className="bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-xl border-t-4 border-[#39317E]"
//             whileHover={{ scale: 1.03 }}
//             transition={{ duration: 0.3 }}
//           >
//             <h3 className="text-3xl font-bold text-[#39317E]">Our Mission</h3>
//             <p className="mt-6 text-lg text-gray-700 leading-relaxed">
//               We are dedicated to helping students discover the best educational institutions that align with their aspirations, skills, and career ambitions. Together, we create pathways to success.
//             </p>
//           </motion.div>

//           <motion.div
//             className="bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-xl border-t-4 border-[#D3634C]"
//             whileHover={{ scale: 1.03 }}
//             transition={{ duration: 0.3, delay: 0.1 }}
//           >
//             <h3 className="text-3xl font-bold text-[#D3634C]">Our Vision</h3>
//             <p className="mt-6 text-lg text-gray-700 leading-relaxed">
//               To empower students with the knowledge and resources they need to make informed decisions about their educational journey, ultimately leading them to fulfilling careers and personal growth.
//             </p>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default MissionSection;
'use client';

import { motion } from "framer-motion";

const MissionSection = () => {
  return (
    <section className="bg-gradient-to-br from-white via-[#f8f7ff] to-white text-gray-800
      py-12 px-4
      sm:py-24 sm:px-6
    ">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="inline-flex items-center rounded-full border border-[#39317E]/20 bg-[#f0effe] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#39317E] mb-3">
            Our purpose
          </span>
          <h2 className="font-extrabold leading-tight text-[#39317E]
            text-2xl sm:text-4xl md:text-5xl
          ">
            What Drives Us
          </h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto
            text-sm sm:text-lg sm:mt-4
          ">
            We strive to support students on their path to greatness by providing clear guidance and opportunities.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 sm:gap-8
          grid-cols-1 md:grid-cols-2
        ">

          {/* Mission card */}
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-white border border-[#39317E]/10 shadow-lg flex flex-col"
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.3 }}
          >
            {/* Top accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#39317E] to-[#635dc1]" />

            <div className="p-5 sm:p-10 flex flex-col h-full">
              {/* Icon */}
              <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[#f0effe] mb-4 sm:mb-5">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#39317E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#39317E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <h3 className="font-bold text-[#39317E]
                text-xl sm:text-3xl
              ">
                Our Mission
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed
                text-sm sm:text-lg sm:mt-5
              ">
                We are dedicated to helping students discover the best educational institutions that align with their aspirations, skills, and career ambitions. Together, we create pathways to success.
              </p>

              {/* Bottom tag */}
              <div className="mt-auto pt-5 sm:pt-8 flex flex-wrap gap-2">
                {["Student-first", "Clear guidance", "Real results"].map((tag) => (
                  <span key={tag} className="inline-flex items-center rounded-full bg-[#f0effe] border border-[#39317E]/15 px-3 py-1 text-[11px] font-semibold text-[#39317E]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Vision card */}
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-white border border-[#fd4c00]/10 shadow-lg flex flex-col"
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            {/* Top accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#fd4c00] to-[#f97316]" />

            <div className="p-5 sm:p-10 flex flex-col h-full">
              {/* Icon */}
              <div className="flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[#FFF7ED] mb-4 sm:mb-5">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" stroke="#fd4c00" strokeWidth="1.8"/>
                  <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M17.66 6.34l-1.41 1.41M4.93 19.07l1.41-1.41" stroke="#fd4c00" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>

              <h3 className="font-bold text-[#fd4c00]
                text-xl sm:text-3xl
              ">
                Our Vision
              </h3>
              <p className="mt-3 text-gray-600 leading-relaxed
                text-sm sm:text-lg sm:mt-5
              ">
                To empower students with the knowledge and resources they need to make informed decisions about their educational journey, ultimately leading them to fulfilling careers and personal growth.
              </p>

              {/* Bottom tag */}
              <div className="mt-auto pt-5 sm:pt-8 flex flex-wrap gap-2">
                {["Informed choices", "Career growth", "Long-term success"].map((tag) => (
                  <span key={tag} className="inline-flex items-center rounded-full bg-[#FFF7ED] border border-[#fd4c00]/15 px-3 py-1 text-[11px] font-semibold text-[#fd4c00]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default MissionSection;