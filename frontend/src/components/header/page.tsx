"use client";

import { useState, useEffect, type ComponentType, Fragment } from "react";
import axios from "axios";
import { img_url, api_url } from "@/utils/apiCall";
import {
  PhoneIcon,
  Bars3Icon,
  XMarkIcon,
  EnvelopeIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import Link from "next/link";
import debounce from "lodash.debounce";
import MegaMenu from "../coursesMegaMenu/page";
import ProfileDropdown from "../users/ProfileDropdown/page";
import SearchBar from "./SearchBar";
import Modal from "../counselling/model/page";
import CounsellingForm from "../counselling/counsellingForm/page";

interface HeaderProps {
  title?: string;
}

const DEFAULT_CONTACT_INFO = {
  phone: "1800-572-9877",
  email: "hello@collegeseek.in",
} as const;

const DEFAULT_SOCIAL_LINKS = {
  facebook: "#",
  instagram: "#",
  linkedin: "#",
  x: "#",
  youtube: "#",
} as const;

type SocialLinks = Record<keyof typeof DEFAULT_SOCIAL_LINKS, string>;
type SocialNetwork = keyof SocialLinks;

const SOCIAL_ORDER: SocialNetwork[] = [
  "facebook",
  "instagram",
  "linkedin",
  "x",
  "youtube",
];

type SocialIconProps = {
  className?: string;
};

const XLogo = ({ className }: SocialIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    strokeWidth={1.8}
    stroke="currentColor"
    fill="none"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4l16 16M20 4L8.5 15.5M4 20l7-7"
    />
  </svg>
);

const SOCIAL_ICON_MAP: Record<SocialNetwork, ComponentType<SocialIconProps>> = {
  facebook: (props) => <Facebook {...props} />,
  instagram: (props) => <Instagram {...props} />,
  linkedin: (props) => <Linkedin {...props} />,
  youtube: (props) => <Youtube {...props} />,
  x: (props) => <XLogo {...props} />,
};

const NAV_LINKS = [
  { name: "Online Courses", href: "/college?programModes=Online", badge: "New" },
  { name: "Colleges", href: "/college" },
  { name: "Latest Updates", href: "/latestUpdate" },
  { name: "About Company", href: "/aboutUs" },
  { name: "Contact Us", href: "/contactUs" },
];

const Header = ({ title = "My Website" }: HeaderProps) => {
  const [siteLogo, setSiteLogo] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT_INFO);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({ ...DEFAULT_SOCIAL_LINKS });
  const [isCounsellingOpen, setIsCounsellingOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

useEffect(() => {
  setIsMounted(true);

  const fetchLogo = async () => {
    try {
      const { data } = await axios.get(`${api_url}settings`);

      // Use full S3 URL directly
      setSiteLogo(data.siteLogo || "/default-logo.png");

      setContactInfo({
        phone: data.contactPhone || DEFAULT_CONTACT_INFO.phone,
        email: data.contactEmail || DEFAULT_CONTACT_INFO.email,
      });

      setSocialLinks({ ...DEFAULT_SOCIAL_LINKS, ...(data.socialLinks || {}) });
    } catch (error) {
      console.error("Error fetching settings:", error);
      setSiteLogo("/default-logo.png");
      setContactInfo(DEFAULT_CONTACT_INFO);
      setSocialLinks({ ...DEFAULT_SOCIAL_LINKS });
    }
  };

  fetchLogo();
}, []);

  if (!isMounted) return null;

  return (
    <>
      <header className="bg-white text-gray-900 w-full relative shadow-sm">

        {/* ── TOP BAR ── */}

        {/* MOBILE top bar: two clean rows */}
        <div className="md:hidden bg-[#fdf1ea] border-b border-[#f0c3b8]">
          {/* Row 1: Phone + Email — full width, evenly spaced */}
          <div className="flex items-center justify-around px-4 py-2 border-b border-[#f0c3b8]/60">
            <a
              href={`tel:${contactInfo.phone.replace(/[^+\d]/g, "")}`}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1f1b3b] hover:text-[#c25541] transition"
            >
              <span className="w-6 h-6 rounded-full bg-white text-[#c25541] flex items-center justify-center shadow-sm shrink-0">
                <PhoneIcon className="h-3.5 w-3.5" />
              </span>
              {contactInfo.phone}
            </a>
            <span className="w-px h-4 bg-[#f0c3b8]" />
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1f1b3b] hover:text-[#7b5cd6] transition"
            >
              <span className="w-6 h-6 rounded-full bg-white text-[#c25541] flex items-center justify-center shadow-sm shrink-0">
                <EnvelopeIcon className="h-3.5 w-3.5" />
              </span>
              {contactInfo.email}
            </a>
          </div>
          {/* Row 2: Social icons — centered */}
          <div className="flex items-center justify-center gap-2.5 px-4 py-1.5">
            <span className="text-[9px] uppercase tracking-widest text-[#c25541]/70 font-semibold mr-1">Follow us</span>
            {SOCIAL_ORDER.map((network) => {
              const url = socialLinks[network] || "#";
              const Icon = SOCIAL_ICON_MAP[network];
              return (
                <a
                  key={network}
                  href={url}
                  target={url !== "#" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-[#c25541] hover:bg-[#ece7ff] hover:text-[#7b5cd6] transition"
                  aria-label={network}
                >
                  <Icon className="h-3 w-3" />
                </a>
              );
            })}
          </div>
        </div>

        {/* DESKTOP top bar */}
        <div className="hidden md:block bg-[#fdf1ea] border-b-0 border-[#f4b3b1] text-sm">
          <div className="w-full mx-auto px-4 lg:px-10 py-2 flex items-center justify-between gap-2">

            {/* Left: phone + email — hide email text on md, show on lg */}
            <div className="flex items-center gap-3 text-[#1f1b3b] shrink-0">
              <a href={`tel:${contactInfo.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-1.5 text-xs font-medium hover:text-[#c25541] transition">
                <span className="w-6 h-6 rounded-full bg-white text-[#c25541] flex items-center justify-center shadow-sm shrink-0">
                  <PhoneIcon className="h-3.5 w-3.5" />
                </span>
                <span className="hidden lg:inline">{contactInfo.phone}</span>
              </a>
              <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-1.5 text-xs font-medium hover:text-[#7b5cd6] transition">
                <span className="w-6 h-6 rounded-full bg-white text-[#c25541] flex items-center justify-center shadow-sm shrink-0">
                  <EnvelopeIcon className="h-3.5 w-3.5" />
                </span>
                <span className="hidden lg:inline">{contactInfo.email}</span>
              </a>
            </div>

            {/* Right: About/Contact links + Counselling CTA + social icons */}
            <div className="flex items-center gap-2 lg:gap-3 text-[#c25541] min-w-0">
              {/* About + Contact — hidden on md, show on lg */}
              <nav className="hidden lg:flex items-center gap-3 text-xs font-semibold tracking-wide">
                <Link href="/aboutUs" className="text-[#7b5cd6] hover:text-[#c25541] transition uppercase tracking-widest whitespace-nowrap">About Company</Link>
                <Link href="/contactUs" className="text-[#7b5cd6] hover:text-[#c25541] transition uppercase tracking-widest">Contact</Link>
              </nav>

              {/* Counselling CTA — compact on md, full on lg */}
              <button
                onClick={() => setIsCounsellingOpen(true)}
                className="group relative inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ff8f66] to-[#d95540] text-white shadow-lg shrink-0
                  px-3 py-1 text-xs
                  lg:px-4 lg:py-1.5 lg:text-sm
                "
              >
                <span className="hidden lg:flex absolute -left-3 h-6 w-6 items-center justify-center rounded-full bg-white text-[#d95540] shadow animate-bounce">📞</span>
                <span className="lg:pl-4">
                  <span className="hidden lg:inline">Get Counselling</span>
                  <span className="lg:hidden">📞 Counselling</span>
                </span>
              </button>

              {/* Social icons — hide "Connect" text always on md */}
              <div className="flex items-center gap-1 lg:gap-2">
                <span className="hidden xl:block text-xs uppercase tracking-widest whitespace-nowrap">Connect with us</span>
                {SOCIAL_ORDER.map((network) => {
                  const url = socialLinks[network] || "#";
                  const Icon = SOCIAL_ICON_MAP[network];
                  const isPlaceholder = !url || url === "#";
                  return (
                    <a key={network} href={url}
                      {...(!isPlaceholder ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="p-1.5 lg:p-2 rounded-full bg-white shadow-sm hover:bg-[#ece7ff] text-[#c25541] transition"
                      aria-label={`Visit our ${network} page`}
                    >
                      <Icon className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN NAV — desktop untouched, mobile gets new hamburger style ── */}
        <nav className="bg-white shadow-lg text-gray-800 pt-2 relative w-full">
          <div className="w-full px-4 sm:px-6 lg:px-11">
            <div className="flex justify-between h-16 items-center w-full">

              {/* Logo */}
              <div className="flex items-center space-x-2 shrink-0">
                <Link href="/">
                  <img src={siteLogo!} alt="Site Logo" className="h-10 w-auto cursor-pointer" />
                </Link>
              </div>

              {/* Desktop Search Bar */}
              <div className="hidden md:flex ml-3 lg:ml-6 flex-grow justify-center">
                <SearchBar />
              </div>

              {/* Desktop Nav Links — lg+ only */}
              <div className="hidden lg:flex items-center shrink-0 space-x-4">
                {[
                  { name: "Online", href: "/college?programModes=Online" },
                  { name: "Colleges", href: "/college" },
                ].map((item, index) => (
                  <Link key={index} href={item.href}>
                    <button className={`font-medium rounded-md relative group overflow-hidden transition-colors duration-300 hover:text-[#D46047]
                      text-xs px-2 py-1.5 lg:text-sm lg:px-3 lg:py-2
                      ${item.name === "Online" ? "text-[#D46047] bg-[#fff1ec] border border-[#f0c3b8] rounded-[30px]" : ""}
                    `}>
                      {item.name}
                      <span className="absolute left-0 bottom-0 h-[3px] bg-[#D46047] transition-all duration-300 group-hover:w-full w-0"></span>
                    </button>
                  </Link>
                ))}
                <MegaMenu />
                <Link href="/latestUpdate">
                  <button className="font-medium rounded-md relative group overflow-hidden transition-colors duration-300 hover:text-[#D46047]
                    text-xs px-2 py-1.5 lg:text-sm lg:px-3 lg:py-2
                  ">
                    Latest Updates
                    <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-[#D46047] transition-all duration-300 group-hover:w-full"></span>
                  </button>
                </Link>
              </div>

              {/* Profile + Hamburger — on mobile: pushed to far right with ml-auto, gap from logo */}
              <div className="flex items-center gap-2 ml-auto md:ml-6 pl-2 md:pl-0">
                <ProfileDropdown />
                {/* Styled hamburger — mobile only */}
                {/* Only show hamburger when drawer is closed — close button is inside drawer */}
                {!mobileMenuOpen && (
                  <button
                    type="button"
                    aria-label="Open menu"
                    onClick={() => setMobileMenuOpen(true)}
                    className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-[#fff1ec] border border-[#f0c3b8] text-[#D46047] hover:bg-[#ffe0d0] transition-colors"
                  >
                    <Bars3Icon className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* ══════════════════════════════════════════
          MOBILE SLIDE-IN DRAWER (left side)
          Hidden completely on md+ screens
      ══════════════════════════════════════════ */}

      {/* Backdrop */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
        className={[
          "lg:hidden fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[9998]",
          "transition-opacity duration-300",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Drawer */}
      <aside
        className={[
          "lg:hidden fixed top-0 left-0 h-full w-[82vw] max-w-[320px]",
          "bg-white z-[9999] flex flex-col shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Drawer header with logo + close */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#fff8f5] to-[#fdf1ea] border-b border-[#f0c3b8]">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <img src={siteLogo!} alt="Site Logo" className="h-9 w-auto" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
            className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#D46047] hover:bg-[#fff1ec] transition-colors"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <SearchBar />
        </div>

        {/* Scrollable nav links */}
        <nav className="flex-1 overflow-y-auto">
          {NAV_LINKS.map((link, i) => (
            <Fragment key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-5 py-4 text-[15px] font-medium text-gray-800 hover:bg-[#fff8f6] hover:text-[#D46047] active:bg-[#fff1ec] transition-colors border-b border-gray-50 group"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="flex items-center gap-2.5">
                  {link.name}
                  {link.badge && (
                    <span className="text-[9px] bg-[#D46047] text-white font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                      {link.badge}
                    </span>
                  )}
                </span>
                <ChevronRightIcon className="h-4 w-4 text-gray-300 group-hover:text-[#D46047] group-hover:translate-x-0.5 transition-all" />
              </Link>
              {/* Insert MegaMenu right after Colleges */}
              {link.name === "Colleges" && (
                <div className="border-b border-gray-50">
                  <MegaMenu />
                </div>
              )}
            </Fragment>
          ))}
        </nav>

        {/* CTA — pinned at very bottom */}
        <button
          onClick={() => { setIsCounsellingOpen(true); setMobileMenuOpen(false); }}
          className="w-full py-4 bg-gradient-to-r from-[#ff8f66] to-[#d95540] text-white font-semibold text-sm tracking-wide flex items-center justify-center gap-2 hover:brightness-105 active:brightness-95 transition-all"
        >
          <span>📞</span>
          Get Free Counselling
        </button>
      </aside>

      {/* Counselling Modal */}
      <Modal isOpen={isCounsellingOpen} onClose={() => setIsCounsellingOpen(false)}>
        <CounsellingForm collegeId="global" onClose={() => setIsCounsellingOpen(false)} />
      </Modal>
    </>
  );
};

export default Header;