"use client";

import { api_url, img_url } from "@/utils/apiCall";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { MapPinIcon, PhoneIcon } from "lucide-react";
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

      // Use the full S3 URL directly
      setSiteLogo(data.siteLogo || "/default-logo.png");

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
      console.error("Error fetching settings:", error);

      setSiteLogo("/logo/logo.jpg");
      setContactInfo(DEFAULT_CONTACT);
      setSocialLinks(DEFAULT_SOCIAL_LINKS);
    }
  };

  fetchLogo();
}, []);;

  if (!isMounted) return null;

  const socialIcons = [
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
    { href: socialLinks.x, src: "/svg/twitter-154-svgrepo-com.svg", alt: "X" },
    {
      href: socialLinks.youtube,
      src: "/svg/youtube-168-svgrepo-com.svg",
      alt: "YouTube",
    },
  ];

  return (
    <footer
      className="bg-black text-white
      px-4 py-8
      sm:px-6 sm:py-16
    "
    >
      <div
        className="max-w-7xl mx-auto
        space-y-8 sm:space-y-16
      "
      >
        {/* ══════════════════════════════════════
            MOBILE layout (hidden on sm+) — modern left-aligned
        ══════════════════════════════════════ */}
        <div className="sm:hidden space-y-8">
          {/* Logo + tagline */}
          <div className="space-y-3">
            <Link href="/">
              <img
                src={siteLogo ?? "/logo/logo.jpg"}
                alt="Site Logo"
                className="h-8 w-auto cursor-pointer"
              />
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-[280px]">
              CollegeSeek is your trusted platform for discovering top colleges
              and universities around the world.
            </p>
            {/* Social icons — right under logo */}
            <div className="flex gap-3 pt-1">
              {socialIcons.map((icon, index) => (
                <a
                  key={index}
                  href={icon.href || "#"}
                  aria-label={icon.alt}
                  className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition"
                  target={icon.href && icon.href !== "#" ? "_blank" : undefined}
                  rel={
                    icon.href && icon.href !== "#"
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  <img src={icon.src} alt={icon.alt} className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Thin divider */}
          <div className="border-t border-gray-800" />

          {/* 2-col link grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-6">
            {/* Explore */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                Explore
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/latestUpdate"
                    className="text-sm text-gray-300 hover:text-white transition"
                  >
                    Latest Update
                  </Link>
                </li>
                <li>
                  <Link
                    href="/courses"
                    className="text-sm text-gray-300 hover:text-white transition"
                  >
                    Courses
                  </Link>
                </li>
                <li>
                  <Link
                    href="/college"
                    className="text-sm text-gray-300 hover:text-white transition"
                  >
                    Colleges
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                Company
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/aboutUs"
                    className="text-sm text-gray-300 hover:text-white transition"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contactUs"
                    className="text-sm text-gray-300 hover:text-white transition"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contactUs"
                    className="text-sm text-gray-300 hover:text-white transition"
                  >
                    Join Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact block — modern pill cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
              Get in Touch
            </h3>

            {/* Address */}
            <div className="flex items-start gap-3 rounded-2xl bg-gray-900 px-4 py-3">
              <span className="mt-0.5 shrink-0 h-7 w-7 rounded-full bg-gray-800 flex items-center justify-center">
                <MapPinIcon className="h-4 w-4 text-white" />
              </span>{" "}
              <p className="text-xs text-gray-400 leading-relaxed">
                {contactInfo.address}
              </p>
            </div>

            {/* Phone */}
            <a
              href={`tel:${contactInfo.phone}`}
              className="flex items-center gap-3 rounded-2xl bg-gray-900 px-4 py-3 hover:bg-gray-800 transition group"
            >
              <span className="shrink-0 h-7 w-7 rounded-full bg-gray-800 group-hover:bg-gray-700 flex items-center justify-center transition">
                <PhoneIcon className="h-4 w-4 text-white" />
              </span>{" "}
              <span className="text-sm text-gray-300 group-hover:text-white transition">
                {contactInfo.phone}
              </span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-3 rounded-2xl bg-gray-900 px-4 py-3 hover:bg-gray-800 transition group"
            >
              <span className="shrink-0 h-7 w-7 rounded-full bg-gray-800 group-hover:bg-gray-700 flex items-center justify-center transition">
                <EnvelopeIcon className="h-4 w-4 text-white" />
              </span>{" "}
              <span className="text-sm text-gray-300 group-hover:text-white transition">
                {contactInfo.email}
              </span>
            </a>
          </div>

          {/* Thin divider */}
          <div className="border-t border-gray-800" />

          {/* Bottom — centered */}
          <div className="flex flex-col items-center gap-2 text-xs text-gray-600">
            <div className="flex gap-4">
              <Link
                href="/terms&Conditions"
                className="hover:text-gray-400 transition"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacyPolicy"
                className="hover:text-gray-400 transition"
              >
                Privacy Policy
              </Link>
            </div>
            <p className="text-center">
              © {new Date().getFullYear()} collegeseek Pvt. Ltd.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════
            DESKTOP layout — 100% unchanged
        ══════════════════════════════════════ */}
        <div className="hidden sm:block space-y-16">
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
                CollegeSeek is your trusted platform for discovering top
                colleges and universities around the world.
              </p>
            </div>

            {/* Explore */}
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

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link href="/aboutUs" className="hover:text-white transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contactUs"
                    className="hover:text-white transition"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contactUs"
                    className="hover:text-white transition"
                  >
                    Join Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <address className="not-italic text-sm text-gray-400 leading-relaxed">
                {contactInfo.address}
              </address>
              <p className="mt-3 text-sm text-gray-400">
                📞 {contactInfo.phone}
              </p>
              <p className="text-sm text-gray-400">✉️ {contactInfo.email}</p>
              <div className="flex space-x-4 mt-4">
                {socialIcons.map((icon, index) => (
                  <a
                    key={index}
                    href={icon.href || "#"}
                    aria-label={icon.alt}
                    className="hover:opacity-75 transition"
                    target={
                      icon.href && icon.href !== "#" ? "_blank" : undefined
                    }
                    rel={
                      icon.href && icon.href !== "#"
                        ? "noopener noreferrer"
                        : undefined
                    }
                  >
                    <img src={icon.src} alt={icon.alt} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800" />

          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <div className="flex space-x-6 mb-4 sm:mb-0">
              <Link
                href="/terms&Conditions"
                className="hover:text-white transition"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/privacyPolicy"
                className="hover:text-white transition"
              >
                Privacy Policy
              </Link>
            </div>
            <p>
              © {new Date().getFullYear()} collegeseek Pvt. Ltd. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
