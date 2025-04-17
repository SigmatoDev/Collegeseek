"use client";

import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

const categories = [
  "Academics",
  "Campus Life",
  "Career & Internships",
  "Technology & Innovation",
  "Student Wellness",
];

const blogs = [
  {
    title: "Exam Preparation Strategies",
    category: "Academics",
    image: "/image/1.jpg", // Ensure this exists in the 'public/image/' folder
    description: "Effective study techniques to ace your exams.",
  },
  {
    title: "Top Research Projects of 2025",
    category: "Academics",
    image: "/image/3.jpg", // Ensure this exists in the 'public/image/' folder
    description: "Discover groundbreaking studies happening at your college.",
  },
  {
    title: "Top Research Projects of 2025",
    category: "Academics",
    image: "/image/4.avif",
    description: "Discover groundbreaking studies happening at your college.",
  },
  {
    title: "Annual College Fest Highlights",
    category: "Campus Life",
    image: "https://source.unsplash.com/400x300/?festival,students",
    description: "A recap of the most exciting moments from this year’s college festival.",
  },
  {
    title: "Internship Guide for Students",
    category: "Career & Internships",
    image: "https://source.unsplash.com/400x300/?office,internship",
    description: "How to land your dream internship while studying.",
  },
  {
    title: "AI & Robotics in Education",
    category: "Technology & Innovation",
    image: "https://source.unsplash.com/400x300/?robotics,AI",
    description: "How AI is shaping the future of learning.",
  },
  {
    title: "Managing Stress Before Exams",
    category: "Student Wellness",
    image: "https://source.unsplash.com/400x300/?meditation,stress",
    description: "Simple ways to stay calm and focused before your exams.",
  },
];

export default function BlogNewsSection() {
  const [activeCategory, setActiveCategory] = useState("Academics");
  const swiperRef = useRef<any>(null);

  return (
    <section className="container mx-auto px-6 py-12">
      {/* Section Header */}
      <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
        College Blog & News
      </h2>

      {/* Categories */}
      <div className="flex justify-center flex-wrap gap-4 mb-10">
        {/* {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-3 text-sm md:text-base font-semibold rounded-full transition-all duration-300 ${
              activeCategory === cat
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))} */}
      </div>

      {/* Slider Wrapper with Buttons */}
      <div className="relative max-w-5xl mx-auto">
        {/* Left Slide Button */}
        <button
          className="absolute left-[-50px] top-1/2 transform -translate-y-1/2 z-10 p-3 bg-gray-200 hover:bg-gray-300 rounded-full transition-all shadow-md"
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <ArrowLeft size={28} />
        </button>

        {/* Blogs Carousel */}
        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {blogs
            .filter((blog) => blog.category === activeCategory)
            .map((blog, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white shadow-xl rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl h-[430px] mb-1 flex flex-col">
                  <div className="relative w-full h-56">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-xl"
                      unoptimized={blog.image.includes("unsplash.com")} // Avoid Next.js optimization for Unsplash images
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-3 flex-grow">
                      {blog.description}
                    </p>
                    <button className="mt-4 inline-block text-blue-600 font-semibold text-sm hover:underline">
                      Read More →
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>

        {/* Right Slide Button */}
        <button
          className="absolute right-[-50px] top-1/2 transform -translate-y-1/2 z-10 p-3 bg-gray-200 hover:bg-gray-300 rounded-full transition-all shadow-md"
          onClick={() => swiperRef.current?.slideNext()}
        >
          <ArrowRight size={28} />
        </button>
      </div>
    </section>
  );
}
