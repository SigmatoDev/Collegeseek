"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "../BlogCard/BlogCard";
import { api_url } from "@/utils/apiCall";

export default function BlogAll() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <section className="container mx-auto px-6 py-[70px] bg-blue-50">
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8 pb-[20px]">
        College Blog & News
      </h2>

      {error && <p className="text-center text-red-500">{error}</p>}
      {loading && (
        <div className="flex justify-center items-center space-x-2">
          <div className="w-7 h-7 border-5 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
          <p className="text-center py-7 text-gray-600">Loading blogs...</p>
        </div>
      )}

      {!loading && blogs.length === 0 && (
        <p className="text-center text-gray-600">No blogs available.</p>
      )}

      {!loading && blogs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {blogs.map((blog, index) => (
            <BlogCard key={blog.id || index} {...blog} />
          ))}
        </div>
      )}
    </section>
  );
}
