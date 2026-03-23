// // components/AdveSection.tsx

// import Image from 'next/image';
// import React from 'react';

// // Assuming adveImg is the image file you want to display
// import adveImg from '../../../public/image/005 (1).png'; // Adjust the path accordingly

// const AdveSection: React.FC = () => {
//   return (
//     <section className="w-full bg-gradient-to-r from-orange-50 via-orange-100 to-orange-50 md:px-16 py-24  ">
//       {/* Title and Image Section */}
//       <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-16 mb-16">
//         {/* Image Section */}
//         <div className="md:w-[770px] relative group">
//           <div className="relative overflow-hidden rounded-xl shadow-lg transform transition duration-500 ease-in-out hover:shadow-xl">
//             <Image
//               src={adveImg}
//               alt="Students working on laptop"
//               className="object-cover w-full h-full"
//               placeholder="blur"
//               sizes="(max-width: 768px) 80vw, 50vw"
//               style={{ height: '500px' }}
//             />
//           </div>
//           {/* Hover Overlay */}
//           {/* <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 ease-in-out"></div> */}
//         </div>

//         {/* Text Content */}
//         <div className="md:w-1/2 text-center md:text-left space-y-8">
//           <h1 className="text-4xl md:text-5xl font-extrabold text-[#39317E] mb-4">
//             About Us
//           </h1>
//           <p className="text-lg text-gray-700 mt-4 mb-6 leading-relaxed">
//             Welcome to Collegeseeker, the ultimate platform designed to help students, parents, and educators easily navigate the world of higher education. Our mission is to provide comprehensive, accurate, and up-to-date information about colleges and universities across the country, making the college search process simpler and more accessible.
//             <br />
//             <br />
//             Our platform is built with the idea that every student deserves the best possible education. We provide an easy-to-use interface with powerful filtering tools to help students find the perfect college that fits their unique needs and aspirations. Whether you're looking for colleges in a specific state, with a particular specialization, or based on ranking and fees, we have you covered.
//           </p>
//         </div>
//       </div>

//       {/* Content Boxes Section */}
//       <div className="flex flex-col md:flex-row gap-16 mb-8  pt-10 ">
//         {/* First Box Content: Who We Are */}
//         <div className="p-8 bg-white border border-blue-100 rounded-xl shadow-lg space-y-6 mb-8 md:mb-0 hover:shadow-xl transition-shadow duration-300 ease-in-out">
//           <h2 className="text-3xl font-extrabold text-[#39317E] mb-4">
//             Who We Are
//           </h2>
//           <p className="text-lg text-gray-700 leading-relaxed">
//             We are a dynamic team of professionals, each with a shared vision to provide innovative solutions and services. Our collective knowledge drives our passion for helping our clients succeed.
//           </p>
//           <p className="text-lg text-gray-700 leading-relaxed">
//             With a focus on collaboration, creativity, and continuous improvement, we work together to bring the best results to our clients. Our team is constantly evolving, ensuring that we stay ahead in providing exceptional services.
//           </p>
//         </div>

//         {/* Second Box Content: What We Do */}
//         <div className="p-8 bg-white border border-indigo-100 rounded-xl shadow-lg space-y-6 hover:shadow-xl transition-shadow duration-300 ease-in-out">
//           <h2 className="text-3xl font-extrabold text-[#39317E] mb-4">
//             What We Do
//           </h2>
//           <p className="text-lg text-gray-700 leading-relaxed">
//             Our services range from consulting to technology solutions. We focus on delivering measurable results and creating lasting impact by aligning our strategies with your business goals.
//           </p>
//           <p className="text-lg text-gray-700 leading-relaxed">
//             We specialize in providing customized solutions tailored to the unique needs of our clients, whether they are startups or established enterprises. Our solutions are designed to be scalable, sustainable, and impactful for long-term success.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AdveSection;
import Image from 'next/image';
import React from 'react';
import adveImg from '../../../public/image/005 (1).png';

