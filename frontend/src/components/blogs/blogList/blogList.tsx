"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import BlogCard from "../BlogCard/BlogCard";
import { api_url } from "@/utils/apiCall";

export default function BlogList() {
  const swiperRef = useRef<any>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        console.log("Fetching blogs from:", `${api_url}blog`);
        const response = await axios.get(`${api_url}blog`);
        console.log("Fetched blogs:", response.data);
        setBlogs(response.data);
      } catch (err: any) {
        console.error("Error fetching blogs:", err.response?.status, err.response?.data);
        setError("Failed to fetch blogs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="container-1 mx-auto px-6 py-[70px] bg-blue-50">
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
    <div className="relative max-w-5xl mx-auto">
      <button
        aria-label="Previous blog"
        className="absolute left-[-70px] top-1/2 transform -translate-y-1/2 z-10 p-3 bg-gray-200 hover:bg-gray-300 rounded-full transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        onClick={() => swiperRef.current?.slidePrev()}
      >
        <ArrowLeft size={25} />
      </button>

      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={3}
        loop={true}
        autoplay={{ delay: 3000 }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {blogs.map((blog, index) => (
          <SwiperSlide key={blog.id || index}>
            <BlogCard {...blog} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        aria-label="Next blog"
        className="absolute right-[-70px] top-1/2 transform -translate-y-1/2 z-10 p-3 bg-gray-200 hover:bg-gray-300 rounded-full transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => swiperRef.current?.slideNext()}
      >
        <ArrowRight size={25} />
      </button>
    </div>
  )}
</section>

  );
}
