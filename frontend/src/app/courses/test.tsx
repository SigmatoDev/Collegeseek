// "use client";

// import { useState } from "react";
// import Footer from "@/components/footer/page";
// import Header from "@/components/header/page";
// import Image from "next/image";
// import CoursesFilterSidebar from "@/components/coursesFilterbar/page";
// import CoursesList from "@/components/courses/courseslist/coursesList";

// const AdBox = ({ imageSrc }: { imageSrc: string }) => {
//   return (
//     <div className="bg-gray-100 p-4 w-72 h-96 shadow-lg rounded-lg flex flex-col items-center">
//       <p className="text-center font-semibold">Sponsored Ad</p>
//       <div className="mt-4 w-full h-full relative rounded-lg overflow-hidden">
//         <Image
//           src={imageSrc}
//           alt="Advertisement"
//           fill
//           className="rounded-lg object-cover"
//         />
//       </div>
//     </div>
//   );
// };

// const CollegesPage = () => {
//   const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

//   const handleFilterChange = (newFilters: string[]) => {
//     setAppliedFilters(newFilters);
//   };

//   const clearFilters = () => {
//     setAppliedFilters([]);
//   };

//   const removeFilter = (filter: string) => {
//     setAppliedFilters((prevFilters) =>
//       prevFilters.filter((item) => item !== filter)
//     );
//   };

//   return (
//     <>
//       <Header />
//       <div className="flex flex-col lg:flex-row gap-6 px-6 py-8">
//         {/* Sidebar (Left) */}
//         <div className="lg:w-1/4 w-full">
//           <CoursesFilterSidebar onFilterChange={handleFilterChange} />
//         </div>

//         {/* Main Content + Ads */}
//         <div className="flex flex-col lg:flex-row gap-6 w-full">
//           {/* Main Content */}
//           <div className="flex-1">
//             {/* Applied Filters */}
//             {appliedFilters.length > 0 && (
//               <div className="bg-gray-100 p-4 rounded-md mb-4">
//                 <h2 className="text-lg font-light text-[12.5px] mb-2">
//                   Applied Filters:
//                 </h2>
//                 <div className="flex flex-wrap gap-2">
//                   {appliedFilters.map((filter, index) => (
//                     <div key={index} className="flex items-center gap-2">
//                       <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
//                         {filter}
//                       </span>
//                       <button
//                         onClick={() => removeFilter(filter)}
//                         className="text-white bg-red-500 hover:bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs"
//                       >
//                         X
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//                 <button
//                   onClick={clearFilters}
//                   className="mt-2 text-sm text-red-600 hover:text-red-800"
//                 >
//                   Clear All Filters
//                 </button>
//               </div>
//             )}

//             {/* College List */}
//             <CoursesList appliedFilters={appliedFilters} />
//           </div>

//           {/* Ad Section (Right) */}
//           <div className="hidden lg:flex flex-col gap-6 sticky top-24">
//             <AdBox imageSrc="/image/3.jpg" />
//             <AdBox imageSrc="/image/4.avif" />
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default CollegesPage;
