"use client";

import Link from "next/link";
import { api_url } from "@/utils/apiCall";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

type CategoryItem = {
  name: string;
  count: number;
  icon: string;
  type: "streams" | "exams" | "courses";
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

// ── Mobile skeleton ──────────────────────────────────────────────
function MobileSkeleton() {
  return (
    <div className="sm:hidden space-y-4 animate-pulse">
      {/* Tab bar skeleton */}
      <div className="flex w-full rounded-full border border-orange-100 bg-white overflow-hidden h-10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`flex-1 mx-1 my-1 rounded-full ${i === 0 ? "bg-orange-200" : "bg-gray-100"}`}
          />
        ))}
      </div>

      {/* Chip row skeleton */}
      <div className="flex gap-2 overflow-hidden">
        {[80, 100, 90, 110, 85].map((w, i) => (
          <div
            key={i}
            className="shrink-0 h-9 rounded-full bg-gray-200"
            style={{ width: w }}
          />
        ))}
      </div>

      {/* Panel skeleton */}
      <div className="rounded-2xl border border-orange-100 bg-white shadow-lg p-4 space-y-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 w-32 bg-gray-200 rounded-full" />
            <div className="h-3 w-24 bg-gray-100 rounded-full" />
          </div>
          <div className="h-8 w-20 bg-orange-200 rounded-full" />
        </div>

        {/* Full-width button skeleton */}
        <div className="h-8 w-full bg-orange-100 rounded-full" />

        {/* College pills section */}
        <div className="space-y-2">
          <div className="h-3 w-16 bg-gray-100 rounded-full" />
          <div className="flex flex-wrap gap-1.5">
            {[90, 120, 80, 110, 95, 105, 75, 130].map((w, i) => (
              <div
                key={i}
                className="h-6 bg-orange-50 border border-orange-100 rounded-full"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Desktop skeleton ─────────────────────────────────────────────
function DesktopSkeleton() {
  return (
    <div className="hidden sm:block animate-pulse">
      {/* Tab bar */}
      <div className="flex justify-center mb-14">
        <div className="flex w-full max-w-md rounded-full border border-orange-100 bg-white overflow-hidden h-12">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`flex-1 mx-1 my-1 rounded-full ${i === 0 ? "bg-orange-200" : "bg-gray-100"}`}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
        {/* Left list skeleton */}
        <div className="rounded-3xl border bg-white/90 p-4 shadow-sm space-y-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl border border-orange-100 px-4 py-3"
            >
              <div className="h-12 w-12 shrink-0 rounded-xl bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
                <div className="h-3 w-1/2 bg-gray-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Right panel skeleton */}
        <div className="rounded-[32px] border bg-white/90 p-8 shadow-lg space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded-full" />
          <div className="flex gap-4">
            <div className="h-10 w-36 bg-orange-200 rounded-full" />
            <div className="h-10 w-44 bg-orange-100 rounded-full border border-orange-200" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[100, 130, 90, 115, 80, 140, 95, 120, 85, 110].map((w, i) => (
              <div
                key={i}
                className="h-7 bg-gray-100 rounded-full shadow-sm"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryGrid() {
  const tabs = ["Streams", "Exams", "Courses"] as const;
  type TabKey = (typeof tabs)[number];

  const [activeTab, setActiveTab] = useState<TabKey>("Streams");
  const [data, setData] = useState<CategoryData>({
    Streams: [],
    Exams: [],
    Courses: [],
  });
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
  const [loading, setLoading] = useState(true);
  const chipScrollRef = useRef<HTMLDivElement>(null);

  const tabKeyMap: Record<TabKey, keyof CategoryData> = {
    Streams: "Streams",
    Exams: "Exams",
    Courses: "Courses",
  };
  const getCountLabel = (tab: TabKey) =>
    tab === "Courses" ? "courses" : "colleges";

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const [listRes, countRes] = await Promise.all([
          fetch(`${api_url}getCategoriesFilter`),
          axios.get(`${api_url}allCategoriesFilter`),
        ]);

        if (!listRes.ok) throw new Error("Failed fetching categories");

        const list: CategoryItem[] = await listRes.json();

        // console.log("LIST API RESPONSE:", list);

        const countData = countRes.data;

        // console.log("COUNT API RESPONSE:", countData);

        // ✅ GROUPING (CORRECT)
        const grouped: CategoryData = {
          Streams: list
            .filter((c) => c.type === "streams")
            .map((c) => ({
              ...c,
              count: countData?.streamCounts?.[c.name] || 0,
            })),

          Exams: list
            .filter((c) => c.type === "exams")
            .map((c) => ({
              ...c,
              count: countData?.examCounts?.[c.name] || 0,
            })),

          Courses: list
            .filter((c) => c.type === "courses")
            .map((c) => ({
              ...c,
              count: countData?.courseCounts?.[c.name] || 0,
            })),
        };

        setData(grouped);

        // ✅ SAFE HELPER (avoids TS unknown issue)
        const sumValues = (obj: Record<string, number> = {}) =>
          Object.values(obj).reduce(
            (acc: number, val) => acc + Number(val || 0),
            0,
          );

        // 🚨 FINAL COUNT LOGIC (FIXED + SAFE)
        const counts = {
          Streams: sumValues(countData?.streamCounts),
          Exams: sumValues(countData?.examCounts),
          Courses: sumValues(countData?.courseCounts),
        };

        // console.log("FINAL PARSED COUNTS:", counts);

        setTabCounts(counts);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  useEffect(() => {
    const list = data[tabKeyMap[activeTab]];
    setSelectedItem(list.length > 0 ? list[0] : null);
    if (chipScrollRef.current) chipScrollRef.current.scrollLeft = 0;
  }, [activeTab, data]);

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
        const res = await fetch(`${api_url}get/colleges/filter`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: 1,
            limit: 15,
            [filterKey]: [selectedItem.name],
          }),
          signal: controller.signal,
        });
        const response = await res.json();
        const list =
          response?.colleges ||
          response?.data?.colleges ||
          response?.data?.data ||
          [];
        setRelatedColleges(
          list.slice(0, 15).map((c: any) => ({
            name: c?.name || c?.collegeName || c?.title || "College",
            slug: c?.slug || c?._id,
          })),
        );
      } catch (err: any) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setCollegesLoading(false);
      }
    };
    fetchColleges();
    return () => controller.abort();
  }, [selectedItem, activeTab]);

  const encodePlus = (s: string) => encodeURIComponent(s).replace(/%20/g, "+");
  const toTitleCase = (str: string) =>
    str
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const buildHref = (item: CategoryItem) => {
    if (activeTab === "Exams")
      return `/college?page=1&exams=${encodePlus(item.name.toUpperCase())}`;
    if (activeTab === "Courses")
      return `/college?page=1&categories=${encodePlus(toTitleCase(item.name))}`;
    return `/college?streams=${encodePlus(toTitleCase(item.name))}`;
  };

  const buildCollegePillHref = (c: { name: string; slug?: string }) =>
    c.slug
      ? `/colleges/${c.slug}`
      : `/college?search=${encodeURIComponent(c.name)}`;

  const currentList = data[tabKeyMap[activeTab]];

  return (
    <section className="bg-gradient-to-b from-orange-50 to-orange-50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2
          className="font-extrabold text-center text-gray-900 mb-8 sm:mb-12
          text-xl leading-snug sm:text-3xl md:text-4xl
        "
        >
          Find the Best Colleges, Courses & Exams Tailored to Your Needs
        </h2>

        {/* Show skeletons while loading */}
        {loading && (
          <>
            <MobileSkeleton />
            <DesktopSkeleton />
          </>
        )}

        {/* Real content after load */}
        {!loading && (
          <>
            {/* ═══════════════════════════════════════
                MOBILE layout
            ═══════════════════════════════════════ */}
            <div className="sm:hidden space-y-4">
              {/* Tab switcher */}
              <div className="relative flex w-full bg-white border border-[#D35E45] rounded-full shadow-md overflow-hidden">
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
                    onClick={() => setActiveTab(tab)}
                    className={`relative z-10 flex-1 py-2.5 text-xs font-bold rounded-full transition
                      ${activeTab === tab ? "text-white" : "text-[#D35E45]"}
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Horizontal scrollable chips */}
              <div
                ref={chipScrollRef}
                className="flex gap-2 overflow-x-auto pb-1"
                style={{ scrollbarWidth: "none" }}
              >
                {currentList.map((item, index) => {
                  const isSelected = selectedItem?.name === item.name;
                  const swatch = ICON_SWATCHES[index % ICON_SWATCHES.length];
                  return (
                    <button
                      key={item.name}
                      onClick={() => setSelectedItem(item)}
                      className={`shrink-0 flex items-center gap-2 rounded-full border px-3 py-2 transition-all
                        ${isSelected ? "border-[#d35e45] bg-[#fff0e6] shadow-md" : "border-orange-100 bg-white"}
                      `}
                    >
                      <span
                        className={`h-6 w-6 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br ${swatch.bg}`}
                      >
                        <span
                          className={`text-[10px] font-bold ${swatch.text}`}
                        >
                          {item.name.charAt(0)}
                        </span>
                      </span>
                      <span
                        className={`text-xs font-semibold whitespace-nowrap ${isSelected ? "text-[#d35e45]" : "text-gray-700"}`}
                      >
                        {item.name}
                      </span>
                      {isSelected && (
                        <span className="text-[9px] text-[#d35e45] font-medium whitespace-nowrap">
                          {item.count} {getCountLabel(activeTab)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Panel */}
              {selectedItem && (
                <div className="rounded-2xl border border-orange-100 bg-white/95 shadow-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-extrabold text-gray-900">
                        {selectedItem.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {selectedItem.count} {getCountLabel(activeTab)}{" "}
                        available
                      </p>
                    </div>
                    <Link
                      href={buildHref(selectedItem)}
                      className="shrink-0 bg-[#d25c40] text-white rounded-full px-4 py-2 text-xs font-semibold shadow"
                    >
                      View All →
                    </Link>
                  </div>

                  <Link
                    href="/contactUs"
                    className="flex items-center justify-center w-full border border-[#d25c40] text-[#d25c40] rounded-full py-2 text-xs font-semibold hover:bg-[#fff7ed] transition"
                  >
                    Get Admission Help
                  </Link>

                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-2">
                      Colleges
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {collegesLoading ? (
                        /* College pills loading skeleton */
                        <div className="flex flex-wrap gap-1.5 w-full animate-pulse">
                          {[90, 120, 80, 110, 95, 105, 75, 130].map((w, i) => (
                            <div
                              key={i}
                              className="h-6 bg-orange-100 rounded-full"
                              style={{ width: w }}
                            />
                          ))}
                        </div>
                      ) : relatedColleges.length > 0 ? (
                        relatedColleges.map((college, i) => (
                          <Link
                            key={i}
                            href={buildCollegePillHref(college)}
                            className="bg-orange-50 border border-orange-100 text-gray-700 rounded-full px-2.5 py-1 text-[11px] hover:text-[#d25c40] hover:border-[#d25c40] transition"
                          >
                            {college.name}
                          </Link>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">
                          No colleges found.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ═══════════════════════════════════════
                DESKTOP layout — completely unchanged
            ═══════════════════════════════════════ */}
            <div className="hidden sm:block">
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
                      onClick={() => setActiveTab(tab)}
                      className={`relative z-10 flex-1 flex justify-center items-center gap-2 font-semibold py-3 rounded-full transition
                        ${activeTab === tab ? "text-white" : "text-[#D35E45]"}
                      `}
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
                <div className="rounded-3xl border bg-white/90 p-4 shadow-sm max-h-[480px] overflow-y-auto">
                  <div className="space-y-3">
                    {currentList.map((item, index) => {
                      const isSelected = selectedItem?.name === item.name;
                      const swatch =
                        ICON_SWATCHES[index % ICON_SWATCHES.length];
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
                            <span
                              className={`text-base font-bold ${swatch.text}`}
                            >
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

                <div className="rounded-[32px] border bg-white/90 p-8 shadow-lg space-y-6">
                  {selectedItem ? (
                    <>
                      <h3 className="text-3xl font-extrabold">
                        {selectedItem.name}
                      </h3>
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
                          <div className="flex flex-wrap gap-2 animate-pulse">
                            {[100, 130, 90, 115, 80, 140, 95, 120].map(
                              (w, i) => (
                                <div
                                  key={i}
                                  className="h-7 bg-gray-100 rounded-full"
                                  style={{ width: w }}
                                />
                              ),
                            )}
                          </div>
                        ) : relatedColleges.length > 0 ? (
                          relatedColleges.map((college, i) => (
                            <Link
                              key={i}
                              href={buildCollegePillHref(college)}
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
          </>
        )}
      </div>
    </section>
  );
}
