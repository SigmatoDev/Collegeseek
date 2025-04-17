'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { api_url } from '@/utils/apiCall';
import axios from 'axios';
import { useAdminStore } from '@/Store/adminStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const { setAdmin } = useAdminStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${api_url}admin/login`, { email, password });
      const { token, admin } = response.data;

      sessionStorage.setItem('token', token);
      setAdmin(admin);

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg transition-transform hover:scale-105">
        <h2 className="text-3xl font-semibold text-center text-gray-900">Log in</h2>
        <p className="text-center text-gray-500 mt-1">Welcome back! Please enter your details.</p>
        {error && <p className="text-red-500 text-center mt-3 font-medium">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="relative">
            <EnvelopeIcon className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
            <input
              type="email"
              className="w-full px-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <LockClosedIcon className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full px-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeSlashIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
            </button>
          </div>
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-400" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="/admin/auth/forgotPassword" className="text-blue-600 hover:underline">Forgot password?</a>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
          <p className="text-center text-gray-600 mt-4 text-sm">
            Don't have an account?{' '}
            <a href="/admin/auth/signUp" className="text-blue-600 hover:underline font-medium">Sign up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
