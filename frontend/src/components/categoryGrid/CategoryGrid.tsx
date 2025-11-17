'use client';

import Link from 'next/link';
import { api_url, img_url } from '@/utils/apiCall';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const tabs = ['Colleges', 'Exams', 'Courses'];

type CategoryItem = {
  name: string;
  count: number;
  icon: string;
  colleges?: string[]; // Add optional colleges property
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
  const [activeTab, setActiveTab] = useState<'Colleges' | 'Exams' | 'Courses'>('Colleges');
  const [data, setData] = useState<CategoryData>({
    Streams: [],
    Exams: [],
    Courses: [],
  });

  const [tabCounts, setTabCounts] = useState<{ [key: string]: number }>({
    Colleges: 0,
    Exams: 0,
    Courses: 0,
  });

  const tabKeyMap: { [label: string]: keyof CategoryData } = {
    Colleges: 'Streams',
    Exams: 'Exams',
    Courses: 'Courses',
  };

  const getCountLabel = (tab: typeof activeTab) => {
    switch (tab) {
      case 'Colleges':
      case 'Exams':
        return 'colleges';
      case 'Courses':
        return 'courses';
      default:
        return '';
    }
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const url = `${api_url}categories`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          const rawText = await response.text();
          console.error('Expected JSON but received:', rawText);
          throw new Error('Invalid response format');
        }
        const result: CategoryData = await response.json();
        setData(result);

        setTabCounts({
          Colleges: result.Streams.reduce((acc, item) => acc + item.count, 0),
          Exams: result.Exams.reduce((acc, item) => acc + item.count, 0),
          Courses: result.Courses.reduce((acc, item) => acc + item.count, 0),
        });
      } catch (error) {
        console.error('Failed to fetch category data:', error);
      }
    };

    fetchCategoryData();
  }, []);

  const formatQuery = (str: string) => encodeURIComponent(str).replace(/%20/g, '+');

  const toTitleCase = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const [selectedItem, setSelectedItem] = useState<CategoryItem | null>(null);
  const [relatedColleges, setRelatedColleges] = useState<
    { name: string; slug?: string }[]
  >([]);
  const [collegesLoading, setCollegesLoading] = useState(false);

  useEffect(() => {
    const list = data[tabKeyMap[activeTab]];
    if (list && list.length > 0) {
      setSelectedItem(list[0]);
    } else {
      setSelectedItem(null);
    }
  }, [activeTab, data]);

  useEffect(() => {
    if (!selectedItem) {
      setRelatedColleges([]);
      return;
    }

    const controller = new AbortController();
    const fetchColleges = async () => {
      setCollegesLoading(true);
      try {
        const filterKey =
          activeTab === 'Exams' ? 'exams' : activeTab === 'Courses' ? 'categories' : 'streams';
        const payload: Record<string, any> = {
          page: 1,
          limit: 15,
          [filterKey]: [selectedItem.name],
        };

        const res = await fetch(`${api_url}get/colleges/filter`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error('Failed to load colleges');
        const response = await res.json();
        const list =
          response?.colleges ||
          response?.data?.colleges ||
          response?.data?.data ||
          response?.data ||
          [];
        const normalized = (Array.isArray(list) ? list : []).map((college: any) => ({
          name:
            college?.name ||
            college?.collegeName ||
            college?.title ||
            college?.institution ||
            'College',
          slug: college?.slug || college?._id,
        }));
        setRelatedColleges(normalized.slice(0, 15));
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Failed to fetch related colleges:', error);
          setRelatedColleges([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setCollegesLoading(false);
        }
      }
    };

    fetchColleges();
    return () => controller.abort();
  }, [selectedItem, activeTab]);

  const buildHref = (item: CategoryItem) => {
    const encoded = formatQuery(activeTab === "Exams" ? toTitleCase(item.name) : item.name);
    if (activeTab === "Exams") {
      return `/college?exams=${encoded}`;
    }
    if (activeTab === "Colleges") {
      return `/college?streams=${encoded}`;
    }
    return `/college?categories=${encoded}`;
  };

  const buildCollegePillHref = (college: { name: string; slug?: string }) => {
    if (college.slug) {
      return `/colleges/${college.slug}`;
    }
    return `/college?search=${encodeURIComponent(college.name)}`;
  };

  return (
    <section className="bg-gradient-to-b from-orange-50 to-orange-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 text-gray-900">
          Find the Best Colleges, Courses & Exams Tailored to Your Needs
        </h2>

        <div role="tablist" aria-label="Category tabs" className="flex justify-center mb-14">
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
                role="tab"
                aria-selected={activeTab === tab}
                tabIndex={activeTab === tab ? 0 : -1}
                onClick={() => setActiveTab(tab as 'Colleges' | 'Exams' | 'Courses')}
                className={`relative z-10 flex-1 flex justify-center items-center gap-2 text-center text-sm sm:text-base font-semibold py-3 transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D35E45] ${
                  activeTab === tab ? 'text-white' : 'text-[#D35E45] hover:bg-orange-50'
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

        <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
          <div className="rounded-3xl border border-white/80 bg-white/90 p-4 shadow-sm max-h-[480px] overflow-y-auto">
            <div className="space-y-3">
              {data[tabKeyMap[activeTab]]?.map((item, index) => {
                const isSelected = selectedItem?.name === item.name;
                const swatch = ICON_SWATCHES[index % ICON_SWATCHES.length];
                const initials = item.name
                  .split(/\s+/)
                  .map((word) => word[0]?.toUpperCase() || "")
                  .join("")
                  .slice(0, 2);
                const isImage = item.icon?.startsWith("http") || item.icon?.startsWith("uploads");

                return (
                  <button
                    key={item.name}
                    onClick={() => setSelectedItem(item)}
                    className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? "border-[#d35e45] bg-[#fff0e6] shadow"
                        : "border-orange-100 hover:border-[#d35e45]/40"
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${swatch.bg}`}
                    >
                      {isImage ? (
                        <img
                          src={item.icon.startsWith("http") ? item.icon : `${img_url}${item.icon}`}
                          alt={item.name}
                          className="h-9 w-9 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <span className={`text-base font-bold ${swatch.text}`}>
                          {initials || item.icon || "#"}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.count} {getCountLabel(activeTab)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/80 bg-white/90 p-8 shadow-lg space-y-6">
            {selectedItem ? (
              <>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d35e45]">
                    {activeTab.slice(0, -1)} Focus
                  </p>
                  <h3 className="text-3xl font-extrabold text-gray-900 mt-2">
                    {selectedItem.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-3">
                    Explore {selectedItem.count.toLocaleString()} curated{" "}
                    {getCountLabel(activeTab)} with detailed insights, placements, and campus life.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Top outcomes
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      Personalized counselling and campus-specific guidance.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Why shortlist
                    </p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      Compare fees, placements, and entrance requirements easily.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3">
            <Link
              href={buildHref(selectedItem)}
              className="inline-flex items-center gap-2 rounded-full bg-[#d25c40] px-6 py-2 text-white text-sm font-semibold shadow-[0_15px_30px_rgba(210,92,64,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(210,92,64,0.45)]"
            >
              View Colleges
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contactUs"
              className="inline-flex items-center gap-2 rounded-full border border-[#d25c40] px-6 py-2 text-sm font-semibold text-[#d25c40] hover:bg-[#fff3ed] transition"
            >
              Get Admission Help
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {collegesLoading ? (
              <span className="text-xs text-gray-500">Loading colleges...</span>
            ) : relatedColleges.length > 0 ? (
              relatedColleges.map((college, idx) => (
                <Link
                  key={`college-pill-${idx}`}
                  href={buildCollegePillHref(college)}
                  className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600 shadow-sm hover:border hover:border-[#d35e45]"
                >
                  {college.name}
                </Link>
              ))
            ) : (
              <span className="text-xs text-gray-500">No colleges found for this selection.</span>
            )}
          </div>
        </div>
              </>
            ) : (
              <p className="text-gray-500 text-sm">No categories available at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
