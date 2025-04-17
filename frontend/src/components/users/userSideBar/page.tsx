'use client'

import {
  Home,
  User,
  Heart,
  BookOpen,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { api_url, img_url } from '@/utils/apiCall'
import { useUserStore } from '@/Store/userStore' // Import your user store

export default function UserSidebar() {
  const [open, setOpen] = useState(false)
  const [logo, setLogo] = useState<string | null>(null)
  const logout = useUserStore((state) => state.logout) // Access logout method from store

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data } = await axios.get(`${api_url}settings`)
        if (data.siteLogo) {
          setLogo(`${img_url.replace(/\/$/, '')}${data.siteLogo}`)
        }
      } catch (error) {
        console.error('Error fetching site logo:', error)
      }
    }

    fetchLogo()
  }, [])

  // Handle logout functionality
  const handleLogout = () => {
    logout(); // Call the logout method to clear the user session
    window.location.href = "/"; // Redirect to home page or login page after logout
  }

  return (
    <>
      {/* Toggle button for mobile */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 text-gray-700 hover:text-blue-600"
      >
        <Menu size={28} />
      </button>

      {/* Overlay for mobile when sidebar is open */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-40 h-screen bg-gray-100 border-r shadow-md flex flex-col transition-all duration-300 
        ${open ? 'w-64' : 'w-0'} md:w-64 overflow-hidden`}
      >
        {/* Logo and close button */}
        <div className="flex items-center justify-between px-4 py-5 border-b">
          <Link href="/" className="hover:opacity-90 transition">
            {logo ? (
              <Image
                src={logo}
                alt="Logo"
                width={140}
                height={36}
                className="rounded-md object-contain"
              />
            ) : (
              <div className="w-[140px] h-9 bg-gray-200 animate-pulse rounded-md" />
            )}
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-gray-500 hover:text-red-600 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <SidebarLink href="/" icon={<Home size={20} />} label="Home" />
          <SidebarLink href="/user/profile" icon={<User size={20} />} label="My Profile" />
          <SidebarLink href="/user/shortlisted" icon={<Heart size={20} />} label="Shortlisted" />
          {/* <SidebarLink href="/user/applied-courses" icon={<BookOpen size={20} />} label="Applied Courses" /> */}
          <SidebarLink href="/user/auth/changePassword" icon={<BookOpen size={20} />} label="Change Password" />
        </nav>

        {/* Logout */}
        <div className="border-t px-3 py-4">
          <button
            onClick={handleLogout} // Use the handleLogout function
            className="flex items-center gap-3 px-3 py-2 rounded-md text-red-500 hover:text-red-600 transition hover:bg-blue-50"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  )
}

function SidebarLink({
  href,
  icon,
  label,
  color = 'text-gray-700 hover:text-blue-600',
}: {
  href: string
  icon: React.ReactNode
  label: string
  color?: string
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md ${color} transition hover:bg-blue-50`}
    >
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}
