'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { api_url } from '@/utils/apiCall';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false); // To ensure the component is only rendered on the client side

  useEffect(() => {
    setMounted(true); // Mark the component as mounted
  }, []);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await axios.post(`${api_url}admin/forgot-password`, { email });
      setMessage(res.data.message || 'Password reset email sent!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null; // Avoid rendering before mounting on the client

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Forgot Password</h2>
        <p className="text-center text-gray-500 mb-4">Enter your email to receive reset instructions.</p>
        {message && <p className="text-green-500 text-center">{message}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleForgot} className="space-y-4 mt-4">
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
