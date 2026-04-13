'use client';

import { useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { api_url } from '@/utils/apiCall';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const params = useParams();
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${api_url}admin/reset-password/${token}`,
        { password, confirmPassword }
      );
      setSuccess(response.data.message || 'Password reset successfully!');
      setTimeout(() => router.push('/cs-admin'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-[440px] rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">

        {/* Header */}
        <div className="bg-[#0a0536] px-8 pt-8 pb-6 relative">
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-400 to-emerald-400" />
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4">
            <LockClosedIcon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-medium text-white">Reset password</h2>
          <p className="text-sm text-white/50 mt-0.5">Enter and confirm your new password</p>
        </div>

        {/* Body */}
        <div className="px-8 py-7">
          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-5">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 mb-5">
              {success} Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* New Password */}
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-1.5">
                New password
              </label>
              <div className="relative">
                {/* ✅ suppressHydrationWarning stops browser extension attribute mismatch */}
                <input
                  suppressHydrationWarning
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Min. 8 characters"
                  className="w-full h-11 pl-3 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-sm font-mono text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                  required
                />
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <input
                  suppressHydrationWarning
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  placeholder="Repeat new password"
                  className="w-full h-11 pl-3 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-sm font-mono text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                  required
                />
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {confirmPassword && (
                <p className={`text-[11px] mt-1 ${password === confirmPassword ? 'text-emerald-600' : 'text-red-500'}`}>
                  {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </div>

            <div className="border-t border-gray-100 pt-5">
              <button
                suppressHydrationWarning
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#0a0536] hover:bg-[#1a0f4f] disabled:bg-gray-300 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Resetting...
                  </>
                ) : (
                  'Reset password'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;