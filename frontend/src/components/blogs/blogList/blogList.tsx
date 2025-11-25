"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { api_url } from "@/utils/apiCall";

export default function BlogList() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageFallbacks, setImageFallbacks] = useState<Record<number, string>>(
    {}
  );

  const fallbackImages = Array.from(
    { length: 8 },
    (_, idx) => `/image/fallback/fallback-${idx + 1}.webp`
  );

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${api_url}blog`);
        setBlogs(response.data);
      } catch (err: any) {
        setError("Failed to fetch blogs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="container-1 mx-auto px-4 sm:px-6 py-[70px] bg-white">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-8">
        Blog & News
      </h2>

      {error && <p className="text-center text-red-500">{error}</p>}

      {loading && (
        <div className="flex justify-center items-center space-x-2">
          <div className="w-7 h-7 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      )}

      {!loading && blogs.length === 0 && (
        <p className="text-center text-gray-600">No blogs available.</p>
      )}

      {!loading && blogs.length > 0 && (
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {blogs.slice(0, 4).map((blog, index) => {
            // Build correct image URL: remove "/api"
            const baseURL = api_url.replace("/api", "");

            const resolvedImage =
              imageFallbacks[index] || // use fallback only if broken earlier
              (blog.image && blog.image.trim()
                ? `${baseURL}${blog.image.replace(/^\/+/, "")}` // use real blog image
                : fallbackImages[index % fallbackImages.length]); // fallback if blog image missing

            return (
              <article
                key={blog.id || index}
                className="flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_18px_40px_rgba(62,44,92,0.15)]"
              >
                <div className="relative h-52 w-full">
                  <Image
                    src={resolvedImage}
                    alt={blog.title || "Blog image"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    onError={() => {
                      const nextFallback =
                        fallbackImages[index % fallbackImages.length];

                      setImageFallbacks((prev) => ({
                        ...prev,
                        [index]: nextFallback, // store fallback only if blog image breaks
                      }));
                    }}
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <span className="inline-flex w-max rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-[#c25541]">
                    {blog.category || "Updates"}
                  </span>

                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-3">
                    {blog.description}
                  </p>

                  <Link
                    href={blog.slug ? `/blogs/${blog.slug}` : "/blogs"}
                    className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#c25541] hover:gap-3"
                  >
                    Read the story
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
