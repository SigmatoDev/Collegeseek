import React, { useEffect, useState } from 'react';
import CourseCard from '../coursesCard/coursesCard';
import { api_url } from '@/utils/apiCall';

interface Course {
  _id: string;
  name: string;
  title?: string;
  description: string;
  specialization: string | {
    _id: string;
    name: string;
    __v?: number;
  };
  instructor: string;
  duration?: string;
  durationRange?: string;
  mode?: string;
  slug: string;
  image?: string;
  fees?: {
    amount: number;
    currency: string;
    year: string;
  };
  feesRange?: string;
}

const CoursesList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  const fetchCourses = async () => {
    setLoading(true);
    setError(null);

    const requestBody = { filters: [] };
    console.log("🔄 Starting course fetch...");
    console.log("📦 Request Body:", requestBody);

    try {
      const response = await fetch(`${api_url}courses/filter/by/specialization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📨 Raw response:", response);

      if (!response.ok) {
        throw new Error(`Failed to fetch courses - Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Parsed response data:", data);

      setCourses(data);
    } catch (err) {
      console.error("❌ Error fetching courses:", err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      console.log("✅ Finished course fetch.");
      setLoading(false);
    }
  };

  fetchCourses();
}, []);


  if (loading) {
    return <div className="text-center">Loading courses...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-8xl ml-9 mr-3 mx-auto px-6 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard
              key={course._id}
              id={course._id}
  title={typeof course.specialization === 'object' ? course.specialization.name : course.specialization}
              description={course.description}
              slug={course.slug}
              duration={course.durationRange || course.duration || "N/A"}
              fees={course.feesRange || "N/A"} image={'/image/14.jpg'}            />
          ))
        ) : (
          <div className="text-center text-gray-500">No courses available.</div>
        )}
      </div>
    </div>
  );
};

export default CoursesList;
