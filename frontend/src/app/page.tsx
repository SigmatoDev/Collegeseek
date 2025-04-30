"use client";

import CollegeAdmissions from "@/components/admissions/page";
import BlogList from "@/components/blogs/blogList/blogList";
import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import HeroSection from "@/components/hero/page";
import CallbackForm from "@/components/newsletters/page";
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
      <TrendingNow exams={[
  "JEE Main and Other Top Engineering Entrance Exams",
  "Colleges for 60 to 70 Percentile in JEE Main 2025",
  "(GATE) India’s Premier Engineering Exam",
  "(CAT) Top Management Entrance Exam",
  "(UPSC CSE) Civil Services Exam Overview",
  "(SSC CGL) Government Job Exam Guide",
  "(CLAT) Law Entrance Exam Insights",
  "(BITSAT) BITS Pilani Admission Exam",
  "(NDA) National Defence Academy Exam"
]} />
      <CollegeAdmissions />
      <BlogList />
      <CallbackForm/>
      <Footer />
    </div>
  );
};

export default HomePage;
