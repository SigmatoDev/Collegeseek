'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import { api_url } from '@/utils/apiCall';
import axios from 'axios';

const SignUp = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false); // Fix hydration issue
  const router = useRouter();

  // Ensure hydration consistency
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(`${api_url}admin/signup`, {
        name,
        email,
        password,
      });

      if (response.status !== 201) throw new Error(response.data.message || 'Sign-up failed');

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return null; // Prevents mismatch between server and client
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg transition-transform hover:scale-105">
        <h2 className="text-3xl font-semibold text-center text-gray-900">Sign Up</h2>
        <p className="text-center text-gray-500 mt-1">Create your account to get started.</p>
        {error && <p className="text-red-500 text-center mt-3 font-medium">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="relative">
            <UserIcon className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
            <input
              type="text"
              className="w-full px-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              type="password"
              className="w-full px-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
              placeholder="Password"
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
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
          <p className="text-center text-gray-600 mt-4 text-sm">
            Already have an account? <a href="/admin/auth/logIn" className="text-blue-600 hover:underline font-medium">Log in</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
