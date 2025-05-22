"use client";

import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import CoursesList from "@/components/courses/courseslist/coursesList";
import Breadcrumb from "@/components/breadcrumb/breadcrumb"; // 🧩 Import Breadcrumb
import { useState } from "react";
import AdBox3 from "@/components/adBox/adBox3";
import AdBox4 from "@/components/adBox/adBox4";
import AdBanner from "@/components/adBox/adBox5";


const CollegesPage = () => {
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);


  return (
    <>
      <Header />

      {/* 🧩 Breadcrumb Section */}
      <div className="pt-6 pr-10 pl-10 ">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Courses", href: "/courses" },
          ]}
        />
      </div>

      <div className="flex flex-col lg:flex-row mx-auto px-4 sm:px-6 lg:px-10 py-5 justify-center gap-6">
        {/* Filter Sidebar */}
        <div className="w-full lg:w-auto">
          {/* <CoursesFilterSidebar onFilterChange={handleFilterChange} /> */}
        </div>

        {/* College List */}
        <div className="flex-1">
                    <AdBanner/>

          <CoursesList />
        </div>

        {/* Ad Section (Right) */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
          <AdBox3/>
          <AdBox4/>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default CollegesPage;
