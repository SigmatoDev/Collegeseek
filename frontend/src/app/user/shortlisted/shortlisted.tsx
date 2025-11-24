"use client";

import { useEffect, useState } from "react";
import { api_url, img_url } from "@/utils/apiCall";
import Link from "next/link";
import { TrashIcon } from "@heroicons/react/24/outline";

interface Course {
  name: string;
}

interface CollegeData {
  courses?: any[];
  name: string;
  location?: string;
  state?: string;
  city?: string;
  image?: string;
  _id?: string;
  slug?: string;
}

interface ShortlistedCollege {
  _id: string;
  collegeId: CollegeData;
  courses: any[];
}

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

const ShortListColleges: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [shortlistedColleges, setShortlistedColleges] = useState<
    ShortlistedCollege[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user_store");

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const userFromSession = parsed?.state?.user;

        if (userFromSession?.token) {
          setUser(userFromSession);
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError("Invalid user session.");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.token) {
      fetchShortlistedColleges(user.id, user.token);
    }
  }, [user]);

  const fetchShortlistedColleges = async (userId: string, token: string) => {
    setLoading(true);

    try {
      const endpoint = `${api_url}get/user/shortlistedClg/by/${userId}`;
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok && data?.message !== "No shortlisted colleges found.") {
        throw new Error(
          "Failed to fetch shortlisted colleges. " + (data?.message || "")
        );
      }

      setShortlistedColleges(data?.data || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const removeCollege = async (shortlistId: string) => {
    if (!user?.token) return;

    try {
      const endpoint = `${api_url}delete/user/shortlistedClg/${user.id}/${shortlistId}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error("Failed to remove college. " + errorText);
      }

      setShortlistedColleges((prev) =>
        prev.filter((college) => college._id !== shortlistId)
      );
    } catch (err: any) {
      setError(err.message || "Error removing the college.");
    }
  };

  const normalizeCourses = (rawCourses: any[]) => {
    return rawCourses.map((c: any) => {
      const categoryName = c?.category?.name || c?.category?.code || null;
      const specializationName =
        c?.specialization?.name || c?.specialization?.description || null;

      const finalName =
        categoryName && specializationName
          ? `${categoryName} (${specializationName})`
          : categoryName || specializationName || "Unknown Course";

      return {
        name: finalName,
        category: categoryName,
        specialization: specializationName,
      };
    });
  };

  const getUniqueCourses = (courses: any[]) => {
    const seen = new Set();
    return courses.filter((c) => {
      const key = c.name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-900 tracking-tight">
        Your Shortlisted Colleges
        <span className="block h-1 w-24 bg-blue-600 mt-2 rounded-full"></span>
      </h1>

      {loading && (
        <p className="text-gray-500">Loading shortlisted colleges...</p>
      )}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && shortlistedColleges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {shortlistedColleges.map((college) => {
            const rawCourses = college.courses || [];
            const courses = normalizeCourses(rawCourses);
            const uniqueCourses = getUniqueCourses(courses);
            const topCourses = uniqueCourses.slice(0, 3);

            const imageFromDB = college.collegeId?.image || "";
            const cleanedImage = imageFromDB.replace(/^\/?uploads\//, "");
            const imageUrl = cleanedImage
              ? `${img_url.replace(/\/$/, "")}/uploads/${cleanedImage}`
              : "/image/fallback-image.webp";

            return (
              <Link
                key={college._id}
                href={`/colleges/${college.collegeId?.slug}`}
                className="block"
              >
                <div
                  className="
                rounded-2xl border border-gray-200 bg-white 
                shadow-sm hover:shadow-xl
                transition-all duration-300 
                overflow-hidden group
              "
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={college.collegeId?.name}
                      className="
                      object-cover w-full h-full 
                      transition-transform duration-700 
                      group-hover:scale-110
                    "
                      onError={(e) => {
                        e.currentTarget.src = "/image/fallback-image.webp";
                      }}
                    />

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeCollege(college._id);
                      }}
                      className="
                      absolute top-3 right-3 
                      bg-white/90 backdrop-blur-xl 
                      p-2 rounded-full shadow-md 
                      border border-red-300
                      text-red-500 hover:bg-red-600 
                      hover:text-white transition
                    "
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0"></div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition">
                      {college.collegeId?.name}
                    </h2>

                    <p className="text-gray-600 text-sm mt-2 flex items-center gap-1">
                      <span className="text-blue-600">📍</span>

                      {college.collegeId?.state && college.collegeId?.city
                        ? `${college.collegeId.state}, ${college.collegeId.city}`
                        : college.collegeId?.state
                        ? college.collegeId.state
                        : college.collegeId?.city
                        ? college.collegeId.city
                        : "Location not available"}
                    </p>

                    {uniqueCourses.length > 0 && (
                      <div className="mt-4">
                        <p className="font-semibold text-gray-700 mb-3 text-sm">
                          Top Courses
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {topCourses.map((course, index) => (
                            <span
                              key={index}
                              className="
                              px-3 py-1 text-xs font-medium
                              bg-blue-50 text-blue-700 
                              rounded-full border border-blue-200
                              shadow-sm
                            "
                            >
                              {course.name}
                            </span>
                          ))}
                        </div>

                        {uniqueCourses.length > 3 && (
                          <p className="text-blue-600 text-xs mt-4 underline font-medium">
                            View all {rawCourses.length} courses →
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        !loading && (
          <div className="text-center text-gray-500 mt-16 text-lg">
            You haven’t shortlisted any colleges yet.
          </div>
        )
      )}
    </div>
  );
};

export default ShortListColleges;
