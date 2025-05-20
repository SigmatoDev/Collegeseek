"use client";

import { api_url } from "@/utils/apiCall";
import { useEffect, useState } from "react";
import EnrollmentModal from "./model/page";
import EnrollmentForm from "./enrollForm/page";
import Loader from "@/components/loader/loader";

interface Course {
  _id: string;
  specialization: string; // ✅ Changed from object to string
  description: string;
  category: string;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<string | null>(null);

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
        if (!response.ok) throw new Error(`Failed to fetch courses: ${response.statusText}`);

        const data: Course[] = await response.json();
        const filteredCourses = data.filter((course) => course.college_id === college_id);
        setCourses(filteredCourses);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSpecializations = async () => {
      try {
        const res = await fetch(`${api_url}get/Specialization`);
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
  if (!courses.length) return <p className="text-center text-gray-500">No courses found for this college.</p>;

  return (
    <div className="my-5 py-8 bg-gray-200 mx-[-70px] px-[70px]">
      <h1 className="text-4xl font-bold text-black text-center mb-10">Explore Our Courses</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <h2 className="text-lg font-semibold text-[#403A83] truncate pb-1">
              {getSpecializationName(course.specialization)}
            </h2>

            <p className="text-gray-600 line-clamp-3">{course.description}</p>

            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p>
                <strong>📅 Duration:</strong> {course.duration} |{" "}
                <strong>📖 Program Mode:</strong> {course.programMode?.name}
              </p>

              <p>
                <strong>🎓 Eligibility:</strong> {course.eligibility}
              </p>
              <p>
                <strong>📝 Entrance Exam:</strong> {course.entrance_exam}
              </p>

              {course.fees && (
                <p className="font-semibold text-indigo-700">
                  💰 Fees: ₹{course.fees.amount.toLocaleString()} {course.fees.currency} ({course.fees.year})
                </p>
              )}
            </div>

            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => handleOpenModal(course._id)}
                className="bg-[#38347C] text-white px-3 py-3 rounded-lg w-[150px] text-lg font-semibold"
              >
                Enroll now
              </button>

              <button
                onClick={() => window.open(course.brochure_link, "_blank", "noopener,noreferrer")}
                className="px-5 py-2 bg-transparent border border-[#D35B42] text-[#D35B42] rounded-lg font-medium hover:bg-[#D35B42] hover:text-white transition duration-200"
              >
                Download Brochure
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <EnrollmentModal isOpen={true} onClose={handleCloseModal}>
          <EnrollmentForm courseId={isModalOpen} />
        </EnrollmentModal>
      )}
    </div>
  );
}
