"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { api_url } from "@/utils/apiCall";

interface MenuColumn {
  title: string;
  links?: { label: string; url: string }[];
}

export default function MegaMenu() {
  const [menuData, setMenuData] = useState<MenuColumn[]>([]);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menuId = "67f4d6ea63d15465e1e9c5b3";
        const res = await fetch(`${api_url}menu/${menuId}`);
        if (!res.ok) throw new Error("Failed to load menu");
        const data = await res.json();
        setMenuData(data.columns || []);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={megaMenuRef}>
      <button
        className="text-sm font-medium px-4 py-2 rounded-md flex items-center space-x-2 hover:text-[#D46047] 
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D46047] transition-transform duration-200"
        onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
        onMouseEnter={() => setIsMegaMenuOpen(true)}
        aria-expanded={isMegaMenuOpen}
      >
        <span>Courses</span>
        <ChevronDownIcon
          className={`h-5 w-5 transition-transform duration-300 ${isMegaMenuOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      <div
        className={`absolute right-0 mt-3 w-[90vw] max-w-[900px] bg-white border border-gray-200 rounded-xl shadow-xl p-6 
                    grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 z-50 transition-all duration-300 ease-in-out 
                    transform ${isMegaMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
        onMouseEnter={() => setIsMegaMenuOpen(true)}
        onMouseLeave={() => setIsMegaMenuOpen(false)}
      >
        {menuData.length > 0 ? (
          menuData.map((column, index) => (
            <div key={index} className="space-y-3">
              <h3 className="font-semibold text-gray-800 text-[17px] mb-2">{column.title}</h3>
              {(column.links ?? []).map((link, i) => (
                <Link
                  key={i}
                  href={link.url}
                  className="block text-sm text-gray-700 hover:text-[#D46047] transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">Loading courses...</p>
        )}

        <div className="col-span-full text-left mt-4">
          <Link
            href="/courses"
            className="inline-block py-3 px-6 bg-gradient-to-r from-[#D46047] to-[#B24C39] text-white text-base font-medium rounded-lg 
                       hover:from-[#B24C39] hover:to-[#92372A] transition-transform duration-200 shadow-md transform hover:scale-105"
          >
            View All Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
