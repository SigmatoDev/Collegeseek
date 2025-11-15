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
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [imageFallbacks, setImageFallbacks] = useState<Record<number, string>>(
    {}
  );
  const swiperRef = useRef<any>(null);
  const fallbackImage = "/image/fallback-image.webp";

  const filteredBlogs = blogs.filter(
    (blog) => blog.category === activeCategory
  );

  return (
    <section className="relative py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-[#fef7f4] via-white to-[#f3f1ff]" />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center text-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#c25541] shadow-sm">
            Trending stories
          </span>
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              College Blog & News
            </h2>
            <p className="max-w-3xl text-sm sm:text-base text-gray-600">
              Insights, campus highlights, and success stories curated for
              curious students and parents. Dive into what’s shaping academia
              today.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#c25541] ${
                activeCategory === category
                  ? "bg-[#c25541] text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#c25541]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="relative mt-12">
          <button
            className="absolute left-[-20px] top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-3 text-gray-700 shadow-lg transition hover:bg-[#c25541] hover:text-white sm:flex"
            aria-label="Previous stories"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ArrowLeft size={24} />
          </button>

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
            {filteredBlogs.map((blog, index) => (
              <SwiperSlide key={`${blog.title}-${index}`}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_20px_60px_rgba(62,44,92,0.12)] backdrop-blur">
                  <div className="relative h-52 w-full overflow-hidden">
                    <Image
                      src={imageFallbacks[index] || blog.image}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                      unoptimized={blog.image.includes("unsplash.com")}
                      onError={() =>
                        setImageFallbacks((prev) => ({
                          ...prev,
                          [index]: fallbackImage,
                        }))
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#c25541]">
                      {blog.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {blog.description}
                    </p>
                    <button className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#c25541] transition group-hover:gap-3">
                      Read the story
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            className="absolute right-[-20px] top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-3 text-gray-700 shadow-lg transition hover:bg-[#c25541] hover:text-white sm:flex"
            aria-label="Next stories"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}
