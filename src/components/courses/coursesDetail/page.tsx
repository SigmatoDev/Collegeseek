"use client";

import { api_url } from "@/utils/apiCall";
import React, { useEffect, useState } from "react";
import { AcademicCapIcon, CalendarDaysIcon, ClockIcon, CurrencyDollarIcon, BriefcaseIcon, UserGroupIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import EnrollmentModal from "../coursesCard/model/page";
import EnrollmentForm from "../coursesCard/enrollForm/page";
import Loader from "@/components/loader/loader";
import CollegeCard from "@/components/college/collegeCard/collegeCard";

interface Category {
  name: string;
}

interface Course {
  _id: string;
  slug: string;
  name: string;
  description: string;
  college_id: string;
  category: Category; // Change to object
  duration: string;
  mode: string;
  fees?: {
    amount: number;
    currency: string;
    year: number;
  };
  eligibility?: string;
  entrance_exam?: string;
  enrollmentLink?: string;
  brochure_link?: string;
  placements?: {
    median_salary: number;
    currency: string;
    placement_rate: number;
    topRecruiters?: string[];
  };
  intake_capacity?: {
    male: number;
    female: number;
    total: number;
  };
  application_dates?: {
    start_date: string;
    end_date: string;
  };
  ratings?: {
    score: number;
    reviews_count: number;
  };
}

const CourseDetails = ({ slug }: { slug: string }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);

  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${api_url}courses/slug/${slug}`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        setCourse(data);
      } catch (err: any) {
        setError("Failed to load course details.");
      }
    };
    fetchCourse();
  }, [slug]);

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle opening the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  if (!course) return <Loader />;  // Show the loader while the course data is being fetched

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-blue-800">{course.name}</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">{course.description}</p>
      </div>

      {/* Details */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-blue-700">Course Details</h2>
        <div className="grid md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-md">
          <Detail
            label="Category"
            value={typeof course.category === 'object' ? course.category.name : course.category || "N/A"}
            icon={<AcademicCapIcon className="w-5 h-5" />}
          />
          <Detail label="Duration" value={course.duration} icon={<ClockIcon className="w-5 h-5" />} />
          <Detail label="Mode" value={course.mode} icon={<CalendarDaysIcon className="w-5 h-5" />} />
          <Detail
            label="Fees"
            value={
              course.fees
                ? `${course.fees.amount} ${course.fees.currency} (${course.fees.year})`
                : "N/A"
            }
            icon={<CurrencyDollarIcon className="w-5 h-5" />}
          />
          <Detail label="Eligibility" value={course.eligibility || "N/A"} />
          <Detail label="Entrance Exam" value={course.entrance_exam || "N/A"} />
          <Detail
            label="Application Start"
            value={
              course.application_dates?.start_date
                ? new Date(course.application_dates.start_date).toDateString()
                : "N/A"
            }
          />
          <Detail
            label="Application End"
            value={
              course.application_dates?.end_date
                ? new Date(course.application_dates.end_date).toDateString()
                : "N/A"
            }
          />
          <Detail
            label="Median Salary"
            value={
              course.placements
                ? `${course.placements.median_salary} ${course.placements.currency}`
                : "N/A"
            }
            icon={<BriefcaseIcon className="w-5 h-5" />}
          />
          <Detail
            label="Placement Rate"
            value={course.placements?.placement_rate ? `${course.placements.placement_rate}%` : "N/A"}
          />
          <Detail
            label="Intake Capacity"
            value={
              course.intake_capacity
                ? `Male: ${course.intake_capacity.male}, Female: ${course.intake_capacity.female}, Total: ${course.intake_capacity.total}`
                : "N/A"
            }
            icon={<UserGroupIcon className="w-5 h-5" />}
          />
        </div>
      </section>

      {/* Recruiters */}
      {Array.isArray(course.placements?.topRecruiters) && course.placements.topRecruiters.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-2 text-blue-700">Top Recruiters</h3>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-gray-700 list-disc list-inside">
            {course.placements.topRecruiters.map((recruiter, i) => (
              <li key={i}>{recruiter}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center mt-8">
        {/* Enrollment Modal Trigger */}
        <button
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Enroll Now
        </button>

        {course.brochure_link && (
          <a
            href={course.brochure_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            <ArrowDownTrayIcon className="w-5 h-5" /> Download Brochure
          </a>
        )}
      </div>

      {/* Enrollment Modal */}
      {isModalOpen && (
        <EnrollmentModal isOpen={true} onClose={handleCloseModal}>
          <EnrollmentForm courseId={course._id} />
        </EnrollmentModal>
      )}
    </div>
  );
};



export default CourseDetails;

const Detail = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    {icon && <div className="text-blue-600 mt-1">{icon}</div>}
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);
