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
} from "lucide-react";
import { BookOpenIcon, ChatBubbleLeftIcon, DocumentIcon, UserGroupIcon } from "@heroicons/react/24/outline";

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
      subMenu: [
        { href: "/admin/menuBuilder", icon: <Book size={18} />, text: "CourseMenu", isOpen },
      ],
    },
    {
      href: "#",
      icon: <BookOpenIcon className="h-5 w-5" />,
      text: "Content",
      isOpen,
      subMenu: [
        { href: "/admin/pages", icon: <FileText size={18} />, text: "Pages", isOpen },
        { href: "/admin/modules", icon: <Grid size={18} />, text: "Modules", isOpen },
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
        { href: "/admin/coursesList", icon: <BookOpenIcon className="h-5 w-5" />, text: "Courses List", isOpen },
        { href: "/admin/termsandconditions", icon: <FileText size={18} />, text: "Terms & Conditions", isOpen },
        { href: "/admin/privacy-policy", icon: <FileText size={18} />, text: "Privacy Policy", isOpen },
      ]
    },
  ];

  return (
    <div
      className={`flex flex-col transition-all duration-300 ease-in-out h-screen shadow-lg bg-gradient-to-b from-[#0a0536] to-[#2b1b67] text-white ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* Sidebar Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        {isOpen && logo && <img src={logo} alt="Logo" className="w-40 h-auto" />}
        <button onClick={toggleSidebar} className="text-white text-xl hover:text-gray-400 transition-all">
          {isOpen ? <ArrowLeftCircle size={24} /> : <ArrowRightCircle size={24} />}
        </button>
      </div>

      {/* Sidebar Links */}
      <nav className="flex flex-col space-y-2 p-4">
        {menuItems.map(({ href, icon, text, isOpen, subMenu }) => (
          <div key={text}>
            {subMenu ? (
              <div>
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
                  <div className="pl-8 mt-1">
                    {subMenu.map(({ href, icon, text }) => (
                      <SidebarLink key={href} href={href} icon={icon} text={text} isOpen={isOpen} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <SidebarLink key={href} href={href} icon={icon} text={text} isOpen={isOpen} />
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto p-4 text-center text-gray-400 text-xs">
        © 2025 Company Name
      </div>
    </div>
  );
};

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon, text, isOpen }) => (
  <Link href={href} legacyBehavior>
    <a className="flex items-center space-x-4 p-2 rounded-lg hover:bg-[#4f2780] transition-all">
      {icon}
      {isOpen && <span className="text-sm">{text}</span>}
    </a>
  </Link>
);

export default Sidebar;
