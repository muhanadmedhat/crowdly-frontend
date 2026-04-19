import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';
import withLoading from '../../utils/WithLoading.tsx';
import GoogleButton from '../../components/GoogleButton/GoogleButton';
import RegisterForm from './RegisterForm';
import RegisterLeftPanel from './RegisterLeftPanel';
import { useState } from 'react';

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async (values: any) => {
    try {
      await withLoading(
        api.post('/auth/register/', values)
      );
      toast.success("Registered successfully!");;
      navigate('/email-verification',{
        state: {
            email: values.email,
            password: values.password
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden font-[var(--font-display)] antialiased bg-white">
      <RegisterLeftPanel />
      {/* Right Panel */}
      <div className="flex-1 lg:flex-[1.4] bg-white flex justify-center p-4 lg:p-6 overflow-y-auto relative border-l border-[#f1f1f1]">
        <div className="w-full max-w-[420px] py-4">
          <h2 className="text-[28px] font-bold text-[#111] tracking-tight">
            Create your account
          </h2>
          <p className="font-[var(--font-serif)] italic text-[15px] text-[#666] mb-3">
            Start your journey into purposeful crowdfunding today.
          </p>

          <GoogleButton />

          <div className="flex items-center text-center mt-3 mb-3">
            <div className="flex-1 border-b border-[#eee]"></div>
            <span className="px-4 text-[#aaa] text-[10px] font-bold tracking-[0.15em] uppercase">
              OR CONTINUE WITH
            </span>
            <div className="flex-1 border-b border-[#eee]"></div>
          </div>
          
          <RegisterForm handleRegister={handleRegister}  />

          <div className="text-center text-[13px] text-[#666] mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-[#ff5021] hover:text-[#ff5021] opacity-90 hover:opacity-100 font-bold no-underline ml-1 transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}