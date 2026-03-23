// "use client";

// import { api_url } from "@/utils/apiCall";
// import { useEffect, useState } from "react";
// import EnrollmentModal from "./model/page";
// import EnrollmentForm from "./enrollForm/page";
// import Loader from "@/components/loader/loader";
// import {
//   AcademicCapIcon,
//   CalendarDaysIcon,
//   BookOpenIcon,
//   CurrencyRupeeIcon,
//   DocumentArrowDownIcon,
// } from "@heroicons/react/24/outline";
// import CourseListSkeleton from "./coursesCardSkeleton/CourseListSkeleton";

// interface Course {
//   _id: string;
//   specialization: string;
//   description: string;
//   category: {
//     _id: string;
//     name: string;
//   };
//   duration: string;
//   programMode: {
//     _id: string;
//     name: string;
//   };
//   college_id: string;
//   fees?: {
//     amount: number;
//     currency: string;
//     year: number;
//   };
//   eligibility: string;
//   entrance_exam: string;
//   application_dates?: {
//     start_date: string;
//     end_date: string;
//   };
//   ratings?: {
//     score: number;
//     reviews_count: number;
//   };
//   placements?: {
//     median_salary: number;
//     currency: string;
//     placement_rate: number;
//   };
//   enrollmentLink: string;
//   brochure_link: string;
// }

// interface Category {
//   _id: string;
//   name: string;
// }

// interface Specialization {
//   _id: string;
//   name: string;
// }

// interface Props {
//   college_id: string;
// }

// export default function CollegeCourses({ college_id }: Props) {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [specializations, setSpecializations] = useState<Specialization[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);

//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState<string | null>(null);
//   const [visibleCount, setVisibleCount] = useState<number>(6); // 👈 NEW

//   useEffect(() => {
//     if (!college_id) {
//       setError("College ID is missing.");
//       setLoading(false);
//       return;
//     }

//     const fetchCourses = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const url = `${api_url}c/courses?college_id=${college_id}`;
//         const response = await fetch(url);
//         if (!response.ok)
//           throw new Error(`Failed to fetch courses: ${response.statusText}`);
//         const data: Course[] = await response.json();
//         const filteredCourses = data.filter(
//           (course) => course.college_id === college_id
//         );
//         setCourses(filteredCourses);
//       } catch (error) {
//         setError((error as Error).message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchSpecializations = async () => {
//       try {
//         const res = await fetch(`${api_url}get2/Specialization`);
//         if (!res.ok) throw new Error("Failed to fetch specializations");
//         const data: Specialization[] = await res.json();
//         setSpecializations(data);
//       } catch (error) {
//         console.error("Specialization error:", error);
//       }
//     };

//     fetchCourses();
//     fetchSpecializations();
//   }, [college_id]);

//   const handleOpenModal = (courseId: string) => {
//     setIsModalOpen(courseId);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(null);
//   };

//   const getSpecializationName = (id: string): string => {
//     return specializations.find((s) => s._id === id)?.name || "Specialization";
//   };

// if (loading) {
//   return <CourseListSkeleton count={6} />;
// }  if (error) return <p className="text-center text-red-500">{error}</p>;
//   if (!courses.length)
//     return (
//       <p className="text-center text-gray-500">
//         No courses found for this college.
//       </p>
//     );

// return (
//   <div className="my-6 py-8 bg-gray-200 px-4 sm:px-8 md:px-12 lg:px-[70px]">
//     <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black text-center mb-8 sm:mb-10">
//       Explore Our Courses
//     </h1>

//     {/* Courses Grid */}
//     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
//       {courses.slice(0, visibleCount).map((course) => (
//         <div
//           key={course._id}
//           className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 p-5 sm:p-6 flex flex-col justify-between"
//         >
//           {/* Header */}
//           <div>
//             <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-[#403A83] truncate">
//               {course.category?.name || "Category"}
//             </h2>

//             <p className="text-xs sm:text-sm text-gray-500 italic mb-2">
//               {getSpecializationName(course.specialization)}
//             </p>

//             {/* Description */}
//             <p className="text-sm sm:text-base text-gray-600 line-clamp-3">
//               {course.description}
//             </p>
//           </div>

//           {/* Details */}
//           <div className="mt-4 space-y-3 text-sm sm:text-base text-gray-700">
//             <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
//               <span className="flex items-center gap-2">
//                 <CalendarDaysIcon className="w-4 h-4 text-[#403A83]" />
//                 <span className="font-medium">Duration:</span> {course.duration}
//               </span>

