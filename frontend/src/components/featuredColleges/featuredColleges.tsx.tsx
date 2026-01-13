"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { api_url, img_url } from "@/utils/apiCall";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import {
  MapPin,
  ChevronLeft as ArrowLeft,
  ChevronRight as ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface College {
  _id: string;
  name: string;
  city: string;
  state: string;
  image: string;
  slug: string;
}

const FeaturedColleges = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fallbackMap, setFallbackMap] = useState<Record<string, string>>({});
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const fetchFeaturedColleges = async () => {
      try {
        const response = await axios.get(`${api_url}featured`);
        if (response.data?.success && Array.isArray(response.data.colleges)) {
          setColleges(response.data.colleges);
        } else {
          setError("No featured colleges found.");
        }
      } catch (error: any) {
        const errMsg =
          error?.response?.data?.message || error.message || "Unknown error";
        setError(`Error: ${errMsg}`);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedColleges();
  }, []);

  const fallbackPool = Array.from({ length: 8 }).map(
    (_, idx) => `/image/fallback/fallback-${idx + 1}.webp`
  );

  const assignFallback = (id: string) => {
    const random =
      fallbackPool[Math.floor(Math.random() * fallbackPool.length)];
    setFallbackMap((prev) => ({ ...prev, [id]: random }));
    return random;
  };

  const getImageUrl = (image: string, id: string) => {
    if (fallbackMap[id]) {
      return fallbackMap[id];
    }
    if (image) {
      return `${img_url}uploads/${image.replace(/^\/?uploads\//, "")}`;
    }
    return assignFallback(id);
  };

  if (loading)
    return <div className="text-center py-6">Loading featured colleges...</div>;
  if (error)
    return <div className="text-center py-6 text-red-500">{error}</div>;

  return (
    <section className="relative pt-6 pb-8 bg-gradient-to-b from-[#fff7f1] via-[#fff0e7] to-[#ffe5d4]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(210,92,64,0.12),_transparent_60%)] pointer-events-none" />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-12 space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 sm:px-6 py-1.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#c25541]">
            Spotlight
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900">
            Featured Colleges
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Handpicked campuses known for outcomes, infrastructure, and holistic
            student experience.
          </p>
        </div>

        {/* Swiper */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            aria-label="Previous"
            className="hidden lg:flex absolute left-[-50px] top-1/2 transform -translate-y-1/2 z-10 p-2 sm:p-3 bg-white hover:bg-[#D25C40] rounded-full transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ArrowLeft size={22} />
          </button>

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={12}
            loop
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            pagination={{
              clickable: true,
              el: ".custom-swiper-pagination",
            }}
            breakpoints={{
              0: { slidesPerView: 1.05 },
              480: { slidesPerView: 1.3 },
              640: { slidesPerView: 1.6 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            {colleges.map((college) => (
              <SwiperSlide key={college._id}>
                <div className="h-full px-1">
                  <Link
                    href={`/colleges/${college.slug || college._id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/95 transition hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative h-[180px] sm:h-[200px] md:h-[210px] w-full">
                      <Image
                        src={getImageUrl(college.image, college._id)}
                        alt={college.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                        onError={() => assignFallback(college._id)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
                      <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                        <p className="text-white text-sm sm:text-lg font-semibold drop-shadow">
                          {college.name}
                        </p>
                        <p className="text-[10px] sm:text-xs text-white/80 flex items-center gap-1">
                          <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          {college.city}, {college.state}
                        </p>
                      </div>
                    </div>

                    {/* Button */}
                    <div className="flex flex-1 flex-col justify-end p-4 sm:p-5">
                      <span className="inline-flex items-center justify-center gap-2 rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#ff8f66] to-[#d95540] shadow-[0_12px_25px_rgba(217,85,64,0.35)] transition group-hover:shadow-[0_16px_32px_rgba(217,85,64,0.45)]">
                        View Details
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                      </span>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination */}
          <div className="custom-swiper-pagination flex justify-center mt-6 p-[1px]" />
          {/* Right Arrow */}
          <button
            aria-label="Next"
            className="hidden lg:flex absolute right-[-50px] top-1/2 transform -translate-y-1/2 z-10 p-2 sm:p-3 bg-white hover:bg-[#D25C40] rounded-full transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ArrowRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedColleges;
