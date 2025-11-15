"use client";

import { api_url, img_url } from "@/utils/apiCall";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const DEFAULT_CONTACT = {
  phone: "1800-572-9877",
  email: "hello@collegeseek.in",
  address: "123 College Road, Education City",
};

const DEFAULT_SOCIAL_LINKS = {
  facebook: "#",
  instagram: "#",
  linkedin: "#",
  x: "#",
  youtube: "#",
};

const Footer = () => {
  const [siteLogo, setSiteLogo] = useState<string>("/logo/logo.jpg");
  const [isMounted, setIsMounted] = useState(false);
  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT);
  const [socialLinks, setSocialLinks] = useState(DEFAULT_SOCIAL_LINKS);

  useEffect(() => {
    setIsMounted(true);

    const fetchLogo = async () => {
      try {
        const { data } = await axios.get(`${api_url}settings`);

        setSiteLogo(
          data.siteLogo
            ? `${img_url.replace(/\/$/, "")}${data.siteLogo}`
            : "/default-logo.png"
        );
        setContactInfo({
          phone: data.contactPhone || DEFAULT_CONTACT.phone,
          email: data.contactEmail || DEFAULT_CONTACT.email,
          address: data.contactAddress || DEFAULT_CONTACT.address,
        });
        setSocialLinks({
          ...DEFAULT_SOCIAL_LINKS,
          ...(data.socialLinks || {}),
        });
      } catch (error) {
        // console.error("Error fetching site logo:", error);
        setSiteLogo("/logo/logo.jpg");
        setContactInfo(DEFAULT_CONTACT);
        setSocialLinks(DEFAULT_SOCIAL_LINKS);
      }
    };

    fetchLogo();
  }, []);

  if (!isMounted) return null; // Prevent rendering on server side or before mounted

  return (
    <footer className="bg-black text-white px-6 py-16">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div>
            <Link href="/">
              <img
                src={siteLogo ?? "/logo/logo.jpg"}
                alt="Site Logo"
                className="h-10 w-auto cursor-pointer"
              />
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mt-4">
              CollegeSeek is your trusted platform for discovering top colleges
              and universities around the world.
            </p>
          </div>

          {/* Explore Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">More to Explore</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link
                  href="/latestUpdate"
                  className="hover:text-white transition"
                >
                  Latest Update
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-white transition">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/college" className="hover:text-white transition">
                  Colleges
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/aboutUs" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contactUs" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/contactUs" className="hover:text-white transition">
                  Join Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info & Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-sm text-gray-400 leading-relaxed">
              {contactInfo.address}
            </address>
            <p className="mt-3 text-sm text-gray-400">📞 {contactInfo.phone}</p>
            <p className="text-sm text-gray-400">✉️ {contactInfo.email}</p>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-4">
              {[
                {
                  href: socialLinks.facebook,
                  src: "/svg/facebook-svgrepo-com (5).svg",
                  alt: "Facebook",
                },
                {
                  href: socialLinks.instagram,
                  src: "/svg/instagram-svgrepo-com (1).svg",
                  alt: "Instagram",
                },
                {
                  href: socialLinks.linkedin,
                  src: "/svg/linkedin-svgrepo-com.svg",
                  alt: "LinkedIn",
                },
                {
                  href: socialLinks.x,
                  src: "/svg/twitter-154-svgrepo-com.svg",
                  alt: "X",
                },
                {
                  href: socialLinks.youtube,
                  src: "/svg/youtube-168-svgrepo-com.svg",
                  alt: "YouTube",
                },
              ].map((icon, index) => (
                <a
                  key={index}
                  href={icon.href || "#"}
                  aria-label={icon.alt}
                  className="hover:opacity-75 transition"
                  target={icon.href && icon.href !== "#" ? "_blank" : undefined}
                  rel={icon.href && icon.href !== "#" ? "noopener noreferrer" : undefined}
                >
                  <img src={icon.src} alt={icon.alt} className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <div className="flex space-x-6 mb-4 sm:mb-0">
            <Link
              href="/terms&Conditions"
              className="hover:text-white transition"
            >
              Terms & Conditions
            </Link>
            <Link href="/privacyPolicy" className="hover:text-white transition">
              Privacy Policy
            </Link>
          </div>
          <p>
            © {new Date().getFullYear()} collegeseek Pvt. Ltd. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
