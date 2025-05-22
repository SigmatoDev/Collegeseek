'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/adminLayout';
import AdminCollegePage from './ads1';
import AdminCollegePagead2 from './ads2';
import AdminCoursesPagead1 from './ads3';
import AdminCoursesPagead2 from './ads4';
import AdsManager from './ads5';
import { Toaster } from 'react-hot-toast';

const SettingsPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <AdminLayout>
      <div className="p-10 bg-gray-50 min-h-screen max-w-[1540px] mx-auto">
        <Toaster position="top-right" />

        {/* College Page Ads Section */}
        <section className="mb-16">
          <header className="mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2 relative inline-block">
              College Page Advertisement
              <span className="block h-1 w-20 bg-blue-600 rounded mt-1"></span>
            </h1>
            <p className="text-gray-600 text-base max-w-xl">
              Manage the promotional content shown on the college listing page. Upload images.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-md p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-3">
                Advertisement 1
              </h2>
              <AdminCollegePage />
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl shadow-md p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-3">
                Advertisement 2
              </h2>
              <AdminCollegePagead2 />
            </div>
          </div>
        </section>

        {/* Courses Page Ads Section */}
        <section className="mb-16">
          <header className="mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2 relative inline-block">
              Courses Page Advertisement
              <span className="block h-1 w-20 bg-indigo-600 rounded mt-1"></span>
            </h1>
            <p className="text-gray-600 text-base max-w-xl">
              Manage the promotional content shown on the courses listing page. Upload images.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-md p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-3">
                Advertisement 1
              </h2>
              <AdminCoursesPagead1 />
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl shadow-md p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-3">
                Advertisement 2
              </h2>
              <AdminCoursesPagead2 />
            </div>
          </div>
        </section>

        {/* Other Ads Manager Section */}
        <section>
          <header className="mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2 relative inline-block">
              Manage Other Advertisements
              <span className="block h-1 w-20 bg-green-600 rounded mt-1"></span>
            </h1>
            <p className="text-gray-600 text-base max-w-xl">
              Manage additional promotional content and settings.
            </p>
          </header>

          <div className="bg-white border border-gray-200 rounded-3xl shadow-md p-8 hover:shadow-xl transition-shadow duration-300 max-w-full">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-300 pb-4">
              Advertisement Manager
            </h2>
            <AdsManager />
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