//               <span className="flex items-center gap-2">
//                 <BookOpenIcon className="w-4 h-4 text-[#403A83]" />
//                 <span className="font-medium">Mode:</span>{" "}
//                 {course.programMode?.name}
//               </span>
//             </div>

//             <div className="flex items-start gap-2">
//               <AcademicCapIcon className="w-4 h-4 text-[#403A83] mt-1" />
//               <p>
//                 <span className="font-medium">Eligibility:</span>{" "}
//                 {course.eligibility}
//               </p>
//             </div>

//             {course.fees && (
//               <p className="flex items-center gap-2 font-semibold text-indigo-700">
//                 <CurrencyRupeeIcon className="w-4 h-4" />
//                 ₹{course.fees.amount.toLocaleString()}{" "}
//                 {course.fees.currency} ({course.fees.year})
//               </p>
//             )}
//           </div>

//           {/* Buttons */}
//           <div className="mt-5 flex flex-col sm:flex-row gap-3">
//             <button
//               onClick={() => handleOpenModal(course._id)}
//               className="bg-[#38347C] text-white px-4 py-2.5 rounded-lg text-sm sm:text-base font-semibold w-full sm:w-auto"
//             >
//               Enroll Now
//             </button>

//             <button
//               onClick={() =>
//                 window.open(
//                   course.brochure_link,
//                   "_blank",
//                   "noopener,noreferrer"
//                 )
//               }
//               className="px-4 py-2.5 border border-[#D35B42] text-[#D35B42] rounded-lg font-medium hover:bg-[#D35B42] hover:text-white transition flex items-center justify-center gap-2 w-full sm:w-auto"
//             >
//               <DocumentArrowDownIcon className="w-4 h-4" />
//               Brochure
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>

//     {/* Show More / Less */}
//     {courses.length > 6 && (
//       <div className="mt-10 flex justify-center sm:justify-end">
//         {visibleCount < courses.length ? (
//           <button
//             onClick={() => setVisibleCount(courses.length)}
//             className="px-6 py-2 bg-[#38347C] text-white rounded-full font-medium hover:bg-[#2f2b6a] transition"
//           >
//             Show More →
//           </button>
//         ) : (
//           <button
//             onClick={() => setVisibleCount(9)}
//             className="px-6 py-2 bg-gray-300 text-black rounded-full font-medium hover:bg-gray-400 transition"
//           >
//             Show Less ↑
//           </button>
//         )}
//       </div>
//     )}

//     {/* Modal */}
//     {isModalOpen && (
//       <EnrollmentModal isOpen={true} onClose={handleCloseModal}>
//         <EnrollmentForm courseId={isModalOpen} />
//       </EnrollmentModal>
//     )}
//   </div>
// );

// }
"use client";

