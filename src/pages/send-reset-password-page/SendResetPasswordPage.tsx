import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api.js';
import { Formik } from 'formik';
import toast from 'react-hot-toast';

export default function SendResetPasswordPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  async function handleSendResetEmail(email: string) {
    try {
      setStatus('loading');
      await api.post(`/auth/send-reset-password/`, { email });
      setStatus('success');
      toast.success("Password reset email sent!");
    } catch {
      setStatus('idle');
      toast.error("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#fafafa] font-[var(--font-display)] antialiased p-6">
      <div className="w-full max-w-[480px] bg-white p-8 md:p-12 shadow-sm border border-[#eee] rounded-[4px] text-center relative overflow-hidden">
        {/* Top Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff5021] to-[#ff9b44]"></div>

        {status === 'loading' && (
          <div className="py-12">
            <div className="w-16 h-16 border-4 border-[#eee] border-t-[#ff5021] rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-[28px] font-bold text-[#111] tracking-tight mb-3">Sending...</h2>
            <p className="text-[15px] text-[#666]">Please wait while we send the email.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-12">
            <div className="w-16 h-16 bg-[#fff2ef] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-[#ff5021]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <h2 className="text-[28px] font-bold text-[#111] tracking-tight mb-3">Check Your Email</h2>
            <p className="text-[15px] text-[#666] mb-8">We've sent a password reset link to your email address.</p>
            <Link to="/login" className="text-[#ff5021] font-bold no-underline">Back to Login</Link>
          </div>
        )}

        {status === 'idle' && (
          <>
            {/* Icon */}
            <div className="w-16 h-16 bg-[#fff2ef] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-[#ff5021]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>

            <h2 className="text-[28px] font-bold text-[#111] tracking-tight mb-3">
              Forgot Password?
            </h2>
            <p className="font-[var(--font-serif)] italic text-[16px] text-[#666] mb-8 leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {/* Form Fields */}
            <Formik
              initialValues={{ email: '' }}
              onSubmit={(values) => {
                if (!values.email) {
                  toast.error("Please enter your email!");
                  return;
                }
                handleSendResetEmail(values.email);
              }}
            >
              {({ values, handleChange, handleSubmit }) => (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.15em] text-[#aaa] uppercase mb-2">
                      Email Address
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-[#eee] rounded-[3px] focus:outline-none focus:border-[#ff5021] transition-colors text-[14px]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#151515] hover:bg-black transition-colors text-white border-0 py-4 px-6 rounded-[3px] text-[13px] font-bold tracking-[0.2em] uppercase cursor-pointer mt-4"
                  >
                    Send Reset Link
                  </button>
                </form>
              )}
            </Formik>

            {/* Footer Link */}
            <div className="mt-8 text-[13px] text-[#888]">
              Remember your password?{' '}
              <Link
                to="/login"
                className="text-[#ff5021] hover:text-[#ff5021] opacity-90 hover:opacity-100 font-bold no-underline transition-colors ml-1"
              >
                Log in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
