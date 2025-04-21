"use client";

import { useState, useEffect } from "react";
import AboutHero from "@/components/aboutUs/aboutHero";
import MissionSection from "@/components/aboutUs/missionSection";
import TeamSection from "@/components/aboutUs/teamSection";
import Footer from "@/components/footer/page";
import Header from "@/components/header/page";
import NewsletterForm from "@/components/newsletters/page";

const AboutPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated loading delay — replace with real data fetch if needed
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);


  return (
    <div>
      <Header />
      <AboutHero />
      <TeamSection />
      <MissionSection />
      <NewsletterForm />
      <Footer />
    </div>
  );
};

export default AboutPage;
