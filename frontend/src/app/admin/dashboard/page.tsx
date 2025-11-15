'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/adminLayout';
import { api_url } from '@/utils/apiCall';

import {
  AcademicCapIcon,
  BookmarkSquareIcon,
  InformationCircleIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  PhoneArrowDownLeftIcon,
  EnvelopeOpenIcon,
} from '@heroicons/react/24/outline';

type TrendPoint = {
  date: string;
  count: number;
};

type RecentEnrollment = {
  _id?: string;
  name: string;
  course: string;
  email?: string;
  phone?: string;
  createdAt: string;
};

type DashboardData = {
  coursesEnrolled: number;
  collegesShortlisted: number;
  totalUsers: number;
  counsellingRequests: number;
  contactQueries: number;
  newEnrollmentsThisWeek: number;
  leadToEnrollmentRate: number;
  shortlistPerUser: number;
  enrollmentTrend: TrendPoint[];
  recentEnrollments: RecentEnrollment[];
};

const initialDashboardData: DashboardData = {
  coursesEnrolled: 0,
  collegesShortlisted: 0,
  totalUsers: 0,
  counsellingRequests: 0,
  contactQueries: 0,
  newEnrollmentsThisWeek: 0,
  leadToEnrollmentRate: 0,
  shortlistPerUser: 0,
  enrollmentTrend: [],
  recentEnrollments: [],
};

