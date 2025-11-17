"use client";

import Image from "next/image";
import Link from "next/link";

interface CityCard {
  name: string;
  image: string;
  colleges: number;
  courses: number;
  slug?: string;
}

const CITIES: CityCard[] = [
  {
    name: "Bengaluru",
    image: "/image/cities/bangalore.webp",
    colleges: 134,
    courses: 742,
  },
  {
    name: "Mumbai",
    image: "/image/cities/mumbai.webp",
    colleges: 118,
    courses: 588,
  },
  {
    name: "Delhi NCR",
    image: "/image/cities/delhi.webp",
    colleges: 142,
    courses: 812,
  },
  {
    name: "Pune",
    image: "/image/cities/pune.webp",
    colleges: 96,
    courses: 468,
  },
  {
    name: "Hyderabad",
    image: "/image/cities/hyderbad.webp",
    colleges: 101,
    courses: 452,
  },
  {
    name: "Chennai",
    image: "/image/cities/chennai.webp",
    colleges: 89,
    courses: 397,
  },
  {
    name: "Kolkata",
    image: "/image/cities/kolkata.webp",
    colleges: 74,
    courses: 312,
  },
  {
    name: "Ahmedabad",
    image: "/image/cities/ahmedabad.webp",
    colleges: 62,
    courses: 295,
  },
];

const TopStudyCities = () => {
  return (
    <section className="relative py-12">
      <div className="absolute inset-0 bg-gradient-to-r from-[#fff1e7] via-[#f2e9ff] to-[#ece4ff]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,214,106,0.35),_transparent_55%)]" />
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#c25541]">
              Top Study Places
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Discover the cities students love the most
            </h3>
          </div>
          <p className="text-sm text-gray-500 max-w-md">
            Explore curated college lists by city and find programs that match
            your goals and lifestyle.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CITIES.map((city, index) => (
            <Link
              key={city.name}
              href={`/college?cities=${encodeURIComponent(city.slug || city.name)}`}
              className="group relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-white/90 to-white/60 shadow-[0_18px_40px_rgba(99,93,193,0.14)] transition hover:-translate-y-1.5"
            >
              <div className="flex items-center gap-4 px-5 pt-5">
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-inner">
                  <Image
                    src={city.image}
                    alt={`${city.name} icon`}
                    fill
                    sizes="64px"
                    className="object-contain p-2"
                  />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{city.name}</p>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#c25541]">
                    #{String(index + 1).padStart(2, "0")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 px-5 pb-5 pt-3">
                <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-gray-700">
                  <div className="rounded-2xl border border-[#fdd5c4] bg-gradient-to-br from-[#fff5f1] to-[#ffe4d4] px-3 py-2 text-center shadow-sm">
                    <p className="text-[10px] uppercase tracking-wide text-[#d35c40]">
                      Colleges
                    </p>
                    <p className="text-base font-bold text-gray-900">
                      {city.colleges.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#d8cffc] bg-gradient-to-br from-[#f9f7ff] to-[#eceaff] px-3 py-2 text-center shadow-sm">
                    <p className="text-[10px] uppercase tracking-wide text-[#5b4fc9]">
                      Courses
                    </p>
                    <p className="text-base font-bold text-gray-900">
                      {city.courses.toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#c25541] opacity-0 transition group-hover:opacity-100">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopStudyCities;
