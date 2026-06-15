// 'use client'

// import {
//   Home,
//   User,
//   Heart,
//   LogOut,
//   X,
//   Menu,
// } from 'lucide-react'
// import Link from 'next/link'
// import { useEffect, useState } from 'react'
// import Image from 'next/image'
// import axios from 'axios'
// import { api_url, img_url } from '@/utils/apiCall'
// import { useUserStore } from '@/Store/userStore'

// export default function UserSidebar() {
//   const [open, setOpen] = useState(false)
//   const [logo, setLogo] = useState<string | null>(null)
//   const logout = useUserStore((state) => state.logout)

//   useEffect(() => {
//     const fetchLogo = async () => {
//       try {
//         const { data } = await axios.get(`${api_url}settings`)
//         if (data.siteLogo) {
//           setLogo(`${img_url.replace(/\/$/, '')}${data.siteLogo}`)
//         }
//       } catch (error) {
//         console.error('Error fetching logo:', error)
//       }
//     }
//     fetchLogo()
//   }, [])

//   const handleLogout = () => {
//     logout()
//     window.location.href = '/'
//   }

//   return (
//     <>
//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setOpen(true)}
//         className="md:hidden fixed top-4 left-4 z-50 text-gray-700 hover:text-blue-600"
//       >
//         <Menu size={26} />
//       </button>

//       {/* Overlay */}
//       {open && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-40 z-40"
//           onClick={() => setOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed md:static top-0 left-0 z-50 h-screen bg-white border-[0.1px] shadow-sm flex flex-col transition-all duration-300 rounded-xl
//           ${open ? 'w-64' : 'w-0'} md:w-64 overflow-hidden`}
//       >
//         {/* Logo Section */}
//         {/* <div className="flex items-center justify-between px-4 py-5 border-b">
//           <Link href="/" className="hover:opacity-90 transition">
//             {logo ? (
//               <Image
//                 src={logo}
//                 alt="Logo"
//                 width={140}
//                 height={36}
//                 className="rounded-md object-contain"
//               />
//             ) : (
//               <div className="w-[140px] h-9 bg-gray-200 animate-pulse rounded-md" />
//             )}
//           </Link>
//           <button
//             onClick={() => setOpen(false)}
//             className="md:hidden text-gray-500 hover:text-red-600 transition"
//           >
//             <X size={22} />
//           </button>
//         </div> */}

//         {/* Quick Tips */}
//         <div className="m-3 p-4 bg-gray-50 border rounded-xl shadow-sm">
//           <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">
//             Quick Tips
//           </h3>
//           <p className="text-sm font-medium text-gray-800">
//             Keep your profile updated
//           </p>
//           <p className="text-xs text-gray-500 mt-1">
//             Completing your profile helps us tailor counselling, alerts, and
//             application reminders specifically for you.
//           </p>
//         </div>

//         {/* Nav Links */}
//         <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
//           <SidebarLink href="/" icon={<Home size={18} />} label="Home" />
//           <SidebarLink
//             href="/user/profile"
//             icon={<User size={18} />}
//             label="My Profile"
//           />
//           <SidebarLink
//             href="/user/shortlisted"
//             icon={<Heart size={18} />}
//             label="Shortlisted"
//           />
//           <SidebarLink
//             href="/user/auth/changePassword"
//             icon={<User size={18} />}
//             label="Change Password"
//           />
//         </nav>

//         {/* Logout Button */}
//         <div className="border-t px-3 py-4">
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 px-3 py-2 rounded-md text-red-500 hover:text-red-600 transition hover:bg-red-50 w-full"
//           >
//             <LogOut size={18} />
//             <span className="text-sm font-medium">Logout</span>
//           </button>
//         </div>
//       </aside>
//     </>
//   )
// }

// function SidebarLink({
//   href,
//   icon,
//   label,
// }: {
//   href: string
//   icon: React.ReactNode
//   label: string
// }) {
//   return (
//     <Link
//       href={href}
//       className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition"
//     >
//       <div className="flex-shrink-0">{icon}</div>
//       <span className="text-sm font-medium">{label}</span>
//     </Link>
//   )
// }
"use client";

import { Home, User, Heart, LogOut, KeyRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/Store/userStore";
import { useRouter } from "next/navigation";

export default function UserSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useUserStore();

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem("redirectAfterLogin");
    sessionStorage.removeItem("pendingShortlistCollege");
    router.replace("/user/auth/logIn");
  };

  const links = [
    { href: "/", icon: <Home size={15} />, label: "Home" },
    { href: "/user/profile", icon: <User size={15} />, label: "My Profile" },
    { href: "/user/shortlisted", icon: <Heart size={15} />, label: "Shortlisted" },
    ...(user?.authProvider === "google"
      ? []
      : [{ href: "/user/auth/changePassword", icon: <KeyRound size={15} />, label: "Change Password" }]),
  ];

  return (
    <aside className="flex flex-col h-full bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* User card */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5 bg-gray-50 rounded-lg px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-medium shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{user?.name || "User"}</p>
            <p className="text-xs text-gray-400">Student</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5">
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider px-2 py-1.5">
          Navigation
        </p>
        {links.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
              pathname === href
                ? "bg-indigo-50 text-indigo-700 font-medium"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span className={pathname === href ? "text-indigo-600" : "text-gray-400"}>
              {icon}
            </span>
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition w-full"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  );
}
