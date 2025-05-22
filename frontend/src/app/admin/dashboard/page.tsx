'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/admin/sidebar/page';
import Header from '../../../components/admin/navigater/page';
import { api_url } from '@/utils/apiCall';

interface Banner {
  title: string;
  description: string;
}

export default function AdminDashboard() {
  const [data, setData] = useState<Banner[]>([]); // For banners
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    coursesEnrolled: 0,  // Initially set to 0
    collegesShortlisted: 0  // Initially set to 0
  });

  // Fetch data from the backend API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api_url}dashboard`);
        const data = await response.json();

        console.log(data); // Log the response to see its structure

        if (response.ok) {
          setUserData({
            coursesEnrolled: data.data.coursesEnrolled || 0,  // Default to 0 if undefined
            collegesShortlisted: data.data.collegesShortlisted || 0  // Default to 0 if undefined
          });

          setData(data.banners || []);  // Set banners if they exist
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
  }, []); // Empty dependency array ensures it runs only once after initial render

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="mt-4 p-8">
          {error && <p className="text-red-500">Error: {error}</p>}
          {loading && !error && <p className="text-gray-500">Loading data...</p>}
          {!loading && !error && data.length === 0 && (
            <p className="text-gray-500"></p> // Handling case when there are no banners
          )}
          {!loading && !error && data.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-bold mb-4">Dashboard Data</h2>
              <ul className="list-disc list-inside">
                {data.map((item, index) => (
                  <li key={index} className="py-1">{item.title} - {item.description}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Displaying Numbers for Courses Enrolled and Colleges Shortlisted */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Number of Courses Enrolled */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Courses Enrolled by Users</h3>
              <p className="text-xl font-bold text-green-600">{userData.coursesEnrolled}</p>
            </div>

            {/* Number of Colleges Shortlisted */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Colleges Shortlisted by Users</h3>
              <p className="text-xl font-bold text-blue-600">{userData.collegesShortlisted}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
