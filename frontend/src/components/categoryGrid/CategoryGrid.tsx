"use client";

import Link from "next/link";
import { api_url, img_url } from "@/utils/apiCall";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

const tabs = ["Streams", "Exams", "Courses"];

type CategoryItem = {
  name: string;
  count: number;
  icon: string;
  type: "streams" | "exams" | "courses"; // ✅ must include type
};

type CategoryData = {
  Streams: CategoryItem[];
  Exams: CategoryItem[];
  Courses: CategoryItem[];
};

const ICON_SWATCHES = [
  { bg: "from-[#fff4e6] via-[#ffe4ca] to-[#ffd1a1]", text: "text-[#b45309]" },
  { bg: "from-[#f2f6ff] via-[#e6edff] to-[#dbe3ff]", text: "text-[#1d4ed8]" },
  { bg: "from-[#fdf2ff] via-[#f7e5ff] to-[#f5d9ff]", text: "text-[#a21caf]" },
  { bg: "from-[#ecfbf2] via-[#d9f4e6] to-[#c5f2db]", text: "text-[#047857]" },
  { bg: "from-[#fff2f2] via-[#ffdfe0] to-[#ffd6d6]", text: "text-[#b91c1c]" },
];

export default function CategoryGrid() {
  const [activeTab, setActiveTab] = useState<"Streams" | "Exams" | "Courses">(
    "Streams"
  );

  const [data, setData] = useState<CategoryData>({
    Streams: [],
    Exams: [],
    Courses: [],
  });

  const tabs = ["Streams", "Exams", "Courses"] as const;

  type TabKey = (typeof tabs)[number];

  const [tabCounts, setTabCounts] = useState<Record<TabKey, number>>({
    Streams: 0,
    Exams: 0,
    Courses: 0,
  });

  const [selectedItem, setSelectedItem] = useState<CategoryItem | null>(null);
  const [relatedColleges, setRelatedColleges] = useState<
    { name: string; slug?: string }[]
  >([]);
  const [collegesLoading, setCollegesLoading] = useState(false);

  const tabKeyMap: { [key: string]: keyof CategoryData } = {
    Streams: "Streams",
    Exams: "Exams",
    Courses: "Courses",
  };

  const getCountLabel = (tab: typeof activeTab) =>
    tab === "Courses" ? "courses" : "colleges";

  // ---------------------------------
  // ✅ Fetch categories (fixed)
  // ---------------------------------
useEffect(() => {
  const fetchCategoryData = async () => {
    try {
      console.log("Fetching categories from API:", `${api_url}getCategoriesFilter`);

      const response = await fetch(`${api_url}getCategoriesFilter`);

      // Log the raw response object
      console.log("Raw fetch response:", response);

      if (!response.ok) {
        console.error("Fetch failed with status:", response.status, response.statusText);
        throw new Error("Failed fetching categories");
      }

      // Clone the response to log full text
      const responseText = await response.clone().text();
      console.log("Raw response text:", responseText);

      const list: CategoryItem[] = await response.json();
      console.log("Parsed JSON list from backend:", list);

      // Group by type and ensure counts are numbers
      const grouped: CategoryData = {
        Streams: list
          .filter(c => c.type === "streams")
          .map(c => ({ ...c, count: Number(c.count || 0) })),
        Exams: list
          .filter(c => c.type === "exams")
          .map(c => ({ ...c, count: Number(c.count || 0) })),
        Courses: list
          .filter(c => c.type === "courses")
          .map(c => ({ ...c, count: Number(c.count || 0) })),
      };

      console.log(
        "Grouped Courses with numeric counts:",
        grouped.Courses.map(c => ({ name: c.name, count: c.count }))
      );
      console.log(
        "Total Courses count:",
        grouped.Courses.reduce((acc, i) => acc + i.count, 0)
      );

      setData(grouped);

      setTabCounts({
        Streams: grouped.Streams.reduce((acc, i) => acc + i.count, 0),
        Exams: grouped.Exams.reduce((acc, i) => acc + i.count, 0),
        Courses: grouped.Courses.reduce((acc, i) => acc + i.count, 0),
      });

    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  fetchCategoryData();
}, []);






  // ---------------------------------
  // Auto-select first item on tab change
  // ---------------------------------
  useEffect(() => {
    const list = data[tabKeyMap[activeTab]];
    setSelectedItem(list.length > 0 ? list[0] : null);
  }, [activeTab, data]);

  // ---------------------------------
  // Fetch related colleges when item changes
  // ---------------------------------
  useEffect(() => {
    if (!selectedItem) return;

    const controller = new AbortController();

    const fetchColleges = async () => {
      setCollegesLoading(true);
      try {
        const filterKey =
          activeTab === "Exams"
            ? "exams"
            : activeTab === "Courses"
            ? "categories"
            : "streams";

        const payload = {
          page: 1,
          limit: 15,
          [filterKey]: [selectedItem.name],
        };

        const res = await fetch(`${api_url}get/colleges/filter`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        const response = await res.json();
        const list =
          response?.colleges ||
          response?.data?.colleges ||
          response?.data?.data ||
          [];

        const normalized = list.map((college: any) => ({
          name:
            college?.name ||
            college?.collegeName ||
            college?.title ||
            "College",
          slug: college?.slug || college?._id,
        }));

        setRelatedColleges(normalized.slice(0, 15));
      } catch (err: any) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setCollegesLoading(false);
      }
    };

    fetchColleges();
    return () => controller.abort();
  }, [selectedItem, activeTab]);

  // ---------------------------------
  // Helper functions
  // ---------------------------------
  const encodePlus = (s: string) => encodeURIComponent(s).replace(/%20/g, "+");

  const toTitleCaseSmart = (str: string) =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const buildHref = (item: CategoryItem) => {
    if (activeTab === "Exams")
      return `/college?page=1&exams=${encodePlus(item.name.toUpperCase())}`;

    if (activeTab === "Courses")
      return `/college?page=1&categories=${encodePlus(
        toTitleCaseSmart(item.name)
      )}`;

    return `/college?streams=${encodePlus(toTitleCaseSmart(item.name))}`;
  };

  const buildCollegePillHref = (college: { name: string; slug?: string }) =>
    college.slug
      ? `/colleges/${college.slug}`
      : `/college?search=${encodeURIComponent(college.name)}`;

  // =================================================================
  // UI STARTS HERE  -------------------------------------------------
  // =================================================================

  return (
    <section className="bg-gradient-to-b from-orange-50 to-orange-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-900">
          Find the Best Colleges, Courses & Exams Tailored to Your Needs
        </h2>

        {/* TABS */}
        <div className="flex justify-center mb-14">
          <div className="relative flex w-full max-w-md bg-white border border-[#D35E45] rounded-full shadow-md overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#D35E45] rounded-full transition-transform duration-500 ease-in-out z-0"
              style={{
                width: `calc(100% / ${tabs.length})`,
                transform: `translateX(${tabs.indexOf(activeTab) * 100}%)`,
              }}
            />
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab as "Streams" | "Exams" | "Courses")
                }
                className={`relative z-10 flex-1 flex justify-center items-center gap-2 font-semibold py-3 rounded-full transition ${
                  activeTab === tab ? "text-white" : "text-[#D35E45]"
                }`}
              >
                {tab}
                <span className="bg-[#D35E45] text-white text-xs px-2 py-0.5 rounded-full">
                  ({tabCounts[tab]})
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
          {/* LEFT LIST */}
          <div className="rounded-3xl border bg-white/90 p-4 shadow-sm max-h-[480px] overflow-y-auto">
            <div className="space-y-3">
              {data[tabKeyMap[activeTab]]?.map((item, index) => {
                const isSelected = selectedItem?.name === item.name;
                const swatch = ICON_SWATCHES[index % ICON_SWATCHES.length];

                return (
                  <button
                    key={item.name}
                    onClick={() => setSelectedItem(item)}
                    className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-3 ${
                      isSelected
                        ? "border-[#d35e45] bg-[#fff0e6]"
                        : "border-orange-100"
                    }`}
                  >
                    <div
                      className={`h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${swatch.bg}`}
                    >
                      <span className={`text-base font-bold ${swatch.text}`}>
                        {item.name.charAt(0)}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-left">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 flex justify-start">
                        {item.count} {getCountLabel(activeTab)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="rounded-[32px] border bg-white/90 p-8 shadow-lg space-y-6">
            {selectedItem ? (
              <>
                <h3 className="text-3xl font-extrabold">{selectedItem.name}</h3>

                <div className="flex gap-4 flex-wrap">
                  <Link
                    href={buildHref(selectedItem)}
                    className="bg-[#d25c40] text-white px-6 py-2 rounded-full shadow"
                  >
                    View Colleges
                  </Link>

                  <Link
                    href="/contactUs"
                    className="border border-[#d25c40] text-[#d25c40] px-6 py-2 rounded-full"
                  >
                    Get Admission Help
                  </Link>
                </div>

                <div className="flex flex-wrap gap-2">
                  {collegesLoading ? (
                    <span className="text-xs text-gray-500">
                      Loading colleges...
                    </span>
                  ) : relatedColleges.length > 0 ? (
                    relatedColleges.map((college, i) => (
                      <Link
                        href={buildCollegePillHref(college)}
                        key={i}
                        className="bg-white px-3 py-1 rounded-full text-xs shadow"
                      >
                        {college.name}
                      </Link>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">
                      No colleges found.
                    </span>
                  )}
                </div>
              </>
            ) : (
              <p>No categories available now.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
