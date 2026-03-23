"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDownIcon, XMarkIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { api_url } from "@/utils/apiCall";

interface MenuColumn {
  title: string;
  links?: { label: string; url: string }[];
}

export default function MegaMenu() {
  const [menuData, setMenuData] = useState<MenuColumn[]>([]);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const bottomSheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${api_url}menus`);
        if (!res.ok) throw new Error("Failed to load menus");
        const menus = await res.json();
        const courseMenu = menus.data?.[0];
        if (courseMenu?.columns && Array.isArray(courseMenu.columns)) {
          setMenuData(courseMenu.columns);
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };
    fetchMenu();
  }, []);

  // Close on outside click — desktop only, never fires on mobile sheet
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Skip entirely on mobile — bottom sheet manages its own close
      if (window.innerWidth < 768) return;
      if (
        megaMenuRef.current &&
        !megaMenuRef.current.contains(event.target as Node)
      ) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      document.body.style.overflow = isMegaMenuOpen ? "hidden" : "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMegaMenuOpen]);

  const close = () => setIsMegaMenuOpen(false);

  return (
    <>
      <div className="relative" ref={megaMenuRef}>

        {/* Trigger Button — matches other nav links on mobile, original on desktop */}
        <button
          type="button"
          onClick={() => setIsMegaMenuOpen((p) => !p)}
          aria-expanded={isMegaMenuOpen}
          className="flex items-center justify-between w-full px-5 py-4 text-[15px] font-medium text-gray-800 hover:bg-[#fff8f6] hover:text-[#D46047] active:bg-[#fff1ec] transition-colors focus:outline-none group md:w-auto md:px-3 md:py-2 md:rounded-md md:text-sm md:hover:bg-transparent md:justify-start md:gap-1"
        >
          <span>Courses</span>
          {/* Mobile: ChevronRight rotates to point down when open. Desktop: ChevronDown unchanged */}
          <ChevronRightIcon
            className={`h-4 w-4 text-gray-300 group-hover:text-[#D46047] transition-all duration-300 md:hidden
              ${isMegaMenuOpen ? "rotate-90" : "rotate-0"}
            `}
          />
          <ChevronDownIcon
            className={`h-4 w-4 hidden md:block transition-transform duration-300
              ${isMegaMenuOpen ? "rotate-180" : "rotate-0"}
            `}
          />
        </button>

        {/* ══ DESKTOP mega menu — completely untouched ══ */}
        <div
          className={`hidden md:grid absolute inset-auto right-0 mt-3 w-[90vw] max-w-[900px] bg-white border border-gray-200 rounded-xl shadow-xl p-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 z-50 transition-all duration-300 ease-in-out transform ${
            isMegaMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          onMouseLeave={() => setIsMegaMenuOpen(false)}
        >
          {menuData.length > 0 ? (
            menuData.map((column, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-semibold text-gray-800 text-[17px] mb-2">{column.title}</h3>
                {(column.links ?? []).map((link, i) => (
                  <Link key={i} href={link.url} className="block text-sm text-gray-700 hover:text-[#D46047] transition-colors duration-200">
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
              className="inline-block py-3 px-6 bg-gradient-to-r from-[#D46047] to-[#B24C39] text-white text-base font-medium rounded-lg hover:from-[#B24C39] hover:to-[#92372A] transition-transform duration-200 shadow-md transform hover:scale-105"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </div>

      {/* ══ MOBILE bottom sheet — md:hidden ══ */}

      {/* Backdrop */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`md:hidden fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[10000] transition-opacity duration-300 ${
          isMegaMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Bottom Sheet */}
      <div
        ref={bottomSheetRef}
        className={`md:hidden fixed bottom-0 left-0 right-0 z-[10001] bg-white rounded-t-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isMegaMenuOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "82vh" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-[15px] font-bold text-gray-900">Browse Courses</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Select a category to explore</p>
          </div>
          <button
            onClick={close}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#fff1ec] hover:text-[#D46047] transition-colors"
            aria-label="Close courses menu"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Category tabs — horizontal scrollable pills */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-gray-100 shrink-0"
          style={{ scrollbarWidth: "none" }}>
          {menuData.map((column, index) => (
            <button
              key={index}
              onClick={(e) => { e.stopPropagation(); setActiveTab(index); }}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap ${
                activeTab === index
                  ? "bg-[#D46047] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-[#fff1ec] hover:text-[#D46047]"
              }`}
            >
              {column.title}
            </button>
          ))}
        </div>

        {/* Links grid for active tab */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {menuData.length > 0 && menuData[activeTab] ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
              {(menuData[activeTab].links ?? []).map((link, i) => (
                <Link
                  key={i}
                  href={link.url}
                  onClick={close}
                  className="flex items-center gap-2 py-2.5 text-[13px] text-gray-700 hover:text-[#D46047] border-b border-gray-50 transition-colors group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D46047]/25 group-hover:bg-[#D46047] transition-colors shrink-0" />
                  <span className="leading-tight">{link.label}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-10">Loading courses...</p>
          )}
        </div>

        {/* CTA footer */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/60 shrink-0">
          <Link
            href="/courses"
            onClick={close}
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#D46047] to-[#B24C39] text-white text-sm font-semibold rounded-xl shadow-md hover:brightness-105 active:scale-[0.98] transition-all"
          >
            View All Courses →
          </Link>
        </div>
      </div>
    </>
  );
}