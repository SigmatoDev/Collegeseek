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
  className="relative bg-cover bg-center bg-no-repeat py-20 px-6 mb-12 shadow-1xl"
  style={{
    backgroundImage: "url('/image/14.jpg')",
  }}
>
  {/* Enhanced dark overlay with gradient for depth */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/30 to-black/25 "></div>

  <div className="relative z-10 flex flex-col items-center text-center text-white max-w-3xl mx-auto">
    <h1 className="text-[38px] font-extrabold tracking-tight leading-tight mb-4">
    <span className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md rounded-lg shadow-md whitespace-nowrap overflow-hidden text-ellipsis">
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
      
    <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
  <table className="min-w-full table-auto text-sm ">
    <thead className="bg-gradient-to-r from-gray-100 to-gray-200 sticky top-0 z-10">
      <tr className="text-gray-700 text-[13px] uppercase tracking-wide font-semibold">
        <th className="px-4 py-3 text-left w-[1%] border-b border-gray-300">NIRF</th>
        <th className="px-4 py-3 text-left w-[23%] border-b border-gray-300">College</th>
        <th className="px-4 py-3 text-left w-[16%] border-b border-gray-300">Degree</th>
        <th className="px-4 py-3 text-left w-[11%] border-b border-gray-300">Fees</th>
        <th className="px-4 py-3 text-left border-b border-gray-300">Eligibility</th>
        <th className="px-4 py-3 text-left border-b border-gray-300">Duration</th>
        <th className="px-4 py-3 text-left w-[9%] border-b border-gray-300">Mode</th>
        <th className="px-4 py-3 text-left w-[11%] border-b border-gray-300">Enroll</th>
      </tr>
    </thead>
    <tbody className="text-gray-800">
      {courses.map((course, index) => (
        <React.Fragment key={course._id}>
          <tr
            className={`hover:bg-blue-50 transition duration-150  ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            }`}
          >
            <td className="px-4 py-3 border-b border-gray-200 rounded-l-xl">{course.college_id?.rank}</td>
            <td className="px-4 py-3 border-b border-gray-200 font-semibold">{course.college_id?.name}</td>
            <td className="px-4 py-3 border-b border-gray-200">
              <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {course.category?.name}
              </span>
            </td>
            <td className="px-4 py-3 border-b border-gray-200 text-green-700 font-semibold">
              ₹{course.fees.amount.toLocaleString()} {course.fees.currency}
            </td>
            <td className="px-4 py-3 border-b border-gray-200">{course.eligibility}</td>
            <td className="px-4 py-3 border-b border-gray-200">{course.duration}</td>
            <td className="px-4 py-3 border-b border-gray-200">
              <span
                className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                  course.mode.toLowerCase() === 'online'
                    ? 'bg-blue-100 text-blue-700'
                    : course.mode.toLowerCase() === 'offline'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {course.mode}
              </span>
            </td>
            <td className="px-4 py-3 border-b border-gray-200 rounded-r-xl">
              <a
                href={course.enrollmentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-md shadow-sm"
              >
                Enroll Now
              </a>
            </td>
          </tr>

          {course.image && (
            <tr key={`${course._id}-image`}>
              <td colSpan={8} className="px-4 py-5 text-center bg-white border-b border-gray-200 rounded-xl shadow-inner">
                <img
                  src={course.image}
                  alt={course.name}
                  className="mx-auto rounded-lg shadow max-h-64 object-contain transition-transform duration-300 hover:scale-105"
                />
              </td>
            </tr>
          )}
        </React.Fragment>
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
