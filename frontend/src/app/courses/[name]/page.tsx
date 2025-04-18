"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api_url } from '@/utils/apiCall';
import Header from '@/components/header/page';
import Footer from '@/components/footer/page';

interface Course {
  _id: string;
  name: string;
  description: string;
  college_id: { name: string,rank:number }; // For college name
  fees: { amount: number; currency: string }; // For fees
  eligibility: string; // Eligibility
  category: { name: string }; // Category name
  duration: string;
  mode: string;
  enrollmentLink: string;
  image: string | null;
}

const CourseDetail = () => {
  const params = useParams();
  const name = decodeURIComponent(params?.name as string);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${api_url}courses/all/get/with/same/name?name=${encodeURIComponent(name)}`);
        if (!res.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (name) fetchCourses();
  }, [name]);

  if (loading) return <p className="text-center">Loading courses...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (courses.length === 0) return <p className="text-center">No courses found.</p>;

  return (
    <>
    <Header/>
    <div
  className="relative bg-cover bg-center bg-no-repeat py-28 px-6 mb-12 shadow-2xl"
  style={{
    backgroundImage: "url('/image/6.avif')",
  }}
>
  {/* Enhanced dark overlay with gradient for depth */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 "></div>

  <div className="relative z-10 flex flex-col items-center text-center text-white max-w-3xl mx-auto">
    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
      <span className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md rounded-lg shadow-md">
        Courses: {name}
      </span>
    </h1>

    {/* Optional subheading */}
    <p className="text-lg md:text-xl text-white/90 font-medium">
      Explore top colleges, fees, and eligibility for your selected course
    </p>

  </div>
</div>

    <div className="max-w-7xl mx-auto p-6">
      
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-300 text-left">NIRF</th>
              <th className="px-4 py-2 border border-gray-300 text-left w-[30%]">College</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Degree</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Fees</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Eligibility</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Duration</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Mode</th>
              <th className="px-4 py-2 border border-gray-300 text-left">Enroll Now</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td className="px-4 py-2 border border-gray-300">{course.college_id?.rank}</td>
                <td className="px-4 py-2 border border-gray-300">{course.college_id?.name}</td>
                <td className="px-4 py-2 border border-gray-300">{course.category?.name}</td>
                <td className="px-4 py-2 border border-gray-300">{course.fees.amount} {course.fees.currency}</td>
                <td className="px-4 py-2 border border-gray-300">{course.eligibility}</td>
                <td className="px-4 py-2 border border-gray-300">{course.duration}</td>
                <td className="px-4 py-2 border border-gray-300">{course.mode}</td>
                <td className="px-4 py-2 border border-gray-300">
                  <a href={course.enrollmentLink} target="_blank" className="text-blue-600 hover:text-blue-800">Click here</a>
                </td>
              </tr>
            ))}
            {courses.map((course) => (
              course.image && (
                <tr key={course._id}>
                  <td colSpan={6} className="px-4 py-2 border border-gray-300 text-center">
                    <img src={course.image} alt={course.name} className="mt-4 max-w-full" />
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <>
    <Footer/>
    </>
        </>

  );
};

export default CourseDetail;
