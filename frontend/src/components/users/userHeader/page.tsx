'use client'

import { Bell, UserCircle } from 'lucide-react'
import Link from 'next/link'
import { useUserStore } from '@/Store/userStore'

export default function UserHeader() {
  const user = useUserStore((state) => state.user)

  return (
    <header className="w-full bg-gradient-to-r from-[#d1664d] to-[#ef9f00] text-white shadow-md rounded-b-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-5 gap-4">
        {/* Left Section */}
        <div>
          <h1 className="text-lg font-semibold uppercase tracking-wide text-gray-200">
            Dashboard
          </h1>
          <h2 className="text-2xl font-bold">
            Hi {user?.name || 'User'}, here's your space.
          </h2>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition">
            <Bell size={20} />
          </button>

          <div className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-full px-3 py-2 transition">
            <UserCircle size={20} />
            <span className="text-sm font-medium">
              {user?.name || 'Profile'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex justify-center gap-3 pb-4">
        <Link
          href="/user/profile"
          className="px-4 py-2 bg-white/20 hover:bg-white/40 rounded-full text-sm font-medium transition"
        >
          Overview
        </Link>
        <Link
          href="/user/shortlisted"
          className="px-4 py-2 bg-white/20 hover:bg-white/40 rounded-full text-sm font-medium transition"
        >
          Shortlisted
        </Link>
        <Link
          href="/user/auth/changePassword"
          className="px-4 py-2 bg-white text-blue-700 rounded-full text-sm font-semibold transition"
        >
          Change Password
        </Link>
      </nav>
    </header>
  )
}
