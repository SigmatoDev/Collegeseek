'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/admin/sidebar/page';
import Header from '../../../components/admin/navigater/page';
import { api_url } from '@/utils/apiCall';

import {
  AcademicCapIcon,
  BookmarkSquareIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    coursesEnrolled: 0,
    collegesShortlisted: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api_url}dashboard`);
        const data = await response.json();

        if (response.ok) {
          setUserData({
            coursesEnrolled: data.data.coursesEnrolled || 0,
            collegesShortlisted: data.data.collegesShortlisted || 0,
          });
        } else {
          setError(data.message || 'Error fetching dashboard data');
        }
      } catch (error) {
        setError('Something went wrong while fetching the data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 max-w-[1600px] mx-auto w-full">
          {/* Welcome / Title */}
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
              Welcome back, Admin
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Here's a quick overview of user activity and engagement.
            </p>
          </header>

          {/* Loading shimmer placeholders */}
          {loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((_) => (
                <div
                  key={_}
                  className="animate-pulse bg-white rounded-xl p-8 space-y-4"
                >
                  <div className="h-12 w-12 rounded-full bg-gray-300" />
                  <div className="h-6 bg-gray-300 rounded w-3/4" />
                  <div className="h-10 bg-gray-300 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="bg-red-50 border border-red-300 text-red-800 px-6 py-4 rounded-lg shadow-sm"
              role="alert"
            >
              <strong className="font-semibold">Error: </strong>
              <span>{error}</span>
            </div>
          )}

          {/* Metrics Cards */}
          {!loading && !error && (
            <section className="grid grid-cols-1 md:grid-cols-2 mx-[80px] gap-8">
              {/* Courses Enrolled */}
              <div className="bg-white shadow-lg rounded-xl p-8 flex flex-col space-y-4 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center space-x-6">
                  <div className="bg-orange-100 p-3 rounded-full">
                    <AcademicCapIcon className="h-10 w-10 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-700 mb-1 flex items-center space-x-2 leading-snug">
                      <span>Courses Enrolled</span>
                      <InformationCircleIcon
                        title="Total courses users have enrolled in"
                        className="h-5 w-5 text-gray-400 cursor-help"
                      />
                    </h3>
                    <p className="text-5xl font-extrabold text-orange-600">
                      {userData.coursesEnrolled}
                    </p>
                    <p className="text-gray-400 mt-1">
                      Total user enrollments
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div
                    className="bg-orange-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (userData.coursesEnrolled / 100) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              
              </div>

              {/* Colleges Shortlisted */}
              <div className="bg-white shadow-lg rounded-xl p-8 flex flex-col space-y-4 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center space-x-6">
                  <div className="bg-[#dcd9fa] p-3 rounded-full">
                    <BookmarkSquareIcon className="h-10 w-10 text-[#413A82]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-700 mb-1 flex items-center space-x-2 leading-snug">
                      <span>Colleges Shortlisted</span>
                      <InformationCircleIcon
                        title="Total colleges shortlisted by users"
                        className="h-5 w-5 text-gray-400 cursor-help"
                      />
                    </h3>
                    <p className="text-5xl font-extrabold text-[#413A82]">
                      {userData.collegesShortlisted}
                    </p>
                    <p className="text-gray-400 mt-1">
                      Total colleges shortlisted by users
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                  <div
                    className="bg-[#413A82] h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (userData.collegesShortlisted / 50) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
             
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
