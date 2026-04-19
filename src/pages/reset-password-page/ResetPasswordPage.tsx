import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../utils/api.js'
import { Formik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
});

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const uid = searchParams.get("uid");
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'finshed'>('loading');
  async function isValid() {
    try {
      if (!uid || !token) { setStatus('error'); return; }
      await api.get(`/auth/reset-password/?uid=${uid}&token=${token}`)
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }
  async function handleResetPassword(password: string, confirmPassword: string) {
    try {
      setStatus("loading")
      await api.post(`/auth/reset-password/`, { uid, token, password, password_confirm: confirmPassword })
      setStatus("success")
      toast.success("password updated successfully")
    } catch {
      setStatus("error")
      toast.error("something went wrong. try again!")
    } finally {
      setStatus('finshed')
    }
  }
  useEffect(()=> {
    isValid()
  },[])
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#fafafa] font-[var(--font-display)] antialiased p-6">
      <div className="w-full max-w-[480px] bg-white p-8 md:p-12 shadow-sm border border-[#eee] rounded-[4px] text-center relative overflow-hidden">
        {/* Top Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff5021] to-[#ff9b44]"></div>

        {status === 'loading' && (
          <div className="py-12">
            <div className="w-16 h-16 border-4 border-[#eee] border-t-[#ff5021] rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-[28px] font-bold text-[#111] tracking-tight mb-3">Processing...</h2>
            <p className="text-[15px] text-[#666]">Please wait while we securely confirm your request.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="py-12">
            <div className="w-16 h-16 bg-[#fff2ef] rounded-full flex items-center justify-center mx-auto mb-6 text-[#ff5021]">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-[28px] font-bold text-[#111] tracking-tight mb-3">Link Invalid or Used</h2>
            <p className="text-[15px] text-[#666] mb-8 leading-relaxed">
              This link is no longer valid. It may have expired, or you might have already used it to successfully reset your password.
            </p>
            <Link to="/send-reset-password" className="block w-full bg-[#151515] hover:bg-black transition-colors text-white py-3.5 px-6 rounded-[3px] text-[13px] font-bold tracking-[0.2em] uppercase cursor-pointer no-underline mb-3">
              Request New Link
            </Link>
            <div className="mt-4 text-[13px] text-[#888]">
              Remember your password?{' '}
              <Link to="/login" className="text-[#ff5021] hover:text-[#ff5021] opacity-90 hover:opacity-100 font-bold no-underline transition-colors ml-1">
                Log in
              </Link>
            </div>
          </div>
        )}

        {status === 'success' && (
          <>
            {/* Lock Icon */}
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
              Set New Password
            </h2>
            <p className="font-[var(--font-serif)] italic text-[16px] text-[#666] mb-8 leading-relaxed">
              Please enter your new password below. Make sure it's secure and easy for you to remember.
            </p>

            <Formik
              initialValues={{ password: '', confirmPassword: '' }}
              validationSchema={ResetPasswordSchema}
              onSubmit={(values) => {
                handleResetPassword(values.password, values.confirmPassword);
              }}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.15em] text-[#aaa] uppercase mb-2">
                      New Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 bg-[#f9f9f9] border rounded-[3px] focus:outline-none focus:border-[#ff5021] transition-colors text-[14px] ${errors.password && touched.password ? 'border-red-500' : 'border-[#eee]'}`}
                    />
                    {errors.password && touched.password ? (
                      <div className="text-red-500 text-[11px] mt-1 italic">{errors.password}</div>
                    ) : null}
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-[0.15em] text-[#aaa] uppercase mb-2">
                      Confirm Password
                    </label>
                    <input
                      name="confirmPassword"
                      type="password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="••••••••"
                      className={`w-full px-4 py-3 bg-[#f9f9f9] border rounded-[3px] focus:outline-none focus:border-[#ff5021] transition-colors text-[14px] ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-[#eee]'}`}
                    />
                    {errors.confirmPassword && touched.confirmPassword ? (
                      <div className="text-red-500 text-[11px] mt-1 italic">{errors.confirmPassword}</div>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#151515] hover:bg-black transition-colors text-white border-0 py-4 px-6 rounded-[3px] text-[13px] font-bold tracking-[0.2em] uppercase cursor-pointer mt-4"
                  >
                    Update Password
                  </button>
                </form>
              )}
            </Formik>

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

        {status === 'finshed' && (
          <div className="py-12">
            <div className="w-16 h-16 bg-[#ebf8f2] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#00a35c]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-[28px] font-bold text-[#111] tracking-tight mb-3">All Done!</h2>
            <p className="text-[15px] text-[#666] mb-8">You have completed the password reset process.</p>
            <Link to="/login" className="text-[#ff5021] font-bold no-underline">Go to Login</Link>
          </div>
        )}
      </div>
    </div>
  );
}
