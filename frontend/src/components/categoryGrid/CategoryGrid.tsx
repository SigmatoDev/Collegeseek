"use client";

import Link from "next/link";
import { api_url, img_url } from "@/utils/apiCall";
import { useEffect, useState } from "react";

const tabs = ["Colleges", "Exams", "Courses"];

type CategoryItem = {
  name: string;
  count: number;
  icon: string;
};

type CategoryData = {
  Streams: CategoryItem[];
  Exams: CategoryItem[];
  Courses: CategoryItem[];
};

export default function CategoryGrid() {
  const [activeTab, setActiveTab] = useState<"Colleges" | "Exams" | "Courses">(
    "Colleges"
  );
  const [data, setData] = useState<CategoryData>({
    Streams: [],
    Exams: [],
    Courses: [],
  });

  // New state for tab counts dynamically
  const [tabCounts, setTabCounts] = useState<{ [key: string]: number }>({
    Colleges: 0,
    Exams: 0,
    Courses: 0,
  });

  const tabKeyMap: { [label: string]: keyof CategoryData } = {
    Colleges: "Streams",
    Exams: "Exams",
    Courses: "Courses",
  };

  const getCountLabel = (tab: typeof activeTab) => {
    switch (tab) {
      case "Colleges":
      case "Exams":
        return "colleges";
      case "Courses":
        return "courses";
      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const url = `${api_url}categories`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          const rawText = await response.text();
          console.error("Expected JSON but received:", rawText);
          throw new Error("Invalid response format");
        }
        const result: CategoryData = await response.json();
        setData(result);

        // Calculate dynamic counts for tabs
        setTabCounts({
          Colleges: result.Streams.reduce((acc, item) => acc + item.count, 0),
          Exams: result.Exams.reduce((acc, item) => acc + item.count, 0),
          Courses: result.Courses.reduce((acc, item) => acc + item.count, 0),
        });
      } catch (error) {
        console.error("Failed to fetch category data:", error);
      }
    };

    fetchCategoryData();
  }, []);

  const formatQuery = (str: string) =>
    encodeURIComponent(str).replace(/%20/g, "+");

  return (
    <section className="bg-gradient-to-b from-orange-50 to-orange-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-900">
          Find the Best Colleges, Courses & Exams Tailored to Your Needs
        </h2>

        <div
          role="tablist"
          aria-label="Category tabs"
          className="flex justify-center mb-14"
        >
          <div className="relative flex w-full max-w-md bg-white border border-[#D35E45] rounded-full shadow-md overflow-hidden">
            {/* Sliding Indicator */}
            <div
              className="absolute top-0 left-0 h-full bg-[#D35E45] rounded-full transition-transform duration-500 ease-in-out z-0"
              style={{
                width: `calc(100% / ${tabs.length})`,
                transform: `translateX(${tabs.indexOf(activeTab) * 100}%)`,
              }}
            />

            {/* Tab Buttons */}
            {tabs.map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                tabIndex={activeTab === tab ? 0 : -1}
                onClick={() =>
                  setActiveTab(tab as "Colleges" | "Exams" | "Courses")
                }
                className={`relative z-10 flex-1 flex justify-center items-center gap-2 text-center text-sm sm:text-base font-semibold py-3 transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D35E45] ${
                  activeTab === tab
                    ? "text-white"
                    : "text-[#D35E45] hover:bg-orange-50"
                }`}
              >
                <span>{tab}</span>
                <span className="inline-block bg-[#D35E45] text-white text-xs font-semibold rounded-full px-2 py-0.5 leading-none select-none">
                  {`(${tabCounts[tab] ?? 0})`}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {data[tabKeyMap[activeTab]]?.map((item) => {
            let href = "#";
            if (activeTab === "Exams") {
              href = `/college?exams=${formatQuery(item.name)}`;
            } else if (activeTab === "Colleges") {
              href = `/college?streams=${formatQuery(item.name)}`;
            } else if (activeTab === "Courses") {
              href = `/college?categories=${formatQuery(item.name)}`;
            }

            const isImage =
              item.icon?.startsWith("http") || item.icon?.startsWith("uploads");

            return (
              <Link
                key={item.name}
                href={href}
                className="group bg-white border border-orange-100 rounded-full w-40 h-40 shadow-sm hover:shadow-lg hover:border-[#D35E45] transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#D35E45] cursor-pointer overflow-hidden flex flex-col items-center justify-center text-center px-3"
                aria-label={`Explore ${item.name}, ${
                  item.count
                } ${getCountLabel(activeTab)}`}
                tabIndex={0}
              >
                <div className="w-14 h-14 mb-2 flex items-center justify-center rounded-full bg-gradient-to-tr from-orange-50 to-orange-300 text-white group-hover:bg-gradient-to-br overflow-hidden transition-colors duration-300">
                  {isImage ? (
                    <img
                      src={
                        item.icon.startsWith("http")
                          ? item.icon
                          : `${img_url}${item.icon}`
                      }
                      alt={item.name}
                      className="w-10 h-10 object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-2xl select-none">{item.icon}</span>
                  )}
                </div>
                <h3 className="font-semibold text-sm text-gray-900 group-hover:text-[#D35E45] leading-tight break-words">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-none">
                  {item.count} {getCountLabel(activeTab)}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
