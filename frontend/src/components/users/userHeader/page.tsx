// 'use client'

// import { Bell, UserCircle } from 'lucide-react'
// import Link from 'next/link'
// import { useUserStore } from '@/Store/userStore'
// import { useRouter } from 'next/navigation'

// export default function UserHeader() {
//   const user = useUserStore((state) => state.user)
//   const hasNotification = useUserStore((state) => state.hasNotification)
//   const clearNotification = useUserStore((state) => state.clearNotification)

//   const router = useRouter()

//   const handleBellClick = () => {
//     clearNotification()
//     router.push('/user/shortlisted')  // 🔔 Redirect here
//   }

//   return (
//     <header className="w-full bg-gradient-to-r from-[#d1664d] to-[#ef9f00] text-white shadow-md rounded-2xl overflow-hidden">
//       <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-5 gap-4">
        
//         {/* Left Section */}
//         <div>
//           <h1 className="text-lg font-semibold uppercase tracking-wide text-gray-200">
//             Dashboard
//           </h1>
//           <h2 className="text-2xl font-bold">
//             Hi {user?.name || 'User'}, here's your space.
//           </h2>
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center gap-4">

//           {/* 🔔 Notification Bell */}
//           <div className="relative">
//             <button
//               onClick={handleBellClick}
//               className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition relative"
//             >
//               <Bell size={20} />

//               {/* Red Notification Dot */}
//               {hasNotification && (
//                 <>
//                   <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
//                   <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full"></span>
//                 </>
//               )}
//             </button>
//           </div>

//           <div className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-full px-3 py-2 transition">
//             <UserCircle size={20} />
//             <span className="text-sm font-medium">
//               {user?.name || 'Profile'}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <nav className="flex justify-center gap-3 pb-4">
//         <Link
//           href="/user/profile"
//           className="px-4 py-2 bg-white/20 hover:bg-white/40 rounded-full text-sm font-medium transition"
//         >
//           Overview
//         </Link>

//         <Link
//           href="/user/shortlisted"
//           onClick={() => clearNotification()}
//           className="px-4 py-2 bg-white/20 hover:bg-white/40 rounded-full text-sm font-medium transition"
//         >
//           Shortlisted
//         </Link>

//         <Link
//           href="/user/auth/changePassword"
//           className="px-4 py-2 bg-white text-blue-700 rounded-full text-sm font-semibold transition"
//         >
//           Change Password
//         </Link>
//       </nav>
//     </header>
//   )
// }
'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useUserStore } from '@/Store/userStore'
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline'

type Props = {
  onOpenSidebar?: () => void
}

export default function UserHeader({ onOpenSidebar }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const user = useUserStore((state) => state.user)
  const hasNotification = useUserStore((state) => state.hasNotification)
  const clearNotification = useUserStore((state) => state.clearNotification)

  // ✅ initials fallback
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  // ✅ direct S3 image (clean)
  const profileImageUrl =
    user?.profileImage && user.profileImage.trim() !== ''
      ? user.profileImage
      : null

  const handleBellClick = () => {
    clearNotification()
    router.push('/user/shortlisted')
  }

  const tabs = [
    { label: 'Overview', href: '/user/profile' },
    { label: 'Shortlisted', href: '/user/shortlisted' },
    { label: 'Password', href: '/user/auth/changePassword' },
  ]

  return (
    <>
      {/* ── Top Bar ── */}
      <div className="bg-indigo-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between">

          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSidebar}
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition"
            >
              <Bars3Icon className="h-5 w-5 text-white" />
            </button>
            <span className="text-sm font-medium text-white/90">
              Dashboard
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">

            {/* 🔔 Notification */}
            <button
              onClick={handleBellClick}
              className="relative p-1.5 rounded-lg border border-white/20 hover:bg-white/10 transition"
            >
              <BellIcon className="h-4 w-4 text-white" />
              {hasNotification && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-400 rounded-full border-[1.5px] border-indigo-700" />
              )}
            </button>

            {/* 👤 Profile */}
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/30 bg-white/20 flex items-center justify-center">
              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // 🔥 fallback if image fails
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              ) : (
                <span className="text-white text-xs font-medium">
                  {initials}
                </span>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Hero Section ── */}
      <div className="bg-indigo-700 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">

          <div>
            <p className="text-indigo-300 text-xs uppercase tracking-wide">
              Welcome back
            </p>
            <h1 className="text-white text-xl font-medium">
              Hi {user?.name || 'User'} 👋
            </h1>
          </div>

          {/* Tabs */}
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map(({ label, href }) => {
              const isActive = pathname === href

              return (
                <button
                  key={href}
                  onClick={() => router.push(href)}
                  className={`shrink-0 px-4 py-2 rounded-t-lg text-xs font-medium transition border border-b-0 ${
                    isActive
                      ? 'bg-white text-indigo-700 border-white/20'
                      : 'bg-transparent text-white/65 border-transparent hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </nav>

        </div>
      </div>
    </>
  )
}