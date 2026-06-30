"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { api_url } from "@/utils/apiCall";
import { colors } from "@/theme/colors";

export default function BlogList() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageFallbacks, setImageFallbacks] = useState<Record<number, string>>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fallbackImages = Array.from(
    { length: 8 },
    (_, idx) => `/image/fallback/fallback-${idx + 1}.webp`
  );

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${api_url}blog`);
        setBlogs(response.data);
        console.log("Fetched blogs:", response.data);
      } catch (err: any) {
        setError("Failed to fetch blogs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

const getImage = (blog: any, index: number) => {
  if (imageFallbacks[index]) return imageFallbacks[index];

  if (blog.image && blog.image.trim()) {
    return blog.image; // ✅ Direct S3 URL
  }

  return fallbackImages[index % fallbackImages.length];
};
  const onImgError = (index: number) =>
    setImageFallbacks((prev) => ({
      ...prev,
      [index]: fallbackImages[index % fallbackImages.length],
    }));

  // Snap to card on dot click
  const goTo = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;
    const cardWidth = container.offsetWidth;
    container.scrollTo({ left: cardWidth * index, behavior: "smooth" });
    setActiveIndex(index);
  };

  // Track active dot while swiping
  const onScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    const index = Math.round(container.scrollLeft / container.offsetWidth);
    setActiveIndex(index);
  };

  const visibleBlogs = blogs.slice(0, 5);

  return (
    <section className="py-10 sm:py-[60px]" style={{ backgroundColor: "#fdfeff" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading with View All in same row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-12">
          <div>
            <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl" style={{ color: "#003577" }}>
              Blog & News
            </h2>
            <p className="text-gray-500 mt-1 text-sm sm:text-base font-light">
              Stay updated with the latest insights, exam updates and college news
            </p>
          </div>  
          <Link
            href="/latestUpdate"
            className="inline-flex items-center gap-1 text-sm font-semibold transition-all hover:opacity-80 mt-3 sm:mt-0 shrink-0"
            style={{
              color: "#1d8dbf"
            }}
          >
            View all articles
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {error && <p className="text-center text-red-500">{error}</p>}

        {loading && (
          <>
            {/* Mobile skeleton — single card */}
            <div className="sm:hidden mt-6 space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_18px_40px_rgba(62,44,92,0.08)] overflow-hidden animate-pulse">
                <div className="h-34 w-full bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-20 bg-gray-200 rounded-full" />
                  <div className="h-4 w-full bg-gray-200 rounded-full" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
                  <div className="h-3 w-full bg-gray-100 rounded-full" />
                  <div className="h-3 w-5/6 bg-gray-100 rounded-full" />
                  <div className="h-4 w-24 bg-gray-200 rounded-full mt-2" />
                </div>
              </div>
              {/* Skeleton dots */}
              <div className="flex justify-center gap-2 mt-4">
                {[0,1,2,3].map(i => (
                  <div key={i} className={`rounded-full bg-gray-200 animate-pulse ${i === 0 ? "w-5 h-2" : "w-2 h-2"}`} />
                ))}
              </div>
            </div>

            {/* Desktop skeleton — 4 cards */}
            <div className="hidden sm:grid mt-12 gap-6 md:grid-cols-2 lg:grid-cols-5">
              {[0,1,2,3,4].map(i => (
                <div key={i} className="flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_18px_40px_rgba(62,44,92,0.08)] animate-pulse">
                  <div className="h-34 w-full bg-gray-200" />
                  <div className="flex flex-col gap-3 p-5">
                    <div className="h-5 w-20 bg-gray-200 rounded-full" />
                    <div className="h-5 w-full bg-gray-200 rounded-full" />
                    <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
                    <div className="h-3 w-full bg-gray-100 rounded-full" />
                    <div className="h-3 w-5/6 bg-gray-100 rounded-full" />
                    <div className="h-3 w-4/6 bg-gray-100 rounded-full" />
                    <div className="h-4 w-28 bg-gray-200 rounded-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && blogs.length === 0 && (
          <p className="text-center text-gray-600">No blogs available.</p>
        )}

        {!loading && blogs.length > 0 && (
          <>
            {/* ══════════════════════════════════════════
                MOBILE: swipeable single-card slider + dot pagination
            ══════════════════════════════════════════ */}
            <div className="sm:hidden mt-6">

              {/* Scroll container — each card = 100% width, snaps */}
              <div
                ref={scrollRef}
                onScroll={onScroll}
                className="flex overflow-x-auto snap-x snap-mandatory"
                style={{ scrollbarWidth: "none" }}
              >
                {visibleBlogs.map((blog, index) => (
                  <div
                    key={blog.id || index}
                    className="flex-shrink-0 w-full snap-start"
                  >
                    <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_18px_40px_rgba(62,44,92,0.15)] mx-0.5">
                      {/* Image */}
                      <div className="relative w-full h-34">
                        <Image
                          src={getImage(blog, index)}
                          alt={blog.title || "Blog image"}
                          fill
                          sizes="100vw"
                          className="object-cover"
                          onError={() => onImgError(index)}
                        />
                      </div>
                      {/* Content */}
                      <div className="flex flex-col gap-2 p-4">
                        <span className="inline-flex w-max rounded-full bg-orange-100 text-[#c25541] font-semibold px-2.5 py-1 text-[11px]">
                          {blog.category || "Updates"}
                        </span>
                        <h3 className="text-base font-bold text-gray-900 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-3">
                          {blog.description}
                        </p>
                        <Link
                          href={blog.slug ? `/blogs/${blog.slug}` : "/blogs"}
                          className="mt-1 inline-flex items-center gap-1 text-xs font-semibold transition-all"
                          style={{ color: colors.accent.red }}
                        >
                          Read the story <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </article>
                  </div>
                ))}
              </div>

              {/* Dot pagination */}
              <div className="flex justify-center items-center gap-2 mt-4">
                {visibleBlogs.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`rounded-full transition-all duration-300 ${
                      activeIndex === i
                        ? "bg-[#d25c40] w-5 h-2"
                        : "bg-gray-300 w-2 h-2"
                    }`}
                    aria-label={`Go to blog ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* ══════════════════════════════════════════
                DESKTOP: grid with 5 columns
            ══════════════════════════════════════════ */}
            <div className="hidden sm:grid mt-6 gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
              {visibleBlogs.map((blog, index) => (
                <article
                  key={blog.id || index}
                  className="flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_18px_40px_rgba(62,44,92,0.15)] transition-all duration-300 hover:shadow-[0_18px_40px_rgba(227,82,53,0.25)] hover:-translate-y-1"
                >
                  <div className="relative h-34 w-full">
                    <Image
                      src={getImage(blog, index)}
                      alt={blog.title || "Blog image"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      onError={() => onImgError(index)}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <span className="inline-flex w-max rounded-full bg-orange-100 px-3 py-1 text-[8px] font-semibold text-[#c25541]">
                      {blog.category || "Updates"}
                    </span>
                    <h3 className="text-xs font-semibold text-gray-900 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-3 font-light">
                      {blog.description}
                    </p>
                    <Link
                      href={blog.slug ? `/blogs/${blog.slug}` : "/blogs"}
                      className="mt-auto inline-flex items-center gap-2 text-xs font-semibold transition-all hover:gap-3"
                      style={{ color: colors.accent.red }}
                    >
                      Read the story <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}