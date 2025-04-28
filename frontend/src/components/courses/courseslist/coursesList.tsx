import React, { useEffect, useState } from 'react';
import CourseCard from '../coursesCard/coursesCard';
import { api_url } from '@/utils/apiCall';

interface Course {
  _id: string;
  name: string;
  title?: string;
  description: string;
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

      try {
        const response = await fetch(`${api_url}courses/filter/by/common/name`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filters: [] }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        console.log("response",data)

        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
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
              title={course.name}
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
