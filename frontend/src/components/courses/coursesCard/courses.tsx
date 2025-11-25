"use client";

import { api_url } from "@/utils/apiCall";
import { useEffect, useState } from "react";
import EnrollmentModal from "./model/page";
import EnrollmentForm from "./enrollForm/page";
import Loader from "@/components/loader/loader";
import {
  AcademicCapIcon,
  CalendarDaysIcon,
  BookOpenIcon,
  CurrencyRupeeIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

interface Course {
  _id: string;
  specialization: string;
  description: string;
  category: {
    _id: string;
    name: string;
  };
  duration: string;
  programMode: {
    _id: string;
    name: string;
  };
  college_id: string;
  fees?: {
    amount: number;
    currency: string;
    year: number;
  };
  eligibility: string;
  entrance_exam: string;
  application_dates?: {
    start_date: string;
    end_date: string;
  };
  ratings?: {
    score: number;
    reviews_count: number;
  };
  placements?: {
    median_salary: number;
    currency: string;
    placement_rate: number;
  };
  enrollmentLink: string;
  brochure_link: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Specialization {
  _id: string;
  name: string;
}

interface Props {
  college_id: string;
}

export default function CollegeCourses({ college_id }: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(6); // 👈 NEW

  useEffect(() => {
    if (!college_id) {
      setError("College ID is missing.");
      setLoading(false);
      return;
    }

    const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${api_url}c/courses?college_id=${college_id}`;
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`Failed to fetch courses: ${response.statusText}`);
        const data: Course[] = await response.json();
        const filteredCourses = data.filter(
          (course) => course.college_id === college_id
        );
        setCourses(filteredCourses);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSpecializations = async () => {
      try {
        const res = await fetch(`${api_url}get2/Specialization`);
        if (!res.ok) throw new Error("Failed to fetch specializations");
        const data: Specialization[] = await res.json();
        setSpecializations(data);
      } catch (error) {
        console.error("Specialization error:", error);
      }
    };

    fetchCourses();
    fetchSpecializations();
  }, [college_id]);

  const handleOpenModal = (courseId: string) => {
    setIsModalOpen(courseId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(null);
  };

  const getSpecializationName = (id: string): string => {
    return specializations.find((s) => s._id === id)?.name || "Specialization";
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!courses.length)
    return (
      <p className="text-center text-gray-500">
        No courses found for this college.
      </p>
    );

  return (
    <div className="my-5 py-8 bg-gray-200 px-4 sm:px-10 md:px-16 lg:px-[70px]">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black text-center mb-10">
        Explore Our Courses
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.slice(0, visibleCount).map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <h2 className="text-base sm:text-lg font-semibold text-[#403A83] truncate pb-1">
              {course.category?.name || "Category"}{" "}
              <span className="text-gray-500 italic">
                ({getSpecializationName(course.specialization)})
              </span>
            </h2>

            <p className="text-sm sm:text-base text-gray-600 line-clamp-3">
              {course.description}
            </p>

            <div className="mt-4 space-y-3 text-sm sm:text-base text-gray-700">
              <p className="flex items-center gap-2">
                <CalendarDaysIcon className="w-5 h-5 text-[#403A83]" />
                <strong>Duration:</strong> {course.duration}
                <span className="mx-2">|</span>
                <BookOpenIcon className="w-5 h-5 text-[#403A83]" />
                <strong>Program Mode:</strong> {course.programMode?.name}
              </p>

              <p className="flex items-center gap-2">
                <AcademicCapIcon className="w-5 h-5 text-[#403A83]" />
                <strong>Eligibility:</strong> {course.eligibility}
              </p>

              {course.fees && (
                <p className="flex items-center gap-2 font-semibold text-indigo-700">
                  <CurrencyRupeeIcon className="w-5 h-5" />
                  Fees: ₹{course.fees.amount.toLocaleString()}{" "}
                  {course.fees.currency} ({course.fees.year})
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
              <button
                onClick={() => handleOpenModal(course._id)}
                className="bg-[#38347C] text-white px-3 py-3 rounded-lg w-full sm:w-[150px] text-base sm:text-lg font-semibold text-center"
              >
                Enroll now
              </button>

              <button
                onClick={() =>
                  window.open(
                    course.brochure_link,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                className="px-5 py-2 bg-transparent border border-[#D35B42] text-[#D35B42] rounded-lg font-medium hover:bg-[#D35B42] hover:text-white transition duration-200 text-center w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <DocumentArrowDownIcon className="w-5 h-5" />
                Download Brochure
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Show More / Show Less */}
      {courses.length > 6 && (
        <div className="mt-10 flex justify-end">
          {visibleCount < courses.length ? (
            <button
              onClick={() => setVisibleCount(courses.length)}
              className="px-6 py-2 bg-[#38347C] text-white rounded-full font-medium shadow-md hover:shadow-lg hover:bg-[#2f2b6a] transition-all duration-300"
            >
              Show More →
            </button>
          ) : (
            <button
              onClick={() => setVisibleCount(9)}
              className="px-6 py-2 bg-gray-300 text-black rounded-full font-medium shadow-md hover:shadow-lg hover:bg-gray-400 transition-all duration-300"
            >
              Show Less ↑
            </button>
          )}
        </div>
      )}

      {isModalOpen && (
        <EnrollmentModal isOpen={true} onClose={handleCloseModal}>
          <EnrollmentForm courseId={isModalOpen} />
        </EnrollmentModal>
      )}
    </div>
  );
}