import { api_url } from "@/utils/apiCall";
import { useEffect, useState } from "react";
import EnrollmentModal from "./model/page";
import EnrollmentForm from "./enrollForm/page";
import {
  AcademicCapIcon,
  CalendarDaysIcon,
  BookOpenIcon,
  CurrencyRupeeIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import CourseListSkeleton from "./coursesCardSkeleton/CourseListSkeleton";

interface Course {
  _id: string;
  specialization: string;
  description: string;
  category: { _id: string; name: string };
  duration: string;
  programMode: { _id: string; name: string };
  college_id: string;
  fees?: { amount: number; currency: string; year: number };
  eligibility: string;
  entrance_exam: string;
  application_dates?: { start_date: string; end_date: string };
  ratings?: { score: number; reviews_count: number };
  placements?: { median_salary: number; currency: string; placement_rate: number };
  enrollmentLink: string;
  brochure_link: string;
}

interface Specialization { _id: string; name: string; }
interface Props { college_id: string; }

export default function CollegeCourses({ college_id }: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(6);

  useEffect(() => {
    if (!college_id) { setError("College ID is missing."); setLoading(false); return; }

    const fetchCourses = async () => {
      setLoading(true); setError(null);
      try {
        const response = await fetch(`${api_url}c/courses?college_id=${college_id}`);
        if (!response.ok) throw new Error(`Failed to fetch courses: ${response.statusText}`);
        const data: Course[] = await response.json();
        setCourses(data.filter((c) => c.college_id === college_id));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSpecializations = async () => {
      try {
        const res = await fetch(`${api_url}get2/Specialization`);
        if (!res.ok) throw new Error("Failed to fetch specializations");
        setSpecializations(await res.json());
      } catch (error) { console.error("Specialization error:", error); }
    };

    fetchCourses();
    fetchSpecializations();
  }, [college_id]);

  const getSpecializationName = (id: string) =>
    specializations.find((s) => s._id === id)?.name || "Specialization";

  if (loading) return <CourseListSkeleton count={6} />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!courses.length) return <p className="text-center text-gray-500">No courses found for this college.</p>;

  return (
    <div className="my-5 sm:my-6 bg-gray-200
      py-5 px-4
      sm:py-8 sm:px-8 md:px-12 lg:px-[70px]
    ">
      {/* Heading */}
      <h1 className="font-bold text-black text-center
        text-xl mb-6
        sm:text-3xl lg:text-4xl sm:mb-10
      ">
        Explore Our Courses
      </h1>

      {/* Courses grid */}
      <div className="grid gap-4 sm:gap-6 lg:gap-8
        grid-cols-1 sm:grid-cols-2 xl:grid-cols-3
      ">
        {courses.slice(0, visibleCount).map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col justify-between
              p-4 sm:p-5 
            "
          >
            {/* Header */}
            <div>
              <h2 className="font-semibold text-[#403A83] truncate
                text-sm sm:text-base lg:text-lg
              ">
                {course.category?.name || "Category"}
              </h2>
              <p className="text-gray-500 italic mb-2
                text-xs sm:text-sm
              ">
                {getSpecializationName(course.specialization)}
              </p>
              <p className="text-gray-600 line-clamp-3
                text-xs sm:text-sm 
              ">
                {course.description}
              </p>
            </div>

            {/* Details */}
            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-gray-700
              text-xs sm:text-sm 
            ">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:gap-x-4 sm:gap-y-2">
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <CalendarDaysIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#403A83] shrink-0" />
                  <span className="font-medium">Duration:</span> {course.duration}
                </span>
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <BookOpenIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#403A83] shrink-0" />
                  <span className="font-medium">Mode:</span> {course.programMode?.name}
                </span>
              </div>

              <div className="flex items-start gap-1.5 sm:gap-2">
                <AcademicCapIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#403A83] mt-0.5 shrink-0" />
                <p>
                  <span className="font-medium">Eligibility:</span> {course.eligibility}
                </p>
              </div>

              {course.fees && (
                <p className="flex items-center gap-1.5 sm:gap-2 font-semibold text-indigo-700">
                  <CurrencyRupeeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  ₹{course.fees.amount.toLocaleString()} {course.fees.currency} ({course.fees.year})
                </p>
              )}
            </div>

            {/* Action buttons — side by side on mobile */}
            <div className="mt-4 sm:mt-5 flex flex-row gap-2 sm:gap-3">
              <button
                onClick={() => setIsModalOpen(course._id)}
                className="flex-1 bg-[#38347C] text-white rounded-lg font-semibold transition hover:bg-[#2f2b6a]
                  px-3 py-2 text-xs
                  sm:px-4 sm:py-2.5 sm:text-sm
                "
              >
                Enroll Now
              </button>
              <button
                onClick={() => window.open(course.brochure_link, "_blank", "noopener,noreferrer")}
                className="flex-1 border border-[#D35B42] text-[#D35B42] rounded-lg font-medium hover:bg-[#D35B42] hover:text-white transition flex items-center justify-center gap-1.5 sm:gap-2
                  px-3 py-2 text-xs
                  sm:px-4 sm:py-2.5 sm:text-sm
                "
              >
                <DocumentArrowDownIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                Brochure
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Show More / Less */}
      {courses.length > 6 && (
        <div className="mt-6 sm:mt-10 flex justify-center sm:justify-end">
          {visibleCount < courses.length ? (
            <button
              onClick={() => setVisibleCount(courses.length)}
              className="px-5 py-2 sm:px-6 bg-[#38347C] text-white rounded-full font-medium text-sm hover:bg-[#2f2b6a] transition"
            >
              Show More →
            </button>
          ) : (
            <button
              onClick={() => setVisibleCount(6)}
              className="px-5 py-2 sm:px-6 bg-gray-300 text-black rounded-full font-medium text-sm hover:bg-gray-400 transition"
            >
              Show Less ↑
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <EnrollmentModal isOpen={true} onClose={() => setIsModalOpen(null)}>
          <EnrollmentForm courseId={isModalOpen} />
        </EnrollmentModal>
      )}
    </div>
  );
}