"use client";

import React from "react";
import { Clock, DollarSign, ArrowRightCircle } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  title: string;
  description: string;
  duration: string;
  fees: string;
  id: string;
  slug: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  duration,
  fees,
  id,
  slug,
}) => {
  console.log("slug" , slug)
  return (
    <div className="relative max-w-3xl w-full bg-white border border-gray-100 rounded-2xl shadow-md p-6 transition-transform hover:scale-[1.02] hover:shadow-lg duration-300">
      {/* Title */}
      <h2 className="text-2xl font-bold text-blue-700 mb-4">{title}</h2>

      {/* Info Boxes */}
      <div className="flex flex-wrap gap-4 mb-5">
        <div className="flex items-center gap-3 px-3 py-2.5 bg-blue-50 rounded-lg border text-sm w-44">
          <Clock className="text-blue-500" size={18} />
          <div>
            <p className="text-gray-500 text-xs">Duration</p>
            <p className="font-medium text-gray-700 text-sm">{duration}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-3 py-2.5 bg-green-50 rounded-lg border text-sm w-44">
          <DollarSign className="text-green-500" size={18} />
          <div>
            <p className="text-gray-500 text-xs">Fees</p>
            <p className="font-medium text-gray-700 text-sm">{fees}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-6 line-clamp-3">{description}</p>

      {/* View Details */}
      <div className="flex justify-start">
      <Link href={`/courses/${encodeURIComponent(title)}`} className="group">
      <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-blue-600 border border-blue-600 rounded-xl transition-all group-hover:bg-blue-600 group-hover:text-white">
            View Details
            <ArrowRightCircle size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
