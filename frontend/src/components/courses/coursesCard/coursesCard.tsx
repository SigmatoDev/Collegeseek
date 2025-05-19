"use client";

import React, { useState } from "react";
import { ArrowRightCircle } from "lucide-react";
import Link from "next/link";
import { ClockIcon, CurrencyRupeeIcon } from "@heroicons/react/24/outline";

interface CourseCardProps {
  title: string;
  description: string;
  duration: string;
  fees: string;
  id: string;
  slug: string;
  image: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  duration,
  fees,
  id,
  slug,
  image,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const specialization = title; // You can replace this with a dedicated prop if available

  console.log("Specialization for URL:", specialization);

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      <div className="flex gap-4">
        <div className="w-48 h-32">
          <img
            src={image}
            alt={title}
            width={192}
            height={128}
            className="w-full h-full rounded-lg object-cover cursor-pointer"
            loading="lazy"
            onError={(e) =>
              (e.currentTarget.src = "/logo/logo-removebg-preview.png")
            }
          />
        </div>
        <div className="flex flex-col justify-between flex-1">
          <h2 className="text-xl font-semibold">{title}</h2>

          <div className="flex flex-wrap gap-4 mb-2 mt-3">
            <div className="flex px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl w-fit transition hover:shadow-sm">
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                  <ClockIcon className="h-4 w-4" />
                  <span>Duration</span>
                </div>
                <p className="text-sm font-medium text-gray-800 ml-6">
                  {duration}
                </p>
              </div>
            </div>

            <div className="flex px-2 py-1 bg-green-50 border border-green-100 rounded-xl w-fit transition hover:shadow-sm">
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                  <CurrencyRupeeIcon className="h-4 w-4" />
                  <span>Fees</span>
                </div>
                <p className="text-sm font-medium text-gray-800 ml-6">
                  Rs. {fees}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            <p>
              {isExpanded ? description : `${description.slice(0, 150)}...`}
            </p>
            {description.length > 150 && (
              <button
                className="text-blue-500 text-xs font-semibold focus:outline-none"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="border-t mt-4 pt-2 flex justify-between text-sm text-[#441A6B]">
        <div className="flex gap-2">
          <Link
            href={`/college?specializations=${encodeURIComponent(
              specialization
            )}`}
            passHref
          >
            <button className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#38337E] rounded-lg transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md hover:shadow-lg">
              View Details
              <ArrowRightCircle
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