const formatDayLabel = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const formatFullDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>(
    initialDashboardData,
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api_url}dashboard`);
        const data = await response.json();

        if (response.ok && data?.data) {
          setDashboardData({
            coursesEnrolled: data.data.coursesEnrolled ?? 0,
            collegesShortlisted: data.data.collegesShortlisted ?? 0,
            totalUsers: data.data.totalUsers ?? 0,
            counsellingRequests: data.data.counsellingRequests ?? 0,
            contactQueries: data.data.contactQueries ?? 0,
            newEnrollmentsThisWeek: data.data.newEnrollmentsThisWeek ?? 0,
            leadToEnrollmentRate: data.data.leadToEnrollmentRate ?? 0,
            shortlistPerUser: data.data.shortlistPerUser ?? 0,
            enrollmentTrend: data.data.enrollmentTrend ?? [],
            recentEnrollments: data.data.recentEnrollments ?? [],
          });
        } else {
          setError(data?.message || 'Error fetching dashboard data');
        }
      } catch (error) {
        setError('Something went wrong while fetching the data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalLeads =
    dashboardData.counsellingRequests + dashboardData.contactQueries;
  const counsellingShare = totalLeads
    ? Math.round((dashboardData.counsellingRequests / totalLeads) * 100)
    : 0;
  const contactShare = totalLeads
    ? Math.round((dashboardData.contactQueries / totalLeads) * 100)
    : 0;
  const maxTrendCount = Math.max(
    ...dashboardData.enrollmentTrend.map((point) => point.count),
    1,
  );

  const highlightCards = [
    {
      title: 'Courses Enrolled',
      value: dashboardData.coursesEnrolled,
      subtext: 'All-time user enrollments',
      icon: AcademicCapIcon,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      progress: dashboardData.coursesEnrolled,
      progressCap: 100,
    },
    {
      title: 'Colleges Shortlisted',
      value: dashboardData.collegesShortlisted,
      subtext: 'Saved by prospective students',
      icon: BookmarkSquareIcon,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-700',
      progress: dashboardData.collegesShortlisted,
      progressCap: 50,
    },
    {
      title: 'Total Registered Users',
      value: dashboardData.totalUsers,
      subtext: 'Active profiles within the platform',
      icon: UserGroupIcon,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-700',
      progress: dashboardData.totalUsers,
      progressCap: 500,
    },
    {
      title: 'Enrollments (7 days)',
      value: dashboardData.newEnrollmentsThisWeek,
      subtext: 'Fresh leads captured this week',
      icon: ArrowTrendingUpIcon,
      iconBg: 'bg-sky-100',
      iconColor: 'text-sky-600',
      progress: dashboardData.newEnrollmentsThisWeek,
      progressCap: 25,
    },
  ];

  const operationalCards = [
    {
      title: 'Counselling Requests',
      value: dashboardData.counsellingRequests,
      subtext: 'Students awaiting follow-up',
      icon: PhoneArrowDownLeftIcon,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-700',
    },
    {
      title: 'Contact Queries',
      value: dashboardData.contactQueries,
      subtext: 'Inbox messages needing replies',
      icon: EnvelopeOpenIcon,
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
    },
    {
      title: 'Lead → Enrollment Rate',
      value: `${dashboardData.leadToEnrollmentRate}%`,
      subtext: 'Conversion across all captured leads',
      icon: ArrowTrendingUpIcon,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Avg. Shortlists / User',
      value: dashboardData.shortlistPerUser.toFixed(1),
      subtext: 'Engagement depth metric',
      icon: InformationCircleIcon,
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-[1600px] mx-auto w-full">
        <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 leading-tight">
              Welcome back, Admin
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl">
              Track admissions performance, respond to leads faster, and keep a
              pulse on how students are engaging with colleges and courses.
            </p>
          </header>

          {loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="animate-pulse bg-white rounded-xl p-8 space-y-4"
                >
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-10 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                </div>
              ))}
            </div>
          )}

          {error && (
            <div
              className="bg-red-50 border border-red-300 text-red-800 px-6 py-4 rounded-lg shadow-sm"
              role="alert"
            >
              <strong className="font-semibold">Error: </strong>
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && (
            <>
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {highlightCards.map((card) => {
                  const Icon = card.icon;
                  const progress = Math.min(
                    (card.progress / card.progressCap) * 100,
                    100,
                  );
                  return (
                    <div
                      key={card.title}
                      className="bg-white shadow-lg rounded-xl p-8 flex flex-col space-y-6 hover:shadow-2xl transition-shadow duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`${card.iconBg} p-3 rounded-full`}>
                          <Icon className={`h-10 w-10 ${card.iconColor}`} />
                        </div>
                        <div>
                          <p className="text-sm uppercase tracking-wide text-gray-400">
                            {card.title}
                          </p>
                          <p className="text-4xl font-extrabold text-gray-900">
                            {card.value}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm">{card.subtext}</p>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </section>

              <section className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {operationalCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.title}
                      className="bg-white rounded-xl p-6 shadow hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-400">
                            {card.title}
                          </p>
                          <p className="text-3xl font-semibold text-gray-900">
                            {card.value}
                          </p>
                        </div>
                        <div className={`${card.iconBg} p-2 rounded-full`}>
                          <Icon className={`h-8 w-8 ${card.iconColor}`} />
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm mt-4">{card.subtext}</p>
                    </div>
                  );
                })}
              </section>

              <section className="mt-10 grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg xl:col-span-2">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm uppercase text-gray-400 tracking-widest">
                        Enrollment Velocity
                      </p>
                      <h2 className="text-2xl font-bold text-gray-900">
                        7 day submission trend
                      </h2>
                    </div>
                    <span className="text-sm text-gray-500">
                      Peak: {maxTrendCount} / day
                    </span>
                  </div>
                  <div className="flex items-end gap-4 h-48">
                    {dashboardData.enrollmentTrend.map((point) => (
                      <div
                        key={point.date}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div className="w-full h-full bg-gray-100 rounded-2xl flex items-end justify-center">
                          <div
                            className="w-full rounded-2xl bg-gradient-to-t from-indigo-600 to-sky-400"
                            style={{
                              height: `${Math.round(
                                (point.count / maxTrendCount) * 100,
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 mt-2">
                          {point.count}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDayLabel(point.date)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <p className="text-sm uppercase text-gray-400 tracking-widest">
                    Lead mix
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">
                    {totalLeads} inbound leads
                  </h2>
                  <p className="text-gray-500 text-sm mt-2">
                    Balance your counsellor workload based on where demand is
                    coming from.
                  </p>

                  <div className="mt-8 space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">
                          Counselling
                        </span>
                        <span className="text-sm text-gray-500">
                          {counsellingShare}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full">
                        <div
                          className="h-3 rounded-full bg-indigo-500"
                          style={{ width: `${counsellingShare}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">
                          Contact
                        </span>
                        <span className="text-sm text-gray-500">
                          {Math.max(contactShare, 0)}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full">
                        <div
                          className="h-3 rounded-full bg-emerald-500"
                          style={{ width: `${Math.max(contactShare, 0)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mt-10 bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm uppercase text-gray-400 tracking-widest">
                      Most recent enrollments
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Follow-up queue
                    </h2>
                  </div>
                  <span className="text-sm text-gray-500">
                    {dashboardData.recentEnrollments.length} records
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <th className="py-3">Student</th>
                        <th className="py-3">Course</th>
                        <th className="py-3">Contact</th>
                        <th className="py-3">Submitted</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dashboardData.recentEnrollments.map((enrollment) => (
                        <tr key={enrollment._id || enrollment.createdAt}>
                          <td className="py-4">
                            <p className="font-semibold text-gray-900">
                              {enrollment.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {enrollment.email}
                            </p>
                          </td>
                          <td className="py-4 text-gray-700">
                            {enrollment.course}
                          </td>
                          <td className="py-4 text-gray-700">
                            {enrollment.phone || '—'}
                          </td>
                          <td className="py-4 text-gray-500 text-sm">
                            {formatFullDate(enrollment.createdAt)}
                          </td>
                        </tr>
                      ))}
                      {dashboardData.recentEnrollments.length === 0 && (
                        <tr>
                          <td
                            className="py-6 text-center text-gray-500"
                            colSpan={4}
                          >
                            No enrollments have been captured yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
      </div>
    </AdminLayout>
  );
}
