// import React, { useEffect, useState } from 'react';
// import CourseCard from '../coursesCard/coursesCard';
// import { api_url } from '@/utils/apiCall';

// interface Course {
//   _id: string;
//   name: string;
//   title?: string;
//   description: string;
//   specialization: string | {
//     _id: string;
//     name: string;
//     __v?: number;
//   };
//   instructor: string;
//   duration?: string;
//   durationRange?: string;
//   mode?: string;
//   slug: string;
//   image?: string;
//   fees?: {
//     amount: number;
//     currency: string;
//     year: string;
//   };
//   feesRange?: string;
// }

// interface CoursesListProps {
//   streamName?: string;
// }

// const CoursesList: React.FC<CoursesListProps> = ({ streamName }) => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       setLoading(true);
//       setError(null);

//       // Build filters array depending on streamName
//       const filters = [];
//       if (streamName) {
//         filters.push({ field: 'stream', operator: 'eq', value: streamName });
//       }

//       try {
//         const response = await fetch(`${api_url}courses/filter/by/specialization`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ filters }),
//         });

//         if (!response.ok) {
//           throw new Error(`Failed to fetch courses - Status: ${response.status}`);
//         }

//         const data = await response.json();
//         setCourses(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An error occurred');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [streamName]);

//   if (loading) return <div className="text-center">Loading courses...</div>;
//   if (error) return <div className="text-center text-red-500">{error}</div>;

//   return (
//     <div className="max-w-8xl ml-9 mr-3 mx-auto px-6 pb-6">
//       <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//         {courses.length > 0 ? (
//           courses.map((course) => (
//             <CourseCard
//               key={course._id}
//               id={course._id}
//               title={
//                 typeof course.specialization === 'object'
//                   ? course.specialization.name
//                   : course.specialization
//               }
//               description={course.description}
//               slug={course.slug}
//               duration={course.durationRange || course.duration || 'N/A'}
//               fees={course.feesRange || 'N/A'}
//               image={'/image/14.jpg'}
//             />
//           ))
//         ) : (
//           <div className="text-center text-gray-500">No courses available.</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CoursesList;
import React, { useEffect, useState } from 'react';
import CourseCard from '../coursesCard/coursesCard';
import { api_url } from '@/utils/apiCall';

interface Course {
  _id: string;
  name: string;
  title?: string;
  description: string;
  specialization: string | { _id: string; name: string; __v?: number };
  instructor: string;
  duration?: string;
  durationRange?: string;
  mode?: string;
  slug: string;
  image?: string;
  fees?: { amount: number; currency: string; year: number };
  feesRange?: string;
}

interface CoursesListProps {
  streamName?: string;
}

const CoursesList: React.FC<CoursesListProps> = ({ streamName }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10; // Items per page

  const fetchCourses = async (page: number) => {
    setLoading(true);
    setError(null);

    const filters = [];
    if (streamName) {
      filters.push({ field: 'stream', operator: 'eq', value: streamName });
    }

    try {
      const response = await fetch(
        `${api_url}courses/filter/by/specializationpage?page=${page}&limit=${limit}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters }),
        }
      );

      if (!response.ok) throw new Error(`Failed to fetch courses: ${response.status}`);

      const data = await response.json();
      setCourses(data.courses || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // Reset to first page when stream changes
  }, [streamName]);

  useEffect(() => {
    fetchCourses(page);
  }, [page, streamName]);

  if (loading) return <div className="text-center">Loading courses...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-8xl ml-9 mr-3 mx-auto px-6 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard
              key={course._id}
              id={course._id}
              title={
                typeof course.specialization === 'object'
                  ? course.specialization.name
                  : course.specialization
              }
              description={course.description}
              slug={course.slug}
              duration={course.durationRange || course.duration || 'N/A'}
              fees={course.feesRange || 'N/A'}
              image={'/image/14.jpg'}
            />
          ))
        ) : (
          <div className="text-center text-gray-500">No courses available.</div>
        )}
      </div>

      {/* Numbered Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={pageNumber}
                className={`px-3 py-1 border rounded ${
                  page === pageNumber ? 'bg-black text-white' : 'bg-white text-black'
                }`}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CoursesList;
