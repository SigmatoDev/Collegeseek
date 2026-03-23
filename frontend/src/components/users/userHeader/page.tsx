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

import { Bell, UserCircle } from 'lucide-react'
import Link from 'next/link'
import { useUserStore } from '@/Store/userStore'
import { useRouter } from 'next/navigation'

export default function UserHeader() {
  const user = useUserStore((state) => state.user)
  const hasNotification = useUserStore((state) => state.hasNotification)
  const clearNotification = useUserStore((state) => state.clearNotification)
  const router = useRouter()

  const handleBellClick = () => {
    clearNotification()
    router.push('/user/shortlisted')
  }

  return (
    <header className="w-full bg-gradient-to-r from-[#d1664d] to-[#ef9f00] text-white shadow-md rounded-2xl overflow-hidden">

      {/* Top section */}
      <div className="max-w-7xl mx-auto flex items-center justify-between
        px-4 py-3
        md:flex-row md:px-6 md:py-5 md:gap-4
      ">
        {/* Left: greeting */}
        <div className="min-w-0">
          <h1 className="text-xs font-semibold uppercase tracking-wide text-gray-200
            md:text-lg
          ">
            Dashboard
          </h1>
          <h2 className="font-bold leading-tight truncate
            text-base md:text-2xl
          ">
            Hi {user?.name || 'User'} 👋
          </h2>
        </div>

        {/* Right: bell + profile */}
        <div className="flex items-center shrink-0
          gap-2 md:gap-4
        ">
          {/* Bell */}
          <div className="relative">
            <button
              onClick={handleBellClick}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full transition relative
                p-1.5 md:p-2
              "
            >
              <Bell className="h-4 w-4 md:h-5 md:w-5" />
              {hasNotification && (
                <>
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full" />
                </>
              )}
            </button>
          </div>

          {/* Profile pill */}
          <div className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 rounded-full transition
            px-2.5 py-1.5 md:px-3 md:py-2
          ">
            <UserCircle className="h-4 w-4 md:h-5 md:w-5 shrink-0" />
            <span className="font-medium truncate max-w-[80px]
              text-xs md:text-sm md:max-w-none
            ">
              {user?.name || 'Profile'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation tabs — horizontal scroll on mobile */}
      <nav
        className="flex pb-3 px-3 gap-2 overflow-x-auto
          md:justify-center md:gap-3 md:pb-4 md:px-0
        "
        style={{ scrollbarWidth: 'none' }}
      >
        <Link
          href="/user/profile"
          className="shrink-0 bg-white/20 hover:bg-white/40 rounded-full font-medium transition
            px-3 py-1.5 text-xs
            md:px-4 md:py-2 md:text-sm
          "
        >
          Overview
        </Link>
        <Link
          href="/user/shortlisted"
          onClick={() => clearNotification()}
          className="shrink-0 bg-white/20 hover:bg-white/40 rounded-full font-medium transition
            px-3 py-1.5 text-xs
            md:px-4 md:py-2 md:text-sm
          "
        >
          Shortlisted
        </Link>
        <Link
          href="/user/auth/changePassword"
          className="shrink-0 bg-white text-blue-700 rounded-full font-semibold transition
            px-3 py-1.5 text-xs
            md:px-4 md:py-2 md:text-sm
          "
        >
          Change Password
        </Link>
      </nav>
    </header>
  )
}