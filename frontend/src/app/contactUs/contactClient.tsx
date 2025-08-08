"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header/page";
import Footer from "@/components/footer/page";
import NewsletterForm from "@/components/newsletters/page";
import ContactHero from "@/components/contactUs/contactHero";
import ContactDetails from "@/components/contactUs/contactDetails";

const ContactPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);



  return (
    <div>
      <Header />
      <ContactHero />
      <div className="py-10 px-4 md:px-10 grid grid-cols-1 md:grid-cols-1 gap-8">
        <ContactDetails />
      </div>
      <NewsletterForm />
      <Footer />
    </div>
  );
};

export default ContactPage;
