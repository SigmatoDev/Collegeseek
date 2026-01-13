"use client";

export default function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 sm:p-6 animate-pulse flex flex-col justify-between">
      {/* Category */}
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />

      {/* Specialization */}
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-4" />

      {/* Description */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>

      {/* Details */}
      <div className="mt-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>

      {/* Buttons */}
      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <div className="h-10 bg-gray-300 rounded-lg w-full sm:w-32" />
        <div className="h-10 bg-gray-200 rounded-lg w-full sm:w-32" />
      </div>
    </div>
  );
}
