"use client";

import CollegeAdmissions from "@/components/admissions/page";
import BlogList from "@/components/blogs/blogList/blogList";
import CategoryGrid from "@/components/categoryGrid/CategoryGrid";
import FeaturedColleges from "@/components/featuredColleges/featuredColleges.tsx";
import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import HeroSection from "@/components/hero/page";
import CallbackForm from "@/components/newsletters/page";
import PopUp from "@/components/popup/popUp";
import TrendingNow from "@/components/trendingNow/trendingNow";
import { useEffect, useState } from "react";



const HomePage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated delay — replace with real data fetching logic if needed
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="bg-[#fffdff]">
      <Header />
      <HeroSection />
      <TrendingNow/>
      <FeaturedColleges/>

      <CollegeAdmissions />
              <CategoryGrid />

      <BlogList />
      <CallbackForm/>
      <PopUp />
      <Footer />
    </div>
  );
};

export default HomePage;