const AdveSection: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 overflow-hidden
      px-4 py-10
      md:px-16 md:py-24
    ">

      {/* ── Hero row: image + text ── */}
      <div className="flex flex-col md:flex-row-reverse items-center justify-between
        gap-8 mb-10
        md:gap-16 md:mb-16
      ">
        {/* Image */}
        <div className="relative w-full md:w-[770px] shrink-0">
          {/* Decorative blobs behind image — desktop only */}
          <div className="hidden md:block absolute -top-6 -right-6 h-40 w-40 rounded-full bg-[#39317E]/8 blur-2xl" />
          <div className="hidden md:block absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-orange-300/20 blur-2xl" />

          <div className="relative overflow-hidden rounded-2xl shadow-lg
            h-[220px] sm:h-[300px] md:h-[500px]
          ">
            <Image
              src={adveImg}
              alt="Students working on laptop"
              fill
              className="object-cover"
              placeholder="blur"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* subtle gradient overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#39317E]/20 via-transparent to-transparent" />
          </div>


        </div>

        {/* Text content */}
        <div className="w-full md:w-1/2 space-y-4 md:space-y-8
          text-left
        ">
          {/* Label pill */}
          <span className="inline-flex items-center rounded-full border border-[#39317E]/20 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#39317E]">
            Who we are
          </span>

          <h1 className="font-extrabold text-[#39317E] leading-tight
            text-2xl sm:text-3xl md:text-5xl
          ">
            About Us
          </h1>

          <p className="text-gray-600 leading-relaxed
            text-sm md:text-lg
          ">
            Welcome to Collegeseeker — the ultimate platform designed to help students, parents, and educators navigate higher education. Our mission is to provide comprehensive, accurate, and up-to-date information about colleges across the country.
          </p>

          {/* Mobile: short version | Desktop: full version */}
          <p className="text-gray-600 leading-relaxed text-sm md:text-lg hidden md:block">
            Our platform is built with the idea that every student deserves the best possible education. We provide powerful filtering tools to help students find the perfect college that fits their unique needs — whether you're looking by state, specialization, ranking, or fees.
          </p>

          {/* Stats row — mobile friendly */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { value: "10K+", label: "Colleges" },
              { value: "500+", label: "Courses" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white border border-[#39317E]/10 text-center shadow-sm
                px-2 py-3
              ">
                <p className="font-extrabold text-[#39317E]
                  text-lg md:text-2xl
                ">
                  {stat.value}
                </p>
                <p className="text-gray-500
                  text-[10px] md:text-xs
                ">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content cards ── */}
      <div className="grid gap-5 md:gap-8
        grid-cols-1 md:grid-cols-2
      ">
        {/* Who We Are */}
        <div className="rounded-3xl bg-white border border-blue-100 shadow-md hover:shadow-xl transition-shadow duration-300 group
          p-5 md:p-8
        ">
          {/* Card header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#39317E]/8 md:h-12 md:w-12">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <circle cx="9" cy="7" r="4" stroke="#39317E" strokeWidth="1.8"/>
                <circle cx="17" cy="9" r="3" stroke="#39317E" strokeWidth="1.8"/>
                <path d="M1 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="#39317E" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M17 14c2.21 0 4 1.567 4 3.5" stroke="#39317E" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="font-extrabold text-[#39317E]
              text-xl md:text-3xl
            ">
              Who We Are
            </h2>
          </div>

          <div className="space-y-3 md:space-y-4">
            <p className="text-gray-600 leading-relaxed
              text-sm md:text-lg
            ">
              We are a dynamic team of professionals with a shared vision to provide innovative solutions. Our collective knowledge drives our passion for helping students succeed.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm md:text-lg hidden sm:block">
              With a focus on collaboration, creativity, and continuous improvement, we work together to bring the best results. Our team ensures we stay ahead in providing exceptional services.
            </p>
          </div>

          {/* Bottom tag */}
          <div className="mt-5 flex items-center gap-2 text-[#39317E] text-xs font-semibold group-hover:gap-3 transition-all">
            <span className="h-1.5 w-1.5 rounded-full bg-[#39317E]" />
            Expert guidance
            <span className="h-1.5 w-1.5 rounded-full bg-[#39317E]" />
            Trusted platform
          </div>
        </div>

        {/* What We Do */}
        <div className="rounded-3xl bg-white border border-indigo-100 shadow-md hover:shadow-xl transition-shadow duration-300 group
          p-5 md:p-8
        ">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 md:h-12 md:w-12">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#39317E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17l10 5 10-5" stroke="#39317E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12l10 5 10-5" stroke="#39317E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="font-extrabold text-[#39317E]
              text-xl md:text-3xl
            ">
              What We Do
            </h2>
          </div>

          <div className="space-y-3 md:space-y-4">
            <p className="text-gray-600 leading-relaxed
              text-sm md:text-lg
            ">
              Our services range from college discovery to personalized guidance. We focus on delivering measurable results aligned with every student's unique goals.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm md:text-lg hidden sm:block">
              We specialize in customized solutions tailored to each student — scalable, sustainable, and impactful for long-term academic and career success.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-2 text-[#39317E] text-xs font-semibold group-hover:gap-3 transition-all">
            <span className="h-1.5 w-1.5 rounded-full bg-[#39317E]" />
            Tailored solutions
            <span className="h-1.5 w-1.5 rounded-full bg-[#39317E]" />
            Proven impact
          </div>
        </div>
      </div>

    </section>
  );
};

export default AdveSection;