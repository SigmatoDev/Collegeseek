'use client';

import { useState, useEffect } from 'react';
import { Mail, Send, ShieldCheck, RotateCcw, ArrowLeft, CheckCircle2, GraduationCap } from 'lucide-react';
import { api_url } from '@/utils/apiCall';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      setLoading(true);
      const res = await axios.post(`${api_url}admin/forgot-password`, { email });
      setMessage(res.data.message || 'Password reset email sent!');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const steps = [
    { label: 'Enter your email', sub: 'Use the email linked to your admin account' },
    { label: 'Check your inbox', sub: 'A reset link will arrive within a minute' },
    { label: 'Set a new password', sub: 'Click the link and create a new secure password' },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen p-6 px-[500px]">

      {/* ── Left Panel ── */}
      <div className="flex-1 bg-[#0a0536] flex flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-indigo-500/[0.07] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-emerald-400/[0.06] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-white/[0.04] pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white/10 border border-white/[0.12] rounded-lg flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="text-[15px] font-medium text-white tracking-tight">Collegeseek</span>
          <span className="text-[10px] font-medium text-white/30 bg-white/[0.08] border border-white/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
        </div>

        {/* Center */}
        <div>
          <div className="w-14 h-14 bg-indigo-400/10 border border-indigo-400/20 rounded-[14px] mt-3 flex items-center justify-center mb-3">
            <ShieldCheck size={24} className="text-indigo-400" />
          </div>
          <h1 className="text-[32px] font-medium text-white leading-[1.2] tracking-tight mb-3.5">
            Locked out?<br />We've got you.
          </h1>
          <p className="text-sm text-white/40 leading-relaxed max-w-xs mb-6">
            Enter your admin email and we'll send a secure link to reset your password instantly.
          </p>
          <div className="flex flex-col gap-3.5 max-w-xs">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-3.5">
                <div className="w-7 h-7 rounded-full bg-indigo-400/10 border border-indigo-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[11px] font-medium text-indigo-400">{i + 1}</span>
                </div>
                <div>
                  <p className="text-[13px] font-medium text-white/75 mb-0.5">{s.label}</p>
                  <p className="text-xs text-white/30">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-white/20 mt-6">© 2025 Collegeseek. All rights reserved.</p>
      </div>

      {/* ── Right Panel ── */}
      <div className="w-[450px] h-[59vh] flex-shrink-0 bg-gray-50 flex items-center justify-center px-10 py-12">
        <div className="w-full max-w-[360px]">

          <a href="/admin/auth/login" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition mb-8">
            <ArrowLeft size={14} />
            Back to sign in
          </a>

          {!submitted ? (
            <>
              <div className="mb-7">
                <h2 className="text-[22px] font-medium text-gray-900 tracking-tight mb-1.5">Forgot your password?</h2>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  Enter the email address linked to your admin account and we'll send you a reset link.
                </p>
              </div>

              {error && (
                <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleForgot} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                    <input
                      suppressHydrationWarning
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="admin@collegeseek.in"
                      className="w-full h-[42px] pl-8 pr-3 border border-gray-200 rounded-lg bg-white text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[42px] bg-[#0a0536] hover:bg-[#1a0f4f] disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      Send reset link
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-gray-400" />
                  <span className="text-[11px] text-gray-400">Link expires in 15 min</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={12} className="text-gray-400" />
                  <span className="text-[11px] text-gray-400">Admin only</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="w-14 h-14 bg-green-50 border border-green-200 rounded-[14px] flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={24} className="text-green-600" />
              </div>
              <h2 className="text-xl font-medium text-gray-900 tracking-tight mb-2">Check your inbox</h2>
              <p className="text-[13px] text-gray-500 leading-relaxed mb-6">
                We've sent a password reset link to{' '}
                <span className="text-gray-700 font-medium">{email}</span>.
                The link expires in 15 minutes.
              </p>
              <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-xs font-medium text-gray-600 mb-2">Didn't receive it?</p>
                <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside leading-relaxed">
                  <li>Check your spam or junk folder</li>
                  <li>Make sure the email is linked to an admin account</li>
                  <li>Wait a minute and try again</li>
                </ul>
              </div>
              <button
                onClick={() => { setSubmitted(false); setEmail(''); }}
                className="w-full h-[42px] bg-[#0a0536] hover:bg-[#1a0f4f] text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition"
              >
                <RotateCcw size={13} />
                Resend reset link
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;