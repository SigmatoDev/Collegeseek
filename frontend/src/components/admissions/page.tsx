import { colors } from "@/theme/colors";
import {
  AcademicCapIcon,
  UsersIcon,
  GiftIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { ClipboardListIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Select Your Desired Program",
    icon: <AcademicCapIcon className="w-6 h-6" />,
  },
  {
    title: "Connect with Admissions Experts",
    icon: <UsersIcon className="w-6 h-6" />,
  },
  {
    title: "Apply for Scholarships",
    icon: <GiftIcon className="w-6 h-6" />,
  },
  {
    title: "Financial Aid Assistance",
    icon: <BriefcaseIcon className="w-6 h-6" />,
  },
  {
    title: "Simplify Your Application",
    icon: <ClipboardListIcon className="w-6 h-6" />,
  },
  {
    title: "Track Your Application Status",
    icon: <PhoneIcon className="w-6 h-6" />,
  },
];

export default function CollegeAdmissions() {
  return (
    <section className="relative overflow-hidden min-h-[580px] flex items-center max-w-[1400px] mx-auto">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url('/image/admission-bg.png')",
          backgroundPosition: "center center",
        }}
      />

      {/* White Gradient Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 left-0 w-full md:w-1/2 lg:w-2/3 bg-gradient-to-r from-white via-white/95 via-[45%] to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1350px] mx-auto px-4 lg:px-10 py-8 md:py-2">

        <div className="max-w-3xl">

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-black" style={{ color: colors.primary.dark }}>
            Get Ready for Your
            <br />
            <span className="text-[#f25c05]">
              College Admissions
            </span>{" "}
            Journey
          </h2>

          {/* Description */}
          <p className="mt-4 md:mt-8 text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl">
            Personalized counselling, expert guidance,
            application tracking, and financial support
            to help you choose the right college.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-4 md:gap-y-6 mt-6 md:mt-10 max-w-[590px]">

            {features.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 md:gap-5"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl border border-[#f3b396] bg-white flex items-center justify-center text-[#f25c05] shadow-sm">
                  {item.icon}
                </div>

                <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">
                  {item.title}
                </h4>
              </div>
            ))}

          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 md:gap-5 mt-8 md:mt-14">

            <Link href="/college/apply?college">
              <button className="bg-[#eb5b35] hover:bg-[#d84c28] text-white px-6 md:px-10 py-2.5 md:py-3 rounded-full text-sm md:text-md font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                Start Application
              </button>
            </Link>

            <Link href="/contactUs">
              <button className="border-2 border-[#eb5b35] text-[#eb5b35] bg-white/80 backdrop-blur-sm hover:bg-[#fff5f2] px-4 md:px-6 py-2.5 md:py-3 rounded-full text-sm md:text-md font-semibold transition-all duration-300">
                Contact Counselor
              </button>
            </Link>

          </div>

        </div>

      </div>
    </section>
  );
}



// import { Button } from "@/components/ui/button";
// import {
//   AcademicCapIcon,
//   BriefcaseIcon,
//   GiftIcon,
//   UsersIcon,
// } from "@heroicons/react/24/outline";
// import { ClipboardListIcon, PhoneIcon } from "lucide-react";
// import Link from "next/link";

// export default function CollegeAdmissions() {
//   return (
//     <section className="relative bg-gradient-to-b from-[#fef7f4] via-white to-[#f3f1ff] py-10 sm:py-16 mt-0">
//       <div className="absolute inset-0 opacity-60 pointer-events-none">
//         <div className="absolute left-10 top-6 h-32 w-32 rounded-full bg-[#ffd7c5] blur-3xl" />
//         <div className="absolute right-16 top-20 h-40 w-40 rounded-full bg-[#d9d4ff] blur-[80px]" />
//       </div>

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-8">

