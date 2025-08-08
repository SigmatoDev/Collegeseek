"use client";

import { useState, useEffect } from "react";
import AboutHero from "@/components/aboutUs/aboutHero";
import MissionSection from "@/components/aboutUs/missionSection";
import TeamSection from "@/components/aboutUs/teamSection";
import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import NewsletterForm from "@/components/newsletters/page";

export default function AboutClient() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="bg-[#fffdff]">
      <Header />
      <AboutHero />
      <TeamSection />
      <MissionSection />
      <NewsletterForm />
      <Footer />
    </div>
  );
}
