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

  const getImageUrl = (image: string) =>
    image
      ? `${img_url}uploads/${image.replace(/^\/?uploads\//, "")}`
      : "/logo/logo1.png";

  if (loading)
    return <div className="text-center py-6">Loading featured colleges...</div>;
  if (error)
    return <div className="text-center py-6 text-red-500">{error}</div>;

  return (
    <section className="py-[70px] bg-orange-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-[45px]">
          Featured Colleges
        </h2>

        <div className="relative">
          {/* Left Arrow */}
          <button
            aria-label="Previous"
            className="hidden sm:flex absolute left-[-70px] top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white hover:bg-[#D25C40] rounded-full transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ArrowLeft size={25} />
          </button>

          {/* Swiper */}
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={16}
            loop={true}
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
              0: { slidesPerView: 1 },
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
          >
            {colleges.map((college) => (
              <SwiperSlide key={college._id}>
                <Link
                  href={`/colleges/${college.slug || college._id}`}
                  className="block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-[341px] flex-col justify-between"
                >
                  <div className="w-full h-[200px] relative">
                    <Image
                      src={getImageUrl(college.image)}
                      alt={college.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="absolute inset-0"
                    />
                  </div>

                  <div className="p-4 flex flex-col justify-between">
                    <h3
                      className="text-lg font-semibold text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap"
                      title={college.name}
                    >
                      {college.name}
                    </h3>

                    <div className="flex items-center text-sm text-gray-500 mt-1 mb-4">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      {college.city}, {college.state}
                    </div>

                    <span className="inline-block w-full text-center bg-[#D25C40] text-white px-4 py-2 rounded-md font-medium transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-sm">
                      View Details
                    </span>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination */}
          <div className="custom-swiper-pagination flex justify-center mt-6 p-[1px]" />

          {/* Right Arrow */}
          <button
            aria-label="Next"
            className="hidden sm:flex absolute right-[-70px] top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white hover:bg-[#D25C40] rounded-full transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ArrowRight size={25} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedColleges;
