"use client";

import { api_url } from "@/utils/apiCall";
import { useEffect, useState } from "react";
import EnrollmentModal from "./model/page";
import EnrollmentForm from "./enrollForm/page";

interface Course {
  _id: string;
  name: string;
  description: string;
  category: string;
  duration: string;
  mode: string;
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

interface Props {
  college_id: string;
}

export default function CollegeCourses({ college_id }: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<string | null>(null); // Track the modal state per course

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
        const url = `${api_url}/courses?college_id=${college_id}`;
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

    fetchCourses();
  }, [college_id]);

  const handleOpenModal = (courseId: string) => {
    setIsModalOpen(courseId); // Open the modal for a specific course
  };

  const handleCloseModal = () => {
    setIsModalOpen(null); // Close the modal
  };

  if (loading) return <p className="text-center text-gray-500">Loading courses...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!courses.length) return <p className="text-center text-gray-500">No courses found for this college.</p>;

  return (
    <div className="my-5 py-8 bg-gray-200 mx-[-70px] px-[70px]">
      <h1 className="text-4xl font-bold text-indigo-800 text-center mb-10">Explore Our Courses</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            {/* 🟢 Course Name (One Line) */}
            <h2 className="text-lg font-semibold text-indigo-700 truncate pb-1">{course.name}</h2>

            <p className="text-gray-600 line-clamp-3">{course.description}</p>

            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <p>
                <strong>📅 Duration:</strong> {course.duration} | <strong>📖 Mode:</strong> {course.mode}
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
              {/* Button to open Enrollment Form */}
              <button
                onClick={() => handleOpenModal(course._id)} // Open modal for the specific course
                className="bg-[#581845] text-white px-3 py-3 rounded-lg w-[150px] text-lg font-semibold"
              >
                Enroll now
              </button>

              <a
                href={course.brochure_link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 bg-indigo-700 text-white rounded-lg font-medium hover:bg-indigo-800 transition text-center"
              >
                Download Brochure
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Enrollment Modal */}
      {isModalOpen && (
  <EnrollmentModal isOpen={true} onClose={handleCloseModal}>
    {/* Pass the courseId prop to EnrollmentForm */}
    <EnrollmentForm courseId={isModalOpen} />
  </EnrollmentModal>
)}

    </div>
  );
}
