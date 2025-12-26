"use client";

import { useState, useEffect, type ComponentType } from "react";
import axios from "axios";
import { img_url, api_url } from "@/utils/apiCall";
import {
  PhoneIcon,
  Bars3Icon,
  XMarkIcon,
  EnvelopeIcon,
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

const Header = ({ title = "My Website" }: HeaderProps) => {
  const [siteLogo, setSiteLogo] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT_INFO);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    ...DEFAULT_SOCIAL_LINKS,
  });
  const [isCounsellingOpen, setIsCounsellingOpen] = useState(false);

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
          phone: data.contactPhone || DEFAULT_CONTACT_INFO.phone,
          email: data.contactEmail || DEFAULT_CONTACT_INFO.email,
        });
        setSocialLinks({
          ...DEFAULT_SOCIAL_LINKS,
          ...(data.socialLinks || {}),
        });
      } catch (error) {
        console.error("Error fetching site logo:", error);
        setSiteLogo("/default-logo.png");
        setContactInfo(DEFAULT_CONTACT_INFO);
        setSocialLinks({ ...DEFAULT_SOCIAL_LINKS });
      }
    };

    fetchLogo();
  }, []);

  const fetchSearchResults = debounce(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data } = await axios.get(`${api_url}search?query=${query}`);
      setSearchResults(Array.isArray(data.results) ? data.results : []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    }
    setIsSearching(false);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchSearchResults(value);
  };

  if (!isMounted) return null;

  const phoneHref = contactInfo.phone.replace(/[^+\d]/g, "");
  const contactItems = [
    {
      icon: PhoneIcon,
      label: contactInfo.phone,
      href: `tel:${phoneHref}`,
    },
    {
      icon: EnvelopeIcon,
      label: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    },
  ];

  return (
    <header className="bg-white text-gray-900 w-full relative shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#fdf1ea] border-b-0 border-[#f4b3b1] text-sm">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-10 py-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-[#1f1b3b]">
            {contactItems.map(({ icon: Icon, label, href }) => {
              const isPhone = href.startsWith("tel:");

              return isPhone ? (
                // 🔹 NON-CLICKABLE PHONE
                <div
                  key={label}
                  className="flex items-center gap-2 text-xs sm:text-sm font-medium cursor-default"
                >
                  <span className="w-7 h-7 rounded-full bg-white text-[#c25541] flex items-center justify-center shadow-sm">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{label}</span>
                </div>
              ) : (
                // 🔹 CLICKABLE EMAIL
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-2 text-xs sm:text-sm font-medium hover:text-[#7b5cd6] transition"
                >
                  <span className="w-7 h-7 rounded-full bg-white text-[#c25541] flex items-center justify-center shadow-sm">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{label}</span>
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-[#c25541]">
            <nav className="hidden md:flex items-center gap-4 text-xs mr-2 font-semibold tracking-wide">
              <Link
                href="/aboutUs"
                className="text-[#7b5cd6] hover:text-[#c25541] transition mr-2 uppercase tracking-widest"
              >
                About Company
              </Link>
              <Link
                href="/contactUs"
                className="text-[#7b5cd6] hover:text-[#c25541] transition mr-2 uppercase tracking-widest"
              >
                Contact
              </Link>
              <button
                onClick={() => setIsCounsellingOpen(true)}
                className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ff8f66] to-[#d95540] px-4 py-1.5 text-white shadow-lg text-sm"
              >
                <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#d95540] shadow animate-bounce">
                  📞
                </span>
                <span className="pl-4">Get Counselling</span>
              </button>
            </nav>
            <div className="flex items-center gap-2">
              <span className="hidden lg:block text-xs uppercase tracking-widest">
                Connect with us
              </span>
              {SOCIAL_ORDER.map((network) => {
                const url = socialLinks[network] || "#";
                const Icon = SOCIAL_ICON_MAP[network];
                const isPlaceholder = !url || url === "#";
                return (
                  <a
                    key={network}
                    href={url}
                    {...(!isPlaceholder
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="p-2 rounded-full bg-white shadow-sm hover:bg-[#ece7ff] text-[#c25541] transition"
                    aria-label={`Visit our ${network} page`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isCounsellingOpen}
        onClose={() => setIsCounsellingOpen(false)}
      >
        <CounsellingForm
          collegeId="global"
          onClose={() => setIsCounsellingOpen(false)}
        />
      </Modal>

      {/* Main Navigation */}
      <nav className="bg-white shadow-lg text-gray-800 pt-2 relative w-full">
        <div className="w-full px-4 sm:px-6 lg:px-11">
          <div className="flex justify-between h-16 items-center w-full">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link href="/">
                <img
                  src={siteLogo!}
                  alt="Site Logo"
                  className="h-10 w-auto cursor-pointer"
                />
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex ml-6 flex-grow justify-center">
              <SearchBar />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-4 items-center">
              {[
                { name: "Online", href: "/college?programModes=Online" },
                { name: "Colleges", href: "/college" },
              ].map((item, index) => (
                <Link key={index} href={item.href}>
                  <button
                    className={`text-sm font-medium px-3 py-2 rounded-md relative group overflow-hidden transition-colors duration-300 hover:text-[#D46047] ${
                      item.name === "Online"
                        ? "text-[#D46047] bg-[#fff1ec] border border-[#f0c3b8] rounded-[30px]"
                        : ""
                    }`}
                  >
                    {item.name}
                    <span className="absolute left-0 bottom-0 h-[3px] bg-[#D46047] transition-all duration-300 group-hover:w-full w-0"></span>
                  </button>
                </Link>
              ))}

              <MegaMenu />

              <Link href="/latestUpdate">
                <button className="text-sm font-medium px-3 py-2 rounded-md relative group overflow-hidden transition-colors duration-300 hover:text-[#D46047]">
                  Latest Updates
                  <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-[#D46047] transition-all duration-300 group-hover:w-full"></span>
                </button>
              </Link>
            </div>

            {/* Profile & Hamburger */}
            <div className="flex items-center space-x-4 md:ml-6">
              <ProfileDropdown />
              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6 text-gray-800" />
                ) : (
                  <Bars3Icon className="h-6 w-6 text-gray-800" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md z-50">
            <div className="flex flex-col px-4 pt-4 pb-2 space-y-2 text-center">
              {[
                { name: "Online", href: "/college?programModes=Online" },
                { name: "Colleges", href: "/college" },
                { name: "Latest Updates", href: "/latestUpdate" },
              ].map((item, index) => (
                <Link key={index} href={item.href}>
                  <span
                    className={`block text-sm font-medium py-2 border-b border-gray-200 w-full ${
                      item.name === "Online"
                        ? "text-[#D46047] bg-[#fff1ec] rounded-[30px]"
                        : "text-gray-800 hover:text-[#D46047]"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
              <div className="pt-2 w-full justify-center text-start">
                <MegaMenu />
              </div>
              <div className="pt-2 w-full">
                <SearchBar />
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
