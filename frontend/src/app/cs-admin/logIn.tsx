// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
// import { api_url } from '@/utils/apiCall';
// import axios from 'axios';
// import { useAdminStore } from '@/Store/adminStore';

// const AdminLogin = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [mounted, setMounted] = useState(false);
//   const router = useRouter();

//   const { setAdmin } = useAdminStore();

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await axios.post(`${api_url}admin/login`, { email, password });
//       const { token, admin } = response.data;

//       sessionStorage.setItem('token', token);
//       setAdmin(admin);

//       router.push('/admin/dashboard');
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!mounted) return null;

//   return (
//     <div className="flex items-center justify-center min-h-screen p-6">
//       <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg transition-transform hover:scale-105">
//         <h2 className="text-3xl font-semibold text-center text-gray-900">Log in</h2>
//         <p className="text-center text-gray-500 mt-1">Welcome back! Please enter your details.</p>
//         {error && <p className="text-red-500 text-center mt-3 font-medium">{error}</p>}
//         <form onSubmit={handleSubmit} className="mt-6 space-y-5">
//           <div className="relative">
//             <EnvelopeIcon className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
//             <input
//               type="email"
//               className="w-full px-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
//               placeholder="Email address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//           <div className="relative">
//             <LockClosedIcon className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
//             <input
//               type={showPassword ? 'text' : 'password'}
//               className="w-full px-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <button
//               type="button"
//               className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
//               onClick={() => setShowPassword((prev) => !prev)}
//             >
//               {showPassword ? <EyeSlashIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
//             </button>
//           </div>
//           <div className="flex justify-between items-center text-sm">
//             <label className="flex items-center space-x-2">
//               <input type="checkbox" className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400" />
//               <span className="text-gray-600">Remember me</span>
//             </label>
//             <a href="/admin/auth/forgotPassword" className="text-blue-600 hover:underline">Forgot password?</a>
//           </div>
//           <button
//             type="submit"
//             className="w-full px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md disabled:opacity-50"
//             disabled={loading}
//           >
//             {loading ? 'Logging in...' : 'Log in'}
//           </button>
//           {/* <p className="text-center text-gray-600 mt-4 text-sm">
//             Don't have an account?{' '}
//             <a href="/admin/auth/signUp" className="text-blue-600 hover:underline font-medium">Sign up</a>
//           </p> */}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LogIn,
  Mail,
  Lock,
  GraduationCap,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { api_url } from "@/utils/apiCall";
import axios from "axios";
import { useAdminStore } from "@/Store/adminStore";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { setAdmin } = useAdminStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${api_url}admin/login`, {
        email,
        password,
      });
      const { token, admin } = response.data;
      sessionStorage.setItem("token", token);
      setAdmin(admin);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-[350px] flex">
      {/* ── Left Panel ── */}
      <div className="flex-1 bg-[#0a0536] flex flex-col justify-between p-12 relative overflow-hidden">
        {/* Background circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-indigo-500/[0.07] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-emerald-400/[0.06] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-white/[0.04] pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white/10 border border-white/[0.12] rounded-lg flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="text-[15px] font-medium text-white tracking-tight">
            Collegeseek
          </span>
          <span className="text-[10px] font-medium text-white/30 bg-white/[0.08] border border-white/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Admin
          </span>
        </div>

        {/* Center */}
        <div>
          <div className="inline-flex items-center gap-1.5 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-3 py-1 mb-7">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] text-emerald-400 font-medium">
              All systems operational
            </span>
          </div>
          <h1 className="text-[36px] font-medium text-white leading-[1.2] tracking-tight mb-4">
            Login to Admin
          </h1>
          <p className="text-sm text-white/40 leading-relaxed max-w-sm mb-10">
            Access the Collegeseek admin console to manage colleges, users,
            applications and platform settings.
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-[360px]">
            {[
              ["2.4k", "Colleges"],
              ["18k", "Students"],
              ["98%", "Uptime"],
            ].map(([val, label]) => (
              <div
                key={label}
                className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4"
              >
                <p className="text-xl font-medium text-white mb-1">{val}</p>
                <p className="text-[11px] text-white/35">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-white/20">
          © 2025 Collegeseek. All rights reserved.
        </p>
      </div>

      {/* ── Right Panel ── */}
      <div className="w-[480px] flex-shrink-0 bg-gray-50 flex items-center justify-center px-10 py-12">
        <div className="w-full max-w-[360px]">
          <div className="mb-8">
            <h2 className="text-[22px] font-medium text-gray-900 tracking-tight mb-1.5">
              Welcome back
            </h2>
            <p className="text-[13px] text-gray-500">
              Sign in to your admin account to continue.
            </p>
          </div>

          {error && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                />
                <input
                  suppressHydrationWarning
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="admin@collegeseek.in"
                  className="w-full h-[42px] pl-8 pr-3 border border-gray-200 rounded-lg bg-white text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
                />
                <input
                  suppressHydrationWarning
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  className="w-full h-[42px] pl-8 pr-10 border border-gray-200 rounded-lg bg-white text-sm font-mono text-gray-800 placeholder:text-gray-300 placeholder:font-sans focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                  required
                />
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 accent-indigo-600"
                />
                Remember me
              </label>
              <a
                href="/admin/auth/forgotPassword"
                className="text-xs text-indigo-600 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[42px] bg-[#0a0536] hover:bg-[#1a0f4f] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition mt-2"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={14} />
                  Sign in
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-gray-400" />
              <span className="text-[11px] text-gray-400">SSL encrypted</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-[11px] text-gray-400">
                Session auto-expires
              </span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-300" />
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-gray-400" />
              <span className="text-[11px] text-gray-400">Admin only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
