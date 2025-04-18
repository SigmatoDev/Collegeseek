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
    <div className="relative max-w-3xl w-full bg-gray-50 border border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl p-8 transition-all duration-300 group">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 group-hover:text-blue-700 transition-colors duration-300">
        {title}
      </h2>
  
      {/* Info Boxes */}
      <div className="flex flex-wrap gap-5 mb-6">
        {/* Duration */}
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl w-48 transition hover:shadow-sm">
          <Clock className="text-blue-600" size={20} />
          <div>
            <p className="text-xs text-gray-500">Duration</p>
            <p className="text-sm font-medium text-gray-800">{duration}</p>
          </div>
        </div>
  
        {/* Fees */}
        <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-100 rounded-xl w-48 transition hover:shadow-sm">
          <DollarSign className="text-green-600" size={20} />
          <div>
            <p className="text-xs text-gray-500">Fees</p>
            <p className="text-sm font-medium text-gray-800">{fees}</p>
          </div>
        </div>
      </div>
  
      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-8 line-clamp-3">
        {description}
      </p>
  
      {/* View Details Button */}
      <div className="flex">
        <Link href={`/courses/${encodeURIComponent(title)}`} className="group inline-block">
          <button className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-full transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md hover:shadow-lg">
            View Details
            <ArrowRightCircle size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
