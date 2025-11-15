"use client";

import Link from "next/link";

const CITIES = [
  { name: "Bengaluru", tagline: "Tech Capital", emoji: "💻" },
  { name: "Mumbai", tagline: "Finance & Media", emoji: "🏙️" },
  { name: "Delhi NCR", tagline: "Policy & Research", emoji: "🏛️" },
  { name: "Pune", tagline: "Start-up Hub", emoji: "🚀" },
  { name: "Hyderabad", tagline: "Innovation Powerhouse", emoji: "⚙️" },
  { name: "Chennai", tagline: "Engineering & Design", emoji: "🧠" },
  { name: "Kolkata", tagline: "Culture & Liberal Arts", emoji: "🎭" },
  { name: "Ahmedabad", tagline: "Management & Commerce", emoji: "📊" },
];

const TopStudyCities = () => {
  return (
    <section className="relative py-12">
      <div className="absolute inset-0 bg-gradient-to-r from-[#fff1e7] via-[#f2e9ff] to-[#ece4ff]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(146,116,255,0.35),_transparent_55%)]" />
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CITIES.map((city) => (
            <Link
              key={city.name}
              href={`/college?cities=${encodeURIComponent(city.name)}`}
              className="group relative overflow-hidden rounded-2xl bg-white/95 shadow-[0_14px_40px_rgba(99,93,193,0.18)] border border-white/60 px-4 py-5 transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(99,93,193,0.25)]"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl drop-shadow-sm">{city.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {city.name}
                  </p>
                  <p className="text-xs text-gray-500">{city.tagline}</p>
                </div>
              </div>
              <span className="absolute right-4 top-4 text-xs font-semibold text-[#c25541] opacity-0 group-hover:opacity-100 transition">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopStudyCities;
