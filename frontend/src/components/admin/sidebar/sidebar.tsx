"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import axios from "axios";
import { api_url, img_url } from "@/utils/apiCall";
import {
  Home,
  Users,
  Settings,
  School,
  GraduationCap,
  Briefcase,
  ArrowLeftCircle,
  ArrowRightCircle,
  FileText,
  ChevronRight,
  ShieldCheck,
  User,
  Grid,
  Book,
  PhoneIcon,
  CheckCircle,
  Plug,
  Monitor,
  LogOut,
} from "lucide-react";
import {
  BookOpenIcon,
  ChatBubbleLeftIcon,
  DocumentIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useAdminStore } from "@/Store/adminStore";

interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  text: string;
  isOpen: boolean;
  subMenu?: SidebarLinkProps[];
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data } = await axios.get(`${api_url}settings`);
        if (data.siteLogo) {
          setLogo(`${img_url.replace(/\/$/, "")}${data.siteLogo}`);
        }
      } catch (error) {
        console.error("Error fetching site logo:", error);
      }
    };

    fetchLogo();
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const toggleMenu = (menu: string) => {
    setActiveMenu((prevMenu) => (prevMenu === menu ? null : menu));
  };

  const menuItems: SidebarLinkProps[] = [
    { href: "/admin/dashboard", icon: <Home size={20} />, text: "Dashboard", isOpen },
    {
      href: "#",
      icon: <Briefcase size={20} />,
      text: "Leads",
      isOpen,
      subMenu: [
        { href: "/admin/leads/newletter", icon: <FileText size={18} />, text: "Newsletter", isOpen },
        { href: "/admin/leads/getFreeCounselling", icon: <ChatBubbleLeftIcon className="h-5 w-5" />, text: "Counseling", isOpen },
        { href: "/admin/leads/enrolledStudents", icon: <UserGroupIcon className="h-5 w-5" />, text: "Enrolled students", isOpen },
        { href: "/admin/leads/contactUs", icon: <PhoneIcon size={18} />, text: "Contact Us", isOpen },
      ],
    },
    {
      href: "#",
      icon: <School size={20} />,
      text: "Colleges",
      isOpen,
      subMenu: [
        { href: "/admin/manageColleges", icon: <School size={18} />, text: "Manage Colleges", isOpen },
        { href: "/admin/addBrochure", icon: <DocumentIcon className="h-5 w-5" />, text: "Add Brochure", isOpen },
      ],
    },
    { href: "/admin/manageCourses", icon: <GraduationCap size={20} />, text: "Courses", isOpen },
    {
      href: "#",
      icon: <Grid size={20} />,
      text: "MenuBuilder",
      isOpen,
      subMenu: [{ href: "/admin/menuBuilder", icon: <Book size={18} />, text: "CourseMenu", isOpen }],
    },
    {
      href: "#",
      icon: <BookOpenIcon className="h-5 w-5" />,
      text: "Content",
      isOpen,
      subMenu: [
        { href: "/admin/pages", icon: <FileText size={18} />, text: "Pages", isOpen },
        { href: "/admin/trendingNow", icon: <Plug size={18} />, text: "Trending Now", isOpen },
      ],
    },
    { href: "/admin/blogs", icon: <FileText size={20} />, text: "Blogs & News", isOpen },
    {
      href: "#",
      icon: <Users size={20} />,
      text: "Users",
      isOpen,
      subMenu: [
        { href: "/admin/users/admin", icon: <ShieldCheck size={18} />, text: "Admin", isOpen },
        { href: "/admin/users/users", icon: <User size={18} />, text: "User", isOpen },
      ],
    },
    {
      href: "#",
      icon: <Settings size={20} />,
      text: "Settings",
      isOpen,
      subMenu: [
        { href: "/admin/settings", icon: <Settings size={18} />, text: "General Settings", isOpen },
        { href: "/admin/courseList", icon: <BookOpenIcon className="h-5 w-5" />, text: "Courses List", isOpen },
        { href: "/admin/approvels", icon: <CheckCircle size={18} />, text: "Approval List", isOpen },
        { href: "/admin/affiliatedBy", icon: <Book size={18} />, text: "Affiliated By List", isOpen },
        { href: "/admin/ownership", icon: <UserGroupIcon className="h-5 w-5" />, text: "Ownership", isOpen },
        { href: "/admin/streams", icon: <Grid size={18} />, text: "Streams", isOpen },
        { href: "/admin/programMode", icon: <School size={18} />, text: "Program Mode", isOpen },
        { href: "/admin/examExpected", icon: <BookOpenIcon className="h-5 w-5" />, text: "Exam Expected", isOpen },
        { href: "/admin/ads", icon: <Monitor size={18} />, text: "Advertisement", isOpen },
        { href: "/admin/specialization", icon: <Grid size={18} />, text: "Specialization", isOpen },
        { href: "/admin/termsandconditions", icon: <FileText size={18} />, text: "Terms & Conditions", isOpen },
        { href: "/admin/privacyPolicy", icon: <FileText size={18} />, text: "Privacy Policy", isOpen },
        { href: "/admin/meta", icon: <FileText size={18} />, text: "Meta", isOpen }, // ✅ New Meta submenu
      ],
    },
  ];

  return (
    <div
      className={`flex flex-col h-screen transition-all duration-300 ease-in-out shadow-2xl bg-gradient-to-b from-[#0a0536] to-[#2b1b67] text-white ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-white">
        {isOpen && (
          <div className="flex items-center space-x-2">
            {logo ? (
              <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
            ) : (
              <span className="text-sm font-semibold text-[#0a0536]">Admin Panel</span>
            )}
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="text-[#0a0536] text-xl p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <ArrowLeftCircle size={22} /> : <ArrowRightCircle size={22} />}
        </button>
      </div>

      {/* Scrollable Sidebar Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map(({ href, icon, text, subMenu }) => (
          <div key={text}>
            {subMenu ? (
              <>
                <button
                  onClick={() => toggleMenu(text)}
                  className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-[#4f2780] transition-all"
                >
                  <div className="flex items-center space-x-4">
                    {icon}
                    {isOpen && <span className="text-sm">{text}</span>}
                  </div>
                  {isOpen && (
                    <ChevronRight size={18} className={`transition-transform ${activeMenu === text ? "rotate-90" : ""}`} />
                  )}
                </button>
                {activeMenu === text && (
                  <div className="pl-8 mt-1 space-y-1">
                    {subMenu.map(({ href, icon, text }) => (
                      <SidebarLink key={href} href={href} icon={icon} text={text} isOpen={isOpen} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <SidebarLink key={href} href={href} icon={icon} text={text} isOpen={isOpen} />
            )}
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-800 flex-shrink-0 space-y-3">
        <button
          onClick={() => {
            useAdminStore.getState().logout();
            sessionStorage.removeItem("admin_store");
            window.location.href = "/cs-admin";
          }}
          className={`w-full flex items-center ${
            isOpen ? "justify-start space-x-3" : "justify-center"
          } px-3 py-2 rounded-lg bg-white text-[#0a0536] font-semibold hover:bg-gray-100 transition`}
        >
          <LogOut size={18} />
          {isOpen && <span>Logout</span>}
        </button>
        <p className="text-center text-gray-300 text-xs">© 2025 Collegeseek.in</p>
      </div>
    </div>
  );
};

function SidebarLink({ href, icon, text, isOpen }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-4 p-2 rounded-lg hover:bg-[#4f2780] transition-all ${
        isOpen ? "justify-start" : "justify-center"
      }`}
    >
      {icon}
      {isOpen && <span className="text-sm">{text}</span>}
    </Link>
  );
}

export default Sidebar;
