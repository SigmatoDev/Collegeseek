"use client";

import CourseCardSkeleton from "./courseCardSkeleton";


interface Props {
  count?: number;
}

export default function CourseListSkeleton({ count = 6 }: Props) {
  return (
    <div className="my-6 py-8 bg-gray-200 px-4 sm:px-8 md:px-12 lg:px-[70px]">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-10">
        Explore Our Courses
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {[...Array(count)].map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
