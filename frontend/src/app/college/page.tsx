"use client";

import { useEffect, useState } from "react";
import CollegeList from "@/components/college/collegeList/collegeList";
import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import Image from "next/image";
import Loader from "@/components/loader/loader";
import CombinedFilterSidebar from "@/components/FilterSidebar/FilterSidebar";

const AdBox = ({ imageSrc }: { imageSrc: string }) => {
  return (
    <div className="bg-gray-100 p-4 w-72 h-96 shadow-lg rounded-lg flex flex-col items-center">
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
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({
    degrees: [],
    states: [],
    cities: [],
    ranks: [],
    fees: [],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <Header />
      <div className="flex mx-auto px-10 py-5 justify-center gap-6">
        <div>
          <CombinedFilterSidebar onFilterChange={setFilters} />
        </div>
        <div className="flex-1">
          <CollegeList appliedFilters={filters} />
        </div>
        <div className="space-y-4">
          <AdBox imageSrc="/image/3.jpg" />
          <AdBox imageSrc="/image/4.avif" />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CollegesPage;
