'use client'

import { UserCircleIcon } from '@heroicons/react/24/outline'
import { Bell, Menu, UserCircle } from 'lucide-react' // Import UserCircle from Heroicons
import Image from 'next/image'

export default function UserHeader() {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm sticky top-0 z-30">
      {/* Left: Page title or mobile menu */}
      <div className="flex items-center gap-3">
        <Menu className="md:hidden text-gray-700" />
        <h1 className="text-lg font-semibold text-gray-800">User Dashboard</h1>
      </div>

      {/* Right: Notification and User Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-full overflow-hidden border flex items-center justify-center">
          <UserCircleIcon className="w-9 h-9 text-gray-700" /> {/* Using Heroicon */}
        </div>
      </div>
    </header>
  )
}
