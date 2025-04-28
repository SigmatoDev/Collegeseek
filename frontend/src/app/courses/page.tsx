"use client";

import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import Image from "next/image";
import CoursesList from "@/components/courses/courseslist/coursesList";
import CoursesFilterSidebar from "@/components/coursesFilterbar/page";
import Breadcrumb from "@/components/breadcrumb/breadcrumb"; // 🧩 Import Breadcrumb
import { useState } from "react";

const AdBox = ({ imageSrc }: { imageSrc: string }) => {
  return (
    <div className="bg-gray-100 p-4 w-full lg:w-72 h-96 shadow-lg rounded-lg flex flex-col items-center">
      <p className="text-center font-semibold">Sponsored Ad</p>
      <div className="mt-4 w-full h-full relative rounded-lg overflow-hidden">
        <Image
          src={imageSrc}
          alt="Advertisement"
          fill
          className="rounded-lg object-cover"
        />
      </div>
    </div>
  );
};

const CollegesPage = () => {
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

  const handleFilterChange = (newFilters: string[]) => {
    setAppliedFilters(newFilters);
  };

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
          <CoursesList />
        </div>

        {/* Ad Section (Right) */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
          <AdBox imageSrc="/image/3.jpg" />
          <AdBox imageSrc="/image/4.avif" />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CollegesPage;
