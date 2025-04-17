'use client';

import { useState } from 'react';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { api_url } from '@/utils/apiCall';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

const ResetPassword = () => {
  const { token } = useParams(); // Using useParams to extract token from the URL path
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Check if the passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${api_url}admin/resetPassword`, {
        token,
        password,
        confirmPassword,
      });

      // Redirect to login after password reset success
      router.push('/admin/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg transition-transform hover:scale-105">
        <h2 className="text-3xl font-semibold text-center text-gray-900">Reset Password</h2>
        <p className="text-center text-gray-500 mt-1">Enter your new password.</p>
        {error && <p className="text-red-500 text-center mt-3 font-medium">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="relative">
            <LockClosedIcon className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
            <input
              type="password"
              className="w-full px-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <LockClosedIcon className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
            <input
              type="password"
              className="w-full px-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Resetting password...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
