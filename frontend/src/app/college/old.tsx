// "use client";

// import { useEffect, useState } from "react";
// import CollegeList from "@/components/college/collegeList/collegeList";
// import Footer from "@/components/footer/page";
// import Header from "@/components/header/page";
// import CombinedFilterSidebar from "@/components/FilterSidebar/FilterSidebar";
// import Breadcrumb from "@/components/breadcrumb/breadcrumb";
// import AdBox1 from "@/components/adBox/adBox1";
// import AdBox2 from "@/components/adBox/adBox2";



// const CollegesPage = () => {
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState<any>({
//     degrees: [],
//     states: [],
//     cities: [],
//     ranks: [],
//     fees: [],
//   });

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <>
//       <Header />
//       <div className="px-10 pt-6">
//         <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Colleges" }]} />
//       </div>
//       <div className="flex mx-auto px-10 py-5 justify-center gap-6">
//         <div>
//           <CombinedFilterSidebar onFilterChange={setFilters} />
//         </div>
//         <div className="flex-1">
//           <CollegeList appliedFilters={filters} />
//         </div>
//         <div className="space-y-4">
//           <AdBox1 />
//           <AdBox2 />
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default CollegesPage;
// "use client";
// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import CollegeList from "@/components/college/collegeList/collegeList";
// import Footer from "@/components/footer/page";
// import Header from "@/components/header/page";
// import CombinedFilterSidebar from "@/components/FilterSidebar/FilterSidebar";
// import Breadcrumb from "@/components/breadcrumb/breadcrumb";
// import AdBox1 from "@/components/adBox/adBox1";
// import AdBox2 from "@/components/adBox/adBox2";
// const CollegesPage = () => {
//   const [loading, setLoading] = useState(true);
//   const searchParams = useSearchParams();
//   const getFiltersFromURL = () => ({
//     degrees: searchParams.getAll("degrees"),
//     states: searchParams.getAll("states"),
//     cities: searchParams.getAll("cities"),
//     ranks: searchParams.getAll("ranks"),
//     fees: searchParams.getAll("fees"),
//     ownerships: searchParams.getAll("ownerships"),
//     affiliations: searchParams.getAll("affiliations"),
//     approvals: searchParams.getAll("approvals"),
//     exams: searchParams.getAll("exams"),
//     streams: searchParams.getAll("streams"),
//     programModes: searchParams.getAll("programModes"),
//     courseNames: searchParams.getAll("courseNames"),
//   });
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, []);
//   const filters = getFiltersFromURL();
//   return (
//     <>
//       <Header />
//       <div className="px-10 pt-6">
//         <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Colleges" }]} />
//       </div>
//       <div className="flex mx-auto px-10 py-5 justify-center gap-6">
//         <div>
//           <CombinedFilterSidebar onFilterChange={() => {}} />
            
//         </div>
//         <div className="flex-1">
//           {!loading && <CollegeList appliedFilters={filters} />}
//         </div>
//         <div className="space-y-4">
//           <AdBox1 />
//           <AdBox2 />
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };
// export default CollegesPage;