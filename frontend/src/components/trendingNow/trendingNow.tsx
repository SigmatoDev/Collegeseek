"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface TrendingEntry {
  name: string;
  link?: string;
}

function extractExamKey(name: string): string {
  if (!name) return "";
  const paren = name.match(/\(([^)]+)\)/);
  if (paren && paren[1]) return paren[1].trim();
  const caps = name.match(/\b([A-Z]{2,})\b/);
  if (caps && caps[1]) return caps[1];
  const first = name.split(/\s+/)[0].replace(/[^a-zA-Z0-9]/g, "");
  return first || name;
}

// ── Mobile skeleton ──────────────────────────────────────────────
function MobileSkeleton() {
  // varying widths to look like real exam name pills
  const widths = [72, 90, 64, 100, 80, 68, 110, 76];
  return (
    <div className="sm:hidden animate-pulse">
      <div className="relative w-full overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-[#fef9f6] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-[#fbf6ff] to-transparent z-10" />

        {/* Pill row */}
        <div className="flex gap-2 px-4 py-3 overflow-hidden">
          {widths.map((w, i) => (
            <div
              key={i}
              className="shrink-0 h-7 rounded-full bg-gray-200"
              style={{ width: w }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Desktop skeleton ─────────────────────────────────────────────
function DesktopSkeleton() {
  const widths = [110, 130, 95, 150, 120, 100, 140, 115, 90, 135];
  return (
    <div className="hidden sm:block animate-pulse">
      <div className="relative w-full overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#fef9f6] to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#fbf6ff] to-transparent z-10" />

        <div className="flex gap-6 px-10 py-6 overflow-hidden">
          {widths.map((w, i) => (
            <div
              key={i}
              className="shrink-0 h-11 rounded-full bg-gray-200"
              style={{ width: w }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const accentDots = ["bg-[#F97316]", "bg-[#D946EF]", "bg-[#0EA5E9]", "bg-[#22C55E]"];
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const buildApiUrl = (path: string) => {
  if (!API_BASE_URL) return null;
  try {
    return new URL(path, API_BASE_URL).toString();
  } catch {
    return null;
  }
};

const TrendingNow = () => {
  const [exams, setExams] = useState<TrendingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrendingExams = async () => {
      const trendingNowUrl = buildApiUrl("get/trendingNow");
      if (!trendingNowUrl) {
        console.error(
          "TrendingNow: NEXT_PUBLIC_API_URL is missing or invalid.",
          API_BASE_URL
        );
        setError("Failed to fetch trending exams.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(trendingNowUrl);
        if (Array.isArray(response.data)) {
          setExams(
            response.data.map((item: any) => ({
              name: item.name,
              link: item.link,
            }))
          );
        } else {
          setError("Unexpected response format.");
        }
      } catch (err: any) {
        console.error("Error fetching trending exams:", err);
        setError("Failed to fetch trending exams.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingExams();
  }, []);

  const repeatedExams = [...exams, ...exams];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#fef9f6] to-[#ffeee9]">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-10 left-1/4 h-40 w-40 rounded-full bg-[#ffeee9] blur-3xl" />
        <div className="absolute top-10 right-1/4 h-52 w-52 rounded-full bg-[#ffeee9] blur-[90px]" />
      </div>

      <div className="relative mx-auto flex max-w-8xl flex-col items-center text-center">

        {/* ── Skeletons while loading ── */}
        {loading && (
          <>
            <MobileSkeleton />
            <DesktopSkeleton />
          </>
        )}

        {/* ── Error ── */}
        {!loading && error && (
          <p className="text-red-600 text-center py-4">{error}</p>
        )}

        {/* ── Real marquee ── */}
        {!loading && !error && (
          <div className="group relative w-full overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-10 md:w-32 bg-gradient-to-r from-[#fef9f6] to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-10 md:w-32 bg-gradient-to-l from-[#fbf6ff] to-transparent z-10" />

            <div className="whitespace-nowrap animate-marquee group-hover:pause flex w-max gap-3 md:gap-6 px-4 md:px-10 py-3 md:py-6 text-base">
              {repeatedExams.map((exam, index) => {
                const examParam = extractExamKey(exam.name);
                const fallbackHref = `/college?page=1&exams=${encodeURIComponent(examParam)}`;
                const href = exam.link?.trim() ? exam.link : fallbackHref;
                const isExternal = /^https?:\/\//i.test(href);

                return (
                  <Link
                    key={`${exam.name}-${index}`}
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="
                      inline-flex items-center rounded-full border border-white/60
                      bg-white/90 font-semibold text-gray-900
                      shadow-[0_12px_30px_rgba(210,92,64,0.18)]
                      transition duration-300 ease-out
                      hover:-translate-y-0.5
                      hover:shadow-[0_15px_45px_rgba(210,92,64,0.28)]
                      gap-2 px-3 py-1.5 text-xs
                      md:gap-3 md:px-6 md:py-3 md:text-base
                    "
                  >
                    <span
                      className={`rounded-full ${accentDots[index % accentDots.length]} h-2 w-2 md:h-2.5 md:w-2.5`}
                    />
                    {exam.name}
                    <span className="hidden md:inline text-xs uppercase tracking-[0.3em] text-gray-400">
                      explore
                    </span>
                  </Link>
                );
              })}

              {exams.length === 0 && (
                <span className="text-gray-500">No trends available right now.</span>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default TrendingNow;
