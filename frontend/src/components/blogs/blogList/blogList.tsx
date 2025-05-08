"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";  // Import pagination CSS
import { Navigation, Pagination } from "swiper/modules";  // Import Pagination module
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
        College Blog & News
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
        <div className="relative max-w-5xl mx-auto">
          {/* Left Arrow (hidden on mobile) */}
          <button
            aria-label="Previous blog"
            className="hidden sm:flex absolute left-[-70px] top-1/2 transform -translate-y-1/2 z-10 p-3 bg-gray-200 hover:bg-gray-300 rounded-full transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ArrowLeft size={25} />
          </button>

          {/* Swiper Carousel */}
          <Swiper
            modules={[Navigation, Pagination]}  // Add Pagination module
            spaceBetween={16}
            loop={true}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            pagination={{
              clickable: true,  // Makes the dots clickable
              el: '.swiper-pagination',  // Add the pagination class to target it
            }}
            breakpoints={{
              0: { slidesPerView: 1 },       // Mobile: 1 blog
              640: { slidesPerView: 1 },     // Small screens: still 1
              768: { slidesPerView: 2 },     // Tablet: 2 blogs
              1024: { slidesPerView: 3 },    // Desktop: 3 blogs
            }}
          >
            {blogs.map((blog, index) => (
              <SwiperSlide key={blog.id || index}>
                <BlogCard {...blog} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Right Arrow (hidden on mobile) */}
          <button
            aria-label="Next blog"
            className="hidden sm:flex absolute right-[-70px] top-1/2 transform -translate-y-1/2 z-10 p-3 bg-gray-200 hover:bg-gray-300 rounded-full transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ArrowRight size={25} />
          </button>

          {/* Pagination Dots */}
          <div className="swiper-pagination absolute bottom-[-40px] left-1/2 transform -translate-x-1/2"></div>
        </div>
      )}
    </section>
  );
}
