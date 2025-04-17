"use client";

import { useState } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { api_url } from "@/utils/apiCall";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [collegeResults, setCollegeResults] = useState<any[]>([]);
  const [courseResults, setCourseResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchSearchResults = debounce(async (query: string) => {
    if (!query.trim()) {
      setCollegeResults([]);
      setCourseResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data } = await axios.get(`${api_url}search?query=${query}`);
      setCollegeResults(data.colleges);
      setCourseResults(data.courses);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setCollegeResults([]);
      setCourseResults([]);
    }
    setIsSearching(false);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchSearchResults(value);
  };

  const hasResults = collegeResults.length > 0 || courseResults.length > 0;

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        placeholder="Search for colleges and courses..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="bg-white px-4 w-[500px] py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute right-4 cursor-pointer" />

      {searchQuery && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-md z-50">
          {isSearching ? (
            <p className="text-gray-600 p-2">Searching...</p>
          ) : hasResults ? (
            <div className="p-2 space-y-2">
              {collegeResults.length > 0 && (
                <div>
                  <p className="text-md font-semibold text-gray-400 px-2">
                    Colleges
                  </p>
                  {collegeResults.map((result, index) => (
                    <Link
                      key={`college-${index}`}
                      href={`/colleges/${result.slug}`}
                      className="block px-2 py-1 hover:bg-gray-100 rounded-md truncate"
                    >
                      {result.name}
                    </Link>
                  ))}
                </div>
              )}
              <hr className="border-t-1 border-gray-400 mx-1" />
              {courseResults.length > 0 && (
                <div>
                  <p className="text-md font-semibold text-gray-400 px-2">
                    Courses
                  </p>
                  {courseResults.map((result, index) => (
                    <Link
                      key={`course-${index}`}
                      href={`/courses/${encodeURIComponent(result.name)}`}               
                      className="block px-2 py-1 hover:bg-gray-100 rounded-md truncate"
                    >
                      {result.name}
                    </Link>
                  ))}
                </div>
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