//         {/* Heading — tighter on mobile */}
//         <div className="text-center mb-8 sm:mb-12 space-y-2 sm:space-y-4">
//           <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 sm:px-6 py-1.5 sm:py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c25541]">
//             Admissions support
//           </span>
//           <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
//             Get Ready for Your College Admissions Journey
//           </h2>
//           <p className="max-w-3xl mx-auto text-xs sm:text-base md:text-lg text-gray-600">
//             Our experts pair personalized counselling with application tracking and financial guidance so you can focus on choosing the right college.
//           </p>
//         </div>

//         {/* 
//           Mobile:  2-column compact cards
//           Tablet:  2-column
//           Desktop: 3-column — unchanged
//         */}
//         <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8 sm:mb-10">
//           {features.map((feature, index) => (
//             <div
//               key={index}
//               className="bg-white/90 border border-gray-100 rounded-2xl shadow-[0_20px_60px_rgba(62,44,92,0.08)] hover:shadow-[0_20px_60px_rgba(62,44,92,0.15)] transition

//                 /* Mobile: compact stacked layout */
//                 flex flex-col gap-2 p-3

//                 /* Desktop: horizontal icon + text layout — unchanged */
//                 sm:flex-row sm:gap-4 sm:items-start sm:p-6
//               "
//             >
//               {/* Icon */}
//               <div className="rounded-full bg-[#fff3f0] text-[#d25c40] shrink-0
//                 p-2 self-start
//                 sm:p-3
//               ">
//                 <span className="block [&>svg]:h-5 [&>svg]:w-5 sm:[&>svg]:h-8 sm:[&>svg]:w-8">
//                   {feature.icon}
//                 </span>
//               </div>

//               {/* Text */}
//               <div className="space-y-1 sm:space-y-2">
//                 <h3 className="font-semibold text-gray-900
//                   text-xs leading-tight
//                   sm:text-sm
//                 ">
//                   {feature.title}
//                 </h3>
//                 {/* Description hidden on mobile to keep cards compact */}
//                 <p className="text-xs text-gray-600 hidden sm:block">
//                   {feature.description}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* CTA Buttons — side by side on all screen sizes */}
//         <div className="flex flex-row justify-center items-center gap-3 sm:gap-4">
//           <Link href="college/apply?college">
//             <Button className="bg-[#d25c41] text-white px-4 sm:px-8 py-3 rounded-full shadow-md hover:bg-[#b74930] transition text-xs sm:text-sm font-semibold whitespace-nowrap">
//               Start Application
//             </Button>
//           </Link>
//           <Link href="/contactUs">
//             <Button className="border border-[#d25c41] text-[#d25c41] px-4 sm:px-8 py-3 rounded-full shadow hover:bg-[#fff7ed] transition text-xs sm:text-sm font-semibold whitespace-nowrap">
//               Contact Counselor
//             </Button>
//           </Link>
//         </div>

//       </div>
//     </section>
//   );
// }

// const features = [
//   {
//     title: "Select Your Desired Program",
//     description: "Explore a wide range of undergraduate and graduate programs that match your goals.",
//     icon: <AcademicCapIcon className="h-8 w-8" />,
//   },
//   {
//     title: "Simplify Your Application",
//     description: "Submit your application online in just a few easy steps through our user-friendly platform.",
//     icon: <ClipboardListIcon className="h-8 w-8" />,
//   },
//   {
//     title: "Financial Aid Assistance",
//     description: "Get help with scholarships, grants, and other financial aid options to fund your education.",
//     icon: <BriefcaseIcon className="h-8 w-8" />,
//   },
//   {
//     title: "Apply for Scholarships",
//     description: "Take advantage of various scholarship opportunities available for eligible students.",
//     icon: <GiftIcon className="h-8 w-8" />,
//   },
//   {
//     title: "Connect with Admissions Experts",
//     description: "Reach out to our admissions counselors to get personalized guidance and support.",
//     icon: <UsersIcon className="h-8 w-8" />,
//   },
//   {
//     title: "Track Your Application Status",
//     description: "Stay informed about your application status and get notified of any updates.",
//     icon: <PhoneIcon className="h-8 w-8" />,
//   },
// ];