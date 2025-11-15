"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import { api_url } from "@/utils/apiCall";
import ContactForm from "./contactForm";

const DEFAULT_CONTACT = {
  phone: "1800-572-9877",
  email: "hello@collegeseek.in",
  address: "123 College Road, Education City",
};

export default function ContactDetails() {
  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const { data } = await axios.get(`${api_url}settings`);
        setContactInfo({
          phone: data.contactPhone || DEFAULT_CONTACT.phone,
          email: data.contactEmail || DEFAULT_CONTACT.email,
          address: data.contactAddress || DEFAULT_CONTACT.address,
        });
      } catch (error) {
        console.error("Error loading contact details:", error);
        setContactInfo(DEFAULT_CONTACT);
      }
    };

    fetchContact();
  }, []);

  return (
    <div className="max-w-8xl mx-auto px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white">
        <div className="flex flex-col justify-center">
          <h3 className="text-4xl font-bold text-[#D17563] mb-4">Let’s Talk</h3>
          <p className="text-gray-600 text-lg mb-10">
            We’d love to hear from you. Whether you have a question about
            colleges, courses, pricing, or anything else — our team is ready to
            answer all your questions.
          </p>

          <div className="space-y-6">
            <ContactItem
              icon={<Phone className="text-[#D17563]" size={24} />}
              title="Call Us"
              detail={contactInfo.phone}
            />
            <ContactItem
              icon={<Mail className="text-[#D17563]" size={24} />}
              title="Email"
              detail={contactInfo.email}
            />
            <ContactItem
              icon={<MapPin className="text-[#D17563]" size={24} />}
              title="Visit Us"
              detail={contactInfo.address}
            />
          </div>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

const ContactItem = ({
  icon,
  title,
  detail,
}: {
  icon: ReactNode;
  title: string;
  detail: string;
}) => (
  <div className="flex items-start gap-4">
    <div className="bg-[#FFF7ED] p-3 rounded-xl">{icon}</div>
    <div>
      <h4 className="text-[#D17563] font-semibold text-lg">{title}</h4>
      <p className="text-gray-600">{detail}</p>
    </div>
  </div>
);
