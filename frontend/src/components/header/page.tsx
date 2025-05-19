"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { img_url, api_url } from "@/utils/apiCall";
import { PhoneIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import debounce from "lodash.debounce";
import MegaMenu from "../coursesMegaMenu/page";
import ProfileDropdown from "../users/ProfileDropdown/page";
import SearchBar from "./SearchBar";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "My Website" }) => {
  const [siteLogo, setSiteLogo] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
      } catch (error) {
        console.error("Error fetching site logo:", error);
        setSiteLogo("/default-logo.png");
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

  return (
    <header className="bg-[#0a0536] text-white w-full relative">
      {/* Top Bar */}
      <div className="bg-[#441a6b] text-sm w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          {/* Contact Info */}
          <div className="flex items-center space-x-4 ml-4 sm:ml-[40px]">
            <div className="flex items-center">
              <PhoneIcon className="h-4 w-4 mr-1 text-blue-400" />
              <span>1800-572-9877</span>
            </div>
            <div className="hidden sm:flex items-center">
              <span>hello@collegeseek.in</span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-4 pr-3 mr-4 sm:mr-[40px]">
            <span className="hidden md:block">
              We're on your favorite socials!
            </span>
            <div className="flex space-x-3">
              {[
                {
                  href: "#",
                  src: "/svg/facebook-svgrepo-com (5).svg",
                  alt: "Facebook",
                },
                {
                  href: "#",
                  src: "/svg/instagram-svgrepo-com (1).svg",
                  alt: "Instagram",
                },
                {
                  href: "#",
                  src: "/svg/linkedin-svgrepo-com.svg",
                  alt: "LinkedIn",
                },
                {
                  href: "#",
                  src: "/svg/twitter-154-svgrepo-com.svg",
                  alt: "Twitter",
                },
                {
                  href: "#",
                  src: "/svg/youtube-168-svgrepo-com.svg",
                  alt: "YouTube",
                },
              ].map((icon, index) => (
                <a key={index} href={icon.href}>
                  <img src={icon.src} alt={icon.alt} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-gray-100 border-b border-gray-700 text-gray-800 pt-2 relative w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
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
                { name: "Online", href: "/college?programModes=681c3ad286ab8ec6b6cf1e27" },
                { name: "Colleges", href: "/college" },
              ].map((item, index) => (
                <Link key={index} href={item.href}>
                  <button className="text-sm font-medium px-3 py-2 rounded-md relative group overflow-hidden transition-colors duration-300 hover:text-[#D46047]">
                    {item.name}
                    <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-[#D46047] transition-all duration-300 group-hover:w-full"></span>
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
                  <span className="block text-sm font-medium py-2 text-gray-800 hover:text-[#D46047] border-b border-gray-200 w-full">
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
