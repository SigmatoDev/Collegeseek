"use client";

import { useEffect, useState } from "react";
import CollegeApplication from "@/components/admissions/page";
import BlogList from "@/components/blogs/blogList/blogList";
import CollegeConsultationPopup from "@/components/CollegeConsultationPopup/CollegeConsultationPopup";
import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import HeroSection from "@/components/hero/page";
import NewsletterForm from "@/components/newsletters/page";

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
      <CollegeApplication />
      <BlogList />
      <NewsletterForm />
      <CollegeConsultationPopup />
      <Footer />
    </div>
  );
};

export default HomePage;
