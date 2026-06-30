"use client";

import { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { api_url } from "@/utils/apiCall";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const TYPING_SUGGESTIONS = [
  "engineering colleges",
  "medical institutes in Bangalore",
  "MBA programs abroad",
  "top AI & data science courses",
];

type SearchTab = "colleges" | "courses" | "exams";

export default function HeroSearchBar() {
  const [activeTab, setActiveTab] = useState<SearchTab>("colleges");
  const [searchQuery, setSearchQuery] = useState("");
  const [collegeResults, setCollegeResults] = useState<any[]>([]);
  const [courseResults, setCourseResults] = useState<any[]>([]);
  const [examResults, setExamResults] = useState<any[]>([]);
  const [specializationResults, setSpecializationResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [collegePage, setCollegePage] = useState(1);
  const [coursePage, setCoursePage] = useState(1);
  const [examPage, setExamPage] = useState(1);
  const resultsPerPage = 4;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [placeholderText, setPlaceholderText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = TYPING_SUGGESTIONS[phraseIndex];
    let timeout: NodeJS.Timeout;
    if (!isDeleting && placeholderText.length < currentPhrase.length) {
      timeout = setTimeout(() => setPlaceholderText(currentPhrase.substring(0, placeholderText.length + 1)), 120);
    } else if (!isDeleting && placeholderText.length === currentPhrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && placeholderText.length > 0) {
      timeout = setTimeout(() => setPlaceholderText(currentPhrase.substring(0, placeholderText.length - 1)), 60);
    } else if (isDeleting && placeholderText.length === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % TYPING_SUGGESTIONS.length);
    }
    return () => clearTimeout(timeout);
  }, [placeholderText, isDeleting, phraseIndex]);

  const fetchSearchResults = debounce(async (query: string) => {
    if (!query.trim()) {
      clearAllResults();
      return;
    }
    setIsSearching(true);
    try {
      const { data } = await axios.get(`${api_url}search?query=${query}`);
      setCollegeResults(data.colleges || []);
      setCourseResults(data.courses || []);
      setExamResults(data.exams || []);
      setSpecializationResults(data.specializations || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      clearAllResults();
    }
    setIsSearching(false);
  }, 400);

  const clearAllResults = () => {
    setCollegeResults([]);
    setCourseResults([]);
    setExamResults([]);
    setSpecializationResults([]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsDropdownOpen(!!value);
    fetchSearchResults(value);
  };

  // Triggers dropdown view explicitly instead of performing form submissions 
  const handleSearchClickBtn = () => {
    setIsDropdownOpen(true);
    if (searchQuery.trim()) {
      fetchSearchResults(searchQuery);
    }
  };

  // Support hitting 'Enter' key inside the text field without a submission side effect
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchClickBtn();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(event.target as HTMLElement).closest(".hero-search-dropdown")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const paginate = (results: any[], page: number) => {
    const start = (page - 1) * resultsPerPage;
    return results.slice(start, start + resultsPerPage);
  };

  const totalPages = (results: any[]) => Math.ceil(results.length / resultsPerPage);
  const handleResultClick = () => { setIsDropdownOpen(false); setSearchQuery(""); };

  const combinedCourseAndSpec = [...courseResults, ...specializationResults];

  const visibleTabResults = () => {
    if (activeTab === "colleges") return collegeResults.length > 0;
    if (activeTab === "courses") return combinedCourseAndSpec.length > 0;
    if (activeTab === "exams") return examResults.length > 0;
    return false;
  };

  return (
    <div className="relative w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-5 z-20">
      {/* Search Filter Tabs */}
      <div className="flex items-center gap-6 md:gap-8 border-b border-gray-100 pb-3 mb-4 text-md font-bold">
        {(["colleges", "courses", "exams"] as SearchTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => { setActiveTab(tab); setCollegePage(1); setCoursePage(1); setExamPage(1); }}
            className={`capitalize pb-1 transition-all duration-200 relative ${
              activeTab === tab ? "text-[#E65C00]" : "text-[#002B5C] hover:text-[#E65C00]/80"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E65C00] rounded-full translate-y-[13px]" />
            )}
          </button>
        ))}
      </div>

      {/* Input Form Row (Changed from form to div wrapper to prevent browser native routing actions) */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex items-center w-full">
          <input
            type="text"
            placeholder={placeholderText ? `Search for ${activeTab}... e.g. ${placeholderText}` : `Search for ${activeTab}...`}
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (searchQuery.trim()) setIsDropdownOpen(true); }}
            className="w-full bg-white px-4 py-3 text-sm text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E65C00]/40 transition"
          />
        </div>
        
        <button
          type="button"
          onClick={handleSearchClickBtn}
          className="w-full sm:w-auto bg-[#E65C00] hover:bg-[#cc5200] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 tracking-wide transition-colors duration-200 shrink-0"
        >
          <MagnifyingGlassIcon className="h-4 w-4 stroke-[2.5]" />
          Search
        </button>
      </div>

      {/* Modal Dropdown Overlay List Container */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="
            hero-search-dropdown absolute top-full left-0 right-0 mt-2 z-50
            rounded-xl border border-gray-100 bg-white shadow-2xl p-3
          "
        >
          {isSearching ? (
            <p className="text-gray-400 p-2 text-xs font-medium animate-pulse">Searching matching entries...</p>
          ) : visibleTabResults() ? (
            <div className="max-h-60 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
              
              {/* Colleges Selection Column Container */}
              {activeTab === "colleges" && collegeResults.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Matching Colleges</p>
                  </div>
                  {paginate(collegeResults, collegePage).map((result, index) => (
                    <Link key={`col-${index}`} href={`/colleges/${result.slug}`} onClick={handleResultClick}
                      className="group block rounded-lg border border-gray-50 bg-gray-50/30 px-3 py-2 transition hover:bg-orange-50/40 mb-1">
                      <div className="font-semibold text-xs md:text-sm text-gray-900 group-hover:text-[#E65C00]">{result.name}</div>
                      <div className="text-[11px] text-gray-500">{result.city}, {result.state}</div>
                    </Link>
                  ))}
                  {totalPages(collegeResults) > 1 && (
                    <div className="flex justify-end items-center gap-1.5 pt-1 text-gray-400">
                      <button type="button" disabled={collegePage === 1} onClick={() => setCollegePage(collegePage - 1)} className="p-1 hover:bg-gray-100 rounded disabled:opacity-40">
                        <ChevronLeftIcon className="h-4 w-4" />
                      </button>
                      <span className="text-[11px] font-medium">{collegePage} / {totalPages(collegeResults)}</span>
                      <button type="button" disabled={collegePage === totalPages(collegeResults)} onClick={() => setCollegePage(collegePage + 1)} className="p-1 hover:bg-gray-100 rounded disabled:opacity-40">
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Courses & Specialization Filter Lists */}
              {activeTab === "courses" && combinedCourseAndSpec.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Available Courses & Specializations</p>
                  </div>
                  {paginate(combinedCourseAndSpec, coursePage).map((result, index) => (
                    <Link key={`crs-${index}`} href={`/college?page=1&specializations=${encodeURIComponent(result.name)}`} onClick={handleResultClick}
                      className="block rounded-lg border border-gray-50 px-3 py-2 text-xs md:text-sm font-medium text-gray-800 transition hover:bg-orange-50/40 mb-1">
                      {result.name}
                    </Link>
                  ))}
                  {totalPages(combinedCourseAndSpec) > 1 && (
                    <div className="flex justify-end items-center gap-1.5 pt-1 text-gray-400">
                      <button type="button" disabled={coursePage === 1} onClick={() => setCoursePage(coursePage - 1)} className="p-1 hover:bg-gray-100 rounded disabled:opacity-40">
                        <ChevronLeftIcon className="h-4 w-4" />
                      </button>
                      <span className="text-[11px] font-medium">{coursePage} / {totalPages(combinedCourseAndSpec)}</span>
                      <button type="button" disabled={coursePage === totalPages(combinedCourseAndSpec)} onClick={() => setCoursePage(coursePage + 1)} className="p-1 hover:bg-gray-100 rounded disabled:opacity-40">
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Exams Selection Column Layout */}
              {activeTab === "exams" && examResults.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Entrance Exams</p>
                  </div>
                  {paginate(examResults, examPage).map((result, index) => (
                    <Link key={`exm-${index}`} href={`/college?page=1&exams=${encodeURIComponent(result.code)}`} onClick={handleResultClick}
                      className="block rounded-lg border border-gray-50 px-3 py-2 text-xs md:text-sm font-semibold text-gray-800 transition hover:bg-orange-50/40 mb-1">
                      {result.code}
                    </Link>
                  ))}
                  {totalPages(examResults) > 1 && (
                    <div className="flex justify-end items-center gap-1.5 pt-1 text-gray-400">
                      <button type="button" disabled={examPage === 1} onClick={() => setExamPage(examPage - 1)} className="p-1 hover:bg-gray-100 rounded disabled:opacity-40">
                        <ChevronLeftIcon className="h-4 w-4" />
                      </button>
                      <span className="text-[11px] font-medium">{examPage} / {totalPages(examResults)}</span>
                      <button type="button" disabled={examPage === totalPages(examResults)} onClick={() => setExamPage(examPage + 1)} className="p-1 hover:bg-gray-100 rounded disabled:opacity-40">
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <p className="p-4 text-center text-xs text-gray-400 font-medium">
              {searchQuery.trim() 
                ? `No specific ${activeTab} matches found. Try modifying your phrase.`
                : "Please type a keyword phrase above to view live match suggestions."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}