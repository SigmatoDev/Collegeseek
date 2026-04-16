"use client";
import { useState, useEffect, useRef, ComponentType, SVGProps } from "react";
import Link from "next/link";
import { ChevronDownIcon, XMarkIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { api_url } from "@/utils/apiCall";
import {
  PaintBrushIcon,
  CodeBracketIcon,
  MegaphoneIcon,
  BriefcaseIcon,
  ChartBarIcon,
  CameraIcon,
  MusicalNoteIcon,
  LanguageIcon,
  CurrencyDollarIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";

interface MenuColumn {
  title: string;
  links?: { label: string; url: string }[];
}

// Category icon map — extend as needed
const CATEGORY_ICONS: Record<
  string,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  default: BookOpenIcon,
  design: PaintBrushIcon,
  development: CodeBracketIcon,
  marketing: MegaphoneIcon,
  business: BriefcaseIcon,
  data: ChartBarIcon,
  photography: CameraIcon,
  music: MusicalNoteIcon,
  language: LanguageIcon,
  finance: CurrencyDollarIcon,
};

function getCategoryIcon(title: string) {
  const key = Object.keys(CATEGORY_ICONS).find((k) =>
    title.toLowerCase().includes(k)
  );
  return CATEGORY_ICONS[key ?? "default"];
}

export default function MegaMenu() {
  const [menuData, setMenuData] = useState<MenuColumn[]>([]);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const bottomSheetRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  

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

  // FIX 4 — Close on outside click (desktop only), also guard against bottomSheetRef
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth < 768) return;
      if (
        megaMenuRef.current &&
        !megaMenuRef.current.contains(event.target as Node) &&
        !bottomSheetRef.current?.contains(event.target as Node)
      ) {
        setIsMegaMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // FIX 2 — Lock body scroll on mobile when open (corrected cleanup)
  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile) {
      document.body.style.overflow = isMegaMenuOpen ? "hidden" : "";
    }
    return () => {
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        document.body.style.overflow = "";
      }
    };
  }, [isMegaMenuOpen]);

  const close = () => setIsMegaMenuOpen(false);

  const handleMenuMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setIsMegaMenuOpen(false), 120);
  };

  const handleMenuMouseEnter = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsMegaMenuOpen(true);
  };

  const activeLinks = menuData[hoveredCategory ?? 0]?.links ?? [];
  const activeTitle = menuData[hoveredCategory ?? 0]?.title ?? "";

 return (
  <>
    <div className="relative" ref={megaMenuRef}>
      {/* ── Trigger Button ── */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsMegaMenuOpen((p) => !p);
        }}
        onMouseEnter={handleMenuMouseEnter}
        aria-expanded={isMegaMenuOpen}
        className="
          group relative flex items-center justify-between w-full
          px-5 py-4 text-[15px] font-medium text-gray-800
          hover:bg-[#fff8f6] hover:text-[#D46047]
          active:bg-[#fff1ec] transition-all duration-200
          focus:outline-none
          md:w-auto md:px-3.5 md:py-2 md:rounded-lg
          md:text-sm md:hover:bg-[#fff8f6] md:justify-start md:gap-1.5
        "
      >
        <span className="relative hidden md:inline-block">
          Courses
          <span
            className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-[#D46047] rounded-full transition-all duration-300 ${
              isMegaMenuOpen ? "w-full" : "w-0 group-hover:w-full"
            }`}
          />
        </span>
        <span className="md:hidden">Courses</span>

        <ChevronRightIcon
          className={`h-4 w-4 text-gray-300 group-hover:text-[#D46047] transition-all duration-300 md:hidden
            ${isMegaMenuOpen ? "rotate-90" : "rotate-0"}
          `}
        />
        <ChevronDownIcon
          className={`h-3.5 w-3.5 hidden md:block text-gray-400 group-hover:text-[#D46047] transition-all duration-300
            ${isMegaMenuOpen ? "rotate-180 text-[#D46047]" : "rotate-0"}
          `}
        />
      </button>

      {/* ══ DESKTOP Mega Menu ══ */}
      <div
        className={`hidden md:flex absolute top-full right-0 mt-2.5 w-[860px] bg-white
          border border-gray-100 rounded-2xl shadow-2xl shadow-gray-200/60
          z-50 overflow-hidden transition-all duration-200 ease-out origin-top-right
          ${
            isMegaMenuOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-[0.97] -translate-y-2 pointer-events-none"
          }`}
        style={{ minHeight: "360px" }}
        onMouseEnter={handleMenuMouseEnter}
        onMouseLeave={handleMenuMouseLeave}
      >
        {/* Left sidebar — categories */}
        <div className="w-[220px] shrink-0 bg-[#fafafa] border-r border-gray-100 py-4">
          <p className="px-5 pb-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Categories
          </p>

          {menuData.length > 0 ? (
            menuData.map((column, index) => {
              const Icon = getCategoryIcon(column.title); // ✅ NEW

              return (
                <button
                  key={index}
                  onMouseEnter={() => setHoveredCategory(index)}
                  className={`w-full flex items-center gap-3 px-5 py-2.5 text-left text-sm font-medium
                    transition-all duration-150 group/cat
                    ${
                      hoveredCategory === index ||
                      (hoveredCategory === null && index === 0)
                        ? "text-[#D46047] bg-[#fff5f2]"
                        : "text-gray-600 hover:text-[#D46047] hover:bg-[#fff5f2]"
                    }`}
                >
                  {/* ✅ ICON FIXED HERE */}
                  <span className="w-5 h-5 text-gray-400 group-hover/cat:text-[#D46047] transition-colors">
                    <Icon className="w-5 h-5" />
                  </span>

                  <span className="flex-1 truncate">{column.title}</span>

                  <span
                    className={`w-0.5 h-4 rounded-full bg-[#D46047] transition-opacity duration-150 ${
                      hoveredCategory === index ||
                      (hoveredCategory === null && index === 0)
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                </button>
              );
            })
          ) : (
            <div className="px-5 space-y-2 py-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 rounded-md bg-gray-100 animate-pulse"
                  style={{ opacity: 1 - i * 0.1 }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ✅ EVERYTHING ELSE REMAINS EXACTLY SAME */}

          {/* Right panel — links for active category */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  {activeTitle}
                </h3>
                <p className="text-[12px] text-gray-400 mt-0.5">
                  {activeLinks.length} course
                  {activeLinks.length !== 1 ? "s" : ""} available
                </p>
              </div>
              <Link
                href="/courses"
                className="text-[12px] font-semibold text-[#D46047] hover:text-[#B24C39] transition-colors"
              >
                Browse all →
              </Link>
            </div>

            {/* Links grid */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {activeLinks.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {activeLinks.map((link, i) => (
                    <Link
                      key={i}
                      href={link.url}
                      onClick={close}
                      className="
                        group/link flex items-center gap-2.5 py-2 px-2.5 rounded-lg
                        text-[13px] text-gray-600
                        hover:text-[#D46047] hover:bg-[#fff5f2]
                        transition-all duration-150
                      "
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-300 group-hover/link:bg-[#D46047] transition-colors shrink-0" />
                      <span className="truncate">{link.label}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 rounded-lg bg-gray-100 animate-pulse"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer CTA */}
            <div className="px-6 py-4 border-t border-gray-100 bg-[#fff5f2]/60 flex items-center justify-between">
              <p className="text-[12px] text-gray-400">
                Explore our full course library
              </p>
              <Link
                href="/courses"
                onClick={close}
                className="
                  inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold
                  bg-[#D46047] text-white
                  hover:bg-[#B24C39] active:scale-[0.97]
                  transition-all duration-150 shadow-sm shadow-[#D46047]/30
                "
              >
                View All Courses
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ══ MOBILE bottom sheet ══ */}

      {/* FIX 3 — Backdrop: added touch-none to prevent scroll bleed on iOS */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`md:hidden fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[10000] touch-none transition-opacity duration-300 ${
          isMegaMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
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
            <p className="text-[11px] text-gray-400 mt-0.5">
              Select a category to explore
            </p>
          </div>
          <button
            onClick={close}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#fff1ec] hover:text-[#D46047] transition-colors"
            aria-label="Close courses menu"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Category tabs */}
        <div
          className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-gray-100 shrink-0"
          style={{ scrollbarWidth: "none" }}
        >
          {menuData.map((column, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTab(index);
              }}
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
        <div
          className="flex-1 overflow-y-auto px-5 py-4"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
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
            <p className="text-sm text-gray-400 text-center py-10">
              Loading courses...
            </p>
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