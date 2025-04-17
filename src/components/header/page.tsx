"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { img_url, api_url } from "@/utils/apiCall";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const fetchLogo = async () => {
      try {
        const { data } = await axios.get(`${api_url}settings`);
        console.log("Fetching logo from:", `${api_url}settings`);
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
      console.log("Search API Response:", data);
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
          <div className="flex items-center space-x-4 ml-[40px]">
            <div className="flex items-center">
              <PhoneIcon className="h-4 w-4 mr-1 text-blue-400" />
              <span>1800-572-9877</span>
            </div>
            <div className="hidden sm:flex items-center">
              <span>hello@collegeSeeker.com</span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-4 pr-3 mr-[40px]">
            <span className="hidden md:block">
              We're on your favorite socials!
            </span>
            <div className="flex space-x-3 ">
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
            {/* Logo & Navigation */}
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center space-x-2 ml-9">
                <img
                  src={siteLogo!}
                  alt="Site Logo"
                  className="h-10 w-auto"
                />
              </div>

              {/* Search Bar */}
              <div className="relative flex items-center ml-[120px]">
                <SearchBar />
              </div>

              {/* Navigation Links */}
              <div className="hidden md:flex md:ml-8 space-x-1 items-center pr-[100px]">
                {[ 
                  { name: "Home", href: "/" },
                  { name: "Colleges", href: "/college" },
                ].map((item, index) => (
                  <Link key={index} href={item.href}>
                    <button className="text-sm font-medium px-3 py-2 rounded-md relative group overflow-hidden transition-colors duration-300 hover:text-[#D46047]">
                      {item.name}
                      <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-[#D46047] transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  </Link>
                ))}

                {/* Mega Menu */}
                <MegaMenu />

                {/* Latest Updates */}
                <Link href="/latestUpdate">
                  <button className="text-sm font-medium px- py-2 rounded-md relative group overflow-hidden transition-colors duration-300 hover:text-[#D46047]">
                    Latest Updates
                    <span className="absolute left-0 bottom-0 w-0 h-[3px] bg-[#D46047] transition-all duration-300 group-hover:w-full"></span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="flex items-center mr-9 space-x-4">
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
