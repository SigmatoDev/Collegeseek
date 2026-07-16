// 
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

const SearchBar = () => {
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
  const [specializationPage, setSpecializationPage] = useState(1);
  const resultsPerPage = 5;

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
      setCollegeResults([]);
      setCourseResults([]);
      setExamResults([]);
      setSpecializationResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const { data } = await axios.get(`${api_url}search?query=${query}`);
      setCollegeResults(data.colleges);
      setCourseResults(data.courses);
      setExamResults(data.exams);
      setSpecializationResults(data.specializations);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setCollegeResults([]);
      setCourseResults([]);
      setExamResults([]);
      setSpecializationResults([]);
    }
    setIsSearching(false);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsDropdownOpen(!!value);
    fetchSearchResults(value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(event.target as HTMLElement).closest(".search-dropdown")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults =
    collegeResults.length > 0 ||
    courseResults.length > 0 ||
    examResults.length > 0 ||
    specializationResults.length > 0;

  const paginate = (results: any[], page: number) => {
    const start = (page - 1) * resultsPerPage;
    return results.slice(start, start + resultsPerPage);
  };

  const totalPages = (results: any[]) => Math.ceil(results.length / resultsPerPage);
  const handleResultClick = () => { setIsDropdownOpen(false); setSearchQuery(""); };

  return (
    <div className="relative flex items-center
      w-full
      lg:w-[500px] lg:flex-none
    ">
      <input
        type="text"
        placeholder={placeholderText || "Search for colleges, courses, exams..."}
        value={searchQuery}
        onChange={handleSearchChange}
        className="
          bg-white px-4 py-2 rounded-full border-2 border-gray-400
          focus:outline-none focus:ring-2 focus:ring-gray-700
          placeholder:text-gray-400 placeholder:text-sm
          w-full pr-10 text-sm
        "
      />
      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute right-4 cursor-pointer shrink-0" />

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="
            search-dropdown absolute top-full left-0 mt-2 z-50
            w-full
            rounded-2xl border border-gray-100 bg-white/95 shadow-2xl backdrop-blur
            max-h-[70vh] md:max-h-105 overflow-y-auto
          "
        >
          {isSearching ? (
            <p className="text-gray-500 p-4 text-sm">Searching...</p>
          ) : hasResults ? (
            <div className="p-3 md:p-4 space-y-4">

              {/* Colleges */}
              {collegeResults.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Colleges</p>
                    <span className="text-xs text-gray-400">{collegeResults.length} results</span>
                  </div>
                  {paginate(collegeResults, collegePage).map((result, index) => (
                    <Link key={`college-${index}`} href={`/colleges/${result.slug}`} onClick={handleResultClick}
                      className="group block rounded-xl border border-gray-100 px-3 py-2 transition hover:bg-gray-50 mb-1">
                      <div className="font-semibold text-sm text-gray-900 group-hover:text-[#c25541]">{result.name}</div>
                      <div className="text-xs text-gray-500">{result.city}, {result.state}</div>
                    </Link>
                  ))}
                  {totalPages(collegeResults) > 1 && (
                    <div className="flex justify-end items-center gap-2 px-2 py-1 text-xs text-gray-500">
                      <button disabled={collegePage === 1} onClick={() => setCollegePage(collegePage - 1)} className={`p-1 ${collegePage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 rounded"}`}>
                        <ChevronLeftIcon className="h-5 w-5 border border-gray-700" />
                      </button>
                      <button disabled={collegePage === totalPages(collegeResults)} onClick={() => setCollegePage(collegePage + 1)} className={`p-1 ${collegePage === totalPages(collegeResults) ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 rounded"}`}>
                        <ChevronRightIcon className="h-5 w-5 border border-gray-700" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Courses */}
              {courseResults.length > 0 && (
                <>
                  <hr className="border-t border-dashed border-gray-200" />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Courses</p>
                      <span className="text-xs text-gray-400">{courseResults.length} results</span>
                    </div>
                    {paginate(courseResults, coursePage).map((result, index) => (
                      <Link key={`course-${index}`} href={`/college?page=1&categories=${encodeURIComponent(result.name)}`} onClick={handleResultClick}
                        className="block rounded-xl border border-gray-100 px-3 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-50 mb-1">
                        {result.name}
                      </Link>
                    ))}
                    {totalPages(courseResults) > 1 && (
                      <div className="flex justify-end items-center px-2 py-1 text-sm text-gray-500 gap-2">
                        <button disabled={coursePage === 1} onClick={() => setCoursePage(coursePage - 1)} className={`p-1 ${coursePage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 rounded"}`}>
                          <ChevronLeftIcon className="h-5 w-5 border border-gray-700" />
                        </button>
                        <button disabled={coursePage === totalPages(courseResults)} onClick={() => setCoursePage(coursePage + 1)} className={`p-1 ${coursePage === totalPages(courseResults) ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 rounded"}`}>
                          <ChevronRightIcon className="h-5 w-5 border border-gray-700" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Exams */}
              {examResults.length > 0 && (
                <>
                  <hr className="border-t border-dashed border-gray-200" />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Exams</p>
                      <span className="text-xs text-gray-400">{examResults.length} results</span>
                    </div>
                    {paginate(examResults, examPage).map((result, index) => (
                      <Link key={`exam-${index}`} href={`/college?page=1&exams=${encodeURIComponent(result.code)}`} onClick={handleResultClick}
                        className="block rounded-xl border border-gray-100 px-3 py-2 text-sm text-gray-800 transition hover:bg-gray-50 mb-1">
                        {result.code}
                      </Link>
                    ))}
                    {totalPages(examResults) > 1 && (
                      <div className="flex justify-end items-center px-2 py-1 text-sm text-gray-500 gap-2">
                        <button disabled={examPage === 1} onClick={() => setExamPage(examPage - 1)} className={`p-1 ${examPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 rounded"}`}>
                          <ChevronLeftIcon className="h-5 w-5 border border-gray-700" />
                        </button>
                        <button disabled={examPage === totalPages(examResults)} onClick={() => setExamPage(examPage + 1)} className={`p-1 ${examPage === totalPages(examResults) ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 rounded"}`}>
                          <ChevronRightIcon className="h-5 w-5 border border-gray-700" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Specializations */}
              {specializationResults.length > 0 && (
                <>
                  <hr className="border-t border-dashed border-gray-200" />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">Specializations</p>
                      <span className="text-xs text-gray-400">{specializationResults.length} results</span>
                    </div>
                    {paginate(specializationResults, specializationPage).map((result, index) => (
                      <Link key={`specialization-${index}`} href={`/college?page=1&specializations=${encodeURIComponent(result.name)}`} onClick={handleResultClick}
                        className="block rounded-xl border border-gray-100 px-3 py-2 text-sm text-gray-800 transition hover:bg-gray-50 mb-1">
                        {result.name}
                      </Link>
                    ))}
                    {totalPages(specializationResults) > 1 && (
                      <div className="flex justify-end items-center px-2 py-1 text-sm text-gray-500 gap-2">
                        <button disabled={specializationPage === 1} onClick={() => setSpecializationPage(specializationPage - 1)} className={`p-1 ${specializationPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 rounded"}`}>
                          <ChevronLeftIcon className="h-5 w-5 border border-gray-700" />
                        </button>
                        <button disabled={specializationPage === totalPages(specializationResults)} onClick={() => setSpecializationPage(specializationPage + 1)} className={`p-1 ${specializationPage === totalPages(specializationResults) ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200 rounded"}`}>
                          <ChevronRightIcon className="h-5 w-5 border border-gray-700" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

            </div>
          ) : (
            <p className="p-6 text-center text-sm text-gray-500">
              No results found. Try a different search phrase.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;