// "use client";

// import {
//   AcademicCapIcon,
//   EnvelopeIcon,
//   GlobeAltIcon,
// } from "@heroicons/react/24/solid";

// const teamMembers = [
//   {
//     name: "Dr. Emily Carter",
//     role: "Academic Advisor",
//     image: "/image/uifaces-popular-image (1).jpg",
//     email: "mailto:emily@collegedirectory.com",
//     website: "https://collegeseek.in/",
//   },
//   {
//     name: "Mark Daniels",
//     role: "Technical Head",
//     image: "/image/uifaces-popular-image (2).jpg",
//     email: "mailto:mark@collegedirectory.com",
//     website: "https://collegeseek.in/",
//   },
//   {
//     name: "Ayesha Khan",
//     role: "Career Counselor",
//     image: "/image/uifaces-popular-image.jpg",
//     email: "mailto:ayesha@collegedirectory.com",
//     website: "https://collegeseek.in/",
//   },
// ];

// const TeamSection = () => {
//   return (
//     <section className="py-24 bg-gradient-to-br from-white to-blue-50 text-gray-800">
//       <div className="max-w-7xl mx-auto px-6 text-center">
//         <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
//           Meet Our Experts
//         </h2>
//         <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
//           Our team is made up of passionate professionals who are committed to
//           helping students find the right path. With expertise and care, we
//           guide them toward the best colleges and fulfilling career journeys.{" "}
//         </p>

//         <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
//           {teamMembers.map((member, index) => (
//             <div
//               key={index}
//               className="relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 group"
//             >
//               {/* Badge */}
//               <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-tr from-orange-500 to-orange-600 p-3 rounded-full shadow-lg">
//                 <AcademicCapIcon className="w-6 h-6 text-white" />
//               </div>

//               {/* Image */}
//               <div className="mt-6 w-28 h-28 mx-auto">
//                 <img
//                   src={member.image}
//                   alt={member.name}
//                   className="rounded-full object-cover w-full h-full border-4 border-white shadow-md group-hover:scale-105 transition-transform"
//                 />
//               </div>

//               {/* Name + Role */}
//               <h3 className="mt-6 text-xl font-semibold text-gray-900">
//                 {member.name}
//               </h3>
//               <p className="text-blue-600 mt-1 font-medium">{member.role}</p>

//               {/* Social Icons */}
//               <div className="mt-4 flex justify-center gap-4 text-gray-400">
//                 <a
//                   href={member.email}
//                   target="_blank"
//                   rel="noreferrer"
//                   aria-label="Email"
//                 >
//                   <EnvelopeIcon className="w-5 h-5 hover:text-blue-600 transition-colors" />
//                 </a>
//                 <a
//                   href={member.website}
//                   target="_blank"
//                   rel="noreferrer"
//                   aria-label="Website"
//                 >
//                   <GlobeAltIcon className="w-5 h-5 hover:text-blue-600 transition-colors" />
//                 </a>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TeamSection;
"use client";

import {
  AcademicCapIcon,
  EnvelopeIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/solid";

const teamMembers = [
  {
    name: "Dr. Emily Carter",
    role: "Academic Advisor",
    image: "/image/uifaces-popular-image (1).jpg",
    email: "mailto:emily@collegedirectory.com",
    website: "https://collegeseek.in/",
  },
  {
    name: "Mark Daniels",
    role: "Technical Head",
    image: "/image/uifaces-popular-image (2).jpg",
    email: "mailto:mark@collegedirectory.com",
    website: "https://collegeseek.in/",
  },
  {
    name: "Ayesha Khan",
    role: "Career Counselor",
    image: "/image/uifaces-popular-image.jpg",
    email: "mailto:ayesha@collegedirectory.com",
    website: "https://collegeseek.in/",
  },
];

const TeamSection = () => {
  return (
    <section className="bg-gradient-to-br from-white to-blue-50 text-gray-800
      py-12 px-4
      sm:py-24 sm:px-6
    ">
      <div className="max-w-7xl mx-auto text-center">

        {/* Heading */}
        <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500 mb-4">
          Our Team
        </span>
        <h2 className="font-extrabold tracking-tight text-gray-900
          text-2xl sm:text-5xl
        ">
          Meet Our Experts
        </h2>
        <p className="mt-3 text-gray-500 max-w-2xl mx-auto
          text-sm sm:text-lg sm:mt-4
        ">
          Passionate professionals committed to helping students find the right path —
          guiding them toward the best colleges and fulfilling careers.
        </p>

        {/* Cards grid */}
        <div className="mt-10 sm:mt-20
          grid grid-cols-1 gap-5
          sm:grid-cols-2 md:grid-cols-3 sm:gap-12
        ">
          {teamMembers.map((member, index) => (

            /* ── MOBILE card: horizontal layout ── */
            <div
              key={index}
              className="group relative"
            >
              {/* Mobile layout */}
              <div className="sm:hidden flex items-center gap-4 bg-white rounded-3xl border border-gray-100 shadow-md p-4">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-16 w-16 rounded-2xl object-cover border-2 border-white shadow"
                  />
                  {/* mini badge */}
                  <div className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full bg-gradient-to-tr from-orange-500 to-orange-600 shadow">
                    <AcademicCapIcon className="w-3 h-3 text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-left min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{member.name}</h3>
                  <p className="text-xs text-blue-600 font-medium mt-0.5">{member.role}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <a href={member.email} target="_blank" rel="noreferrer" aria-label="Email">
                      <EnvelopeIcon className="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" />
                    </a>
                    <a href={member.website} target="_blank" rel="noreferrer" aria-label="Website">
                      <GlobeAltIcon className="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Desktop card — original style, enhanced */}
              <div className="hidden sm:block relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:-translate-y-1.5">
                {/* Badge */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-tr from-orange-500 to-orange-600 p-3 rounded-full shadow-lg">
                  <AcademicCapIcon className="w-6 h-6 text-white" />
                </div>

                {/* Subtle top colour bar */}
                <div className="absolute top-0 left-8 right-8 h-0.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-300 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Image */}
                <div className="mt-6 mx-auto h-28 w-28">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="rounded-full object-cover w-full h-full border-4 border-white shadow-md group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Name + role */}
                <h3 className="mt-6 text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-blue-600 mt-1 font-medium text-sm">{member.role}</p>

                {/* Divider */}
                <div className="my-4 h-px bg-gray-100" />

                {/* Icons */}
                <div className="flex justify-center gap-4 text-gray-400">
                  <a
                    href={member.email}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Email"
                    className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    <EnvelopeIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={member.website}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Website"
                    className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    <GlobeAltIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;