'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import { api_url, img_url } from "@/utils/apiCall";
import Image from "next/image";
import DOMPurify from "dompurify"; // Import DOMPurify for sanitizing

interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  createdAt: string;
}

// Define BlogDetailsProps interface to accept 'slug' as a prop
interface BlogDetailsProps {
  slug: string;
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ slug }) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      console.error("❌ Invalid slug");
      setError("Invalid blog slug.");
      setLoading(false);
      return;
    }

    const fetchBlogBySlug = async () => {
      console.log(`📡 Fetching blog from: ${api_url}blog?slug=${slug}`);
      try {
        const response = await axios.get(`${api_url}blog?slug=${slug}`);
        console.log("✅ Blog fetched:", response.data);

        if (response.data && response.data.length > 0) {
          setBlog(response.data[0]); // Assuming you're getting an array of blogs and using the first one.
        } else {
          console.warn("⚠️ No blog returned from API");
          setError("Blog not found.");
        }
      } catch (err: any) {
        console.error("❌ Error fetching blog by slug:", err.response?.status, err.response?.data);
        const errorMessage = err.response?.data?.message || "Blog not found or an error occurred.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogBySlug();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-16 h-16 border-4 border-gradient-to-r from-blue-400 via-purple-500 to-pink-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-6 text-center text-red-500">
        <p className="text-lg font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-full hover:from-blue-600 hover:to-indigo-700 transition duration-300"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-6 text-center text-gray-500">
        <p className="text-lg">Blog not found or failed to load content.</p>
      </div>
    );
  }

  // Sanitize the content using DOMPurify
  const sanitizedContent = DOMPurify.sanitize(blog.content);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6">{blog.title}</h1>
      <p className="text-lg text-gray-600 mb-8">
        By <span className="font-semibold text-gray-800">{blog.author}</span> |{" "}
        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Date Unavailable"}
      </p>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Image Section */}
        <div className="bg-gradient-to-r from-blue-50 via-yellow-50 to-blue-50 rounded-2xl p-6 md:w-1/3 justify-center">
          <div className="relative w-full h-80 rounded-xl overflow-hidden">
          <Image
              src={
                blog.image
                  ? `${img_url}${blog.image.replace(/^\/uploads\//, "uploads/")}`
                  : "/uploads/default-placeholder.png"
              }
              alt={blog.title}
              layout="fill"
              objectFit="cover"
              className="rounded-xl transform transition-all duration-300 hover:scale-105"
            />

          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-2/3">
          <div
            className="prose lg:prose-lg max-w-none text-gray-800 space-y-6"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
