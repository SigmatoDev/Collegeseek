"use client";

import { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { api_url } from "@/utils/apiCall";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [collegeResults, setCollegeResults] = useState<any[]>([]);
  const [courseResults, setCourseResults] = useState<any[]>([]);
  const [examResults, setExamResults] = useState<any[]>([]);
  const [specializationResults, setSpecializationResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Pagination state
  const [collegePage, setCollegePage] = useState(1);
  const [coursePage, setCoursePage] = useState(1);
  const [examPage, setExamPage] = useState(1);
  const [specializationPage, setSpecializationPage] = useState(1);
  const resultsPerPage = 5;

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(event.target as HTMLElement).closest(".search-dropdown")
      ) {
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

  const totalPages = (results: any[]) =>
    Math.ceil(results.length / resultsPerPage);

  // Function to handle click on any result
  const handleResultClick = () => {
    setIsDropdownOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        placeholder="Search for colleges, courses, exams, and specializations..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="bg-white px-4 w-[500px] py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute right-4 cursor-pointer" />

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="search-dropdown absolute top-full left-0 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-md z-50 max-h-[400px] overflow-y-auto"
        >
          {isSearching ? (
            <p className="text-gray-600 p-2">Searching...</p>
          ) : hasResults ? (
            <div className="p-2 space-y-2">
              {/* Colleges */}
              {collegeResults.length > 0 && (
                <div>
                  <p className="text-md font-semibold text-gray-400 px-2">
                    Colleges
                  </p>
                  {paginate(collegeResults, collegePage).map(
                    (result, index) => (
                      <Link
                        key={`college-${index}`}
                        href={`/colleges/${result.slug}`}
                        onClick={handleResultClick}
                        className="block px-2 py-1 hover:bg-gray-100 rounded-md truncate"
                      >
                        <div className="font-medium">{result.name}</div>
                        <div className="text-sm text-gray-400">
                          {result.city}, {result.state}
                        </div>
                      </Link>
                    )
                  )}
                  {totalPages(collegeResults) > 1 && (
                    <div className="flex justify-end items-center px-2 py-1 text-sm text-gray-500">
                      {/* Left side arrow */}
                      <button
                        disabled={collegePage === 1}
                        onClick={() => setCollegePage(collegePage - 1)}
                        className={`p-1 ${
                          collegePage === 1
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-200 rounded"
                        }`}
                      >
                        <ChevronLeftIcon className="h-6 w-6 border border-gray-700" />
                      </button>

                      {/* Current page number */}
                      {/* <span>
      {collegePage} / {totalPages(collegeResults)}
    </span> */}

                      {/* Right side arrow */}
                      <button
                        disabled={collegePage === totalPages(collegeResults)}
                        onClick={() => setCollegePage(collegePage + 1)}
                        className={`p-1 ${
                          collegePage === totalPages(collegeResults)
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-200 rounded"
                        }`}
                      >
                        <ChevronRightIcon className="h-6 w-6 border border-gray-700" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Courses */}
              {courseResults.length > 0 && (
                <>
                  <hr className="border-t-1 border-gray-400 mx-1" />
                  <div>
                    <p className="text-md font-semibold text-gray-400 px-2">
                      Courses
                    </p>
                    {paginate(courseResults, coursePage).map(
                      (result, index) => (
                        <Link
                          key={`course-${index}`}
                          href={`/college?page=1&categories=${encodeURIComponent(
                            result.name
                          )}`}
                          onClick={handleResultClick}
                          className="block px-2 py-1 hover:bg-gray-100 rounded-md truncate"
                        >
                          {result.name}
                        </Link>
                      )
                    )}
                    {totalPages(courseResults) > 1 && (
                      <div className="flex justify-end items-center px-2 py-1 text-sm text-gray-500 gap-2">
                        {/* Left arrow */}
                        <button
                          disabled={coursePage === 1}
                          onClick={() => setCoursePage(coursePage - 1)}
                          className={`p-1 ${
                            coursePage === 1
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-200 rounded"
                          }`}
                        >
                          <ChevronLeftIcon className="h-6 w-6 border border-gray-700" />
                        </button>

                        {/* Optional: page number in center */}
                        {/* <span>{coursePage} / {totalPages(courseResults)}</span> */}

                        {/* Right arrow */}
                        <button
                          disabled={coursePage === totalPages(courseResults)}
                          onClick={() => setCoursePage(coursePage + 1)}
                          className={`p-1 ${
                            coursePage === totalPages(courseResults)
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-200 rounded"
                          }`}
                        >
                          <ChevronRightIcon className="h-6 w-6 border border-gray-700" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Exams */}
              {examResults.length > 0 && (
                <>
                  <hr className="border-t-1 border-gray-400 mx-1" />
                  <div>
                    <p className="text-md font-semibold text-gray-400 px-2">
                      Exams
                    </p>
                    {paginate(examResults, examPage).map((result, index) => (
                      <Link
                        key={`exam-${index}`}
                        href={`/college?page=1&exams=${encodeURIComponent(
                          result.code
                        )}`}
                        onClick={handleResultClick}
                        className="block px-2 py-1 hover:bg-gray-100 rounded-md truncate"
                      >
                        {result.code}
                      </Link>
                    ))}
                    {totalPages(examResults) > 1 && (
                      <div className="flex justify-end items-center px-2 py-1 text-sm text-gray-500 gap-2">
                        {/* Left arrow */}
                        <button
                          disabled={examPage === 1}
                          onClick={() => setExamPage(examPage - 1)}
                          className={`p-1 ${
                            examPage === 1
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-200 rounded"
                          }`}
                        >
                          <ChevronLeftIcon className="h-6 w-6 border border-gray-700" />
                        </button>

                        {/* Optional: page number in center */}
                        {/* <span>{examPage} / {totalPages(examResults)}</span> */}

                        {/* Right arrow */}
                        <button
                          disabled={examPage === totalPages(examResults)}
                          onClick={() => setExamPage(examPage + 1)}
                          className={`p-1 ${
                            examPage === totalPages(examResults)
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-200 rounded"
                          }`}
                        >
                          <ChevronRightIcon className="h-6 w-6 border border-gray-700" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Specializations */}
              {specializationResults.length > 0 && (
                <>
                  <hr className="border-t-1 border-gray-400 mx-1" />
                  <div>
                    <p className="text-md font-semibold text-gray-400 px-2">
                      Specializations
                    </p>
                    {paginate(specializationResults, specializationPage).map(
                      (result, index) => (
                        <Link
                          key={`specialization-${index}`}
                          href={`/college?page=1&specializations=${encodeURIComponent(
                            result.name
                          )}`}
                          onClick={handleResultClick}
                          className="block px-2 py-1 hover:bg-gray-100 rounded-md truncate"
                        >
                          {result.name}
                        </Link>
                      )
                    )}
                    {totalPages(specializationResults) > 1 && (
                      <div className="flex justify-end items-center px-2 py-1 text-sm text-gray-500 gap-2">
                        {/* Left arrow */}
                        <button
                          disabled={specializationPage === 1}
                          onClick={() =>
                            setSpecializationPage(specializationPage - 1)
                          }
                          className={`p-1 ${
                            specializationPage === 1
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-200 rounded"
                          }`}
                        >
                          <ChevronLeftIcon className="h-6 w-6 border border-gray-700" />
                        </button>

                        {/* Optional page number */}
                        {/* <span>{specializationPage} / {totalPages(specializationResults)}</span> */}

                        {/* Right arrow */}
                        <button
                          disabled={
                            specializationPage ===
                            totalPages(specializationResults)
                          }
                          onClick={() =>
                            setSpecializationPage(specializationPage + 1)
                          }
                          className={`p-1 ${
                            specializationPage ===
                            totalPages(specializationResults)
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-200 rounded"
                          }`}
                        >
                          <ChevronRightIcon className="h-6 w-6 border border-gray-700" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-gray-600 p-2">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
