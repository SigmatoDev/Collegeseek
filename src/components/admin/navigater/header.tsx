import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Bell, UserCircle, LogOut, Key } from "lucide-react";
import { useAdminStore } from "@/Store/adminStore";

const Header = () => {
  const handleLogout = () => {
    useAdminStore.getState().logout(); // Clear Zustand store
    sessionStorage.removeItem("admin_store"); // Optional extra clear
    window.location.href = "/admin/auth/logIn"; // Redirect to login page
  };

  return (
    <header className="bg-[#0a0536] text-white p-4 sm:p-5 flex justify-between items-center shadow-lg rounded-lg">
      {/* Left Side: Dashboard Title */}
      <h1 className="text-2xl font-semibold tracking-wide">Admin Dashboard</h1>

      {/* Right Side: Notifications and Profile */}
      <div className="flex items-center space-x-6">
        {/* Notification Icon */}
        <div className="relative cursor-pointer">
          <Bell className="w-6 h-6 text-white hover:text-gray-400 transition duration-300" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        </div>

        {/* Profile Dropdown */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center space-x-2 bg-[#4f2780] px-3 py-2 rounded-full hover:bg-[#3a1d66] transition duration-300">
            <UserCircle className="w-6 h-6 text-white" />
            <span className="text-sm hidden sm:block">Admin</span>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="py-1">
                {/* Change Password Option */}
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/admin/changePassword"
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${
                        active ? "bg-[#0a0536] text-white" : "text-gray-700"
                      } rounded-md`}
                    >
                      <Key size={16} /> Change Password
                    </a>
                  )}
                </Menu.Item>

                {/* Logout Option */}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`w-full text-left flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${
                        active ? "bg-[#0a0536] text-white" : "text-gray-700"
                      } rounded-md`}
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
