import api from '../../utils/api.js';
import { useLocation, useNavigate } from "react-router";
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addToken } from '../../store/slices/authSlicer';

export default function EmailPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { email, password } = location.state || {};

    if (!email || !password) {
        navigate('/register', { replace: true });
        return null;
    }

    async function handleResendEmail(emailAddr:string) {
        try {
            await api.post('/auth/verify-token/verify/', { email: emailAddr });
            toast.success("Verification email resent! Check your inbox.");
        } catch (err) {
            toast.error("Error resending verification email.");
        }
    }

    async function handleAlreadyVerified(emailAddr:string, pass:string) {
        try {
            const res = await api.post('/auth/login/', { email: emailAddr, password: pass });
            dispatch(addToken({ token: res.data.access, user: res.data.user }));
            navigate('/')
        } catch(err) {
            toast.error("You are not verified yet! Please check your email.");
        }
    }
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#fafafa] font-[var(--font-display)] antialiased p-6">
      <div className="w-full max-w-[480px] bg-white p-8 md:p-12 shadow-sm border border-[#eee] rounded-[4px] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff5021] to-[#ff9b44]"></div>

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

        {/* Text content */}
        <h2 className="text-[28px] font-bold text-[#111] tracking-tight mb-3">
          Check your email
        </h2>
        <p className="font-[var(--font-serif)] italic text-[16px] text-[#666] mb-8 leading-relaxed">
          We've sent a verification link to your email. Please check your inbox and click the link to verify your identity before continuing.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="w-full bg-[#151515] hover:bg-black transition-colors text-white border-0 py-3.5 px-6 rounded-[3px] text-[13px] font-bold tracking-[0.2em] uppercase cursor-pointer"
            onClick={()=> handleAlreadyVerified(email,password)}
          >
            I've Verified My Email
          </button>
          
          <div className="flex items-center text-center mt-2 mb-2">
            <div className="flex-1 border-b border-[#eee]"></div>
            <span className="px-3 text-[#ccc] text-[10px] font-bold tracking-[0.15em] uppercase">
              OR
            </span>
            <div className="flex-1 border-b border-[#eee]"></div>
          </div>

          <button
            type="button"
            className="w-full bg-transparent hover:bg-gray-50 border border-[#ddd] transition-colors text-[#111] py-3.5 px-6 rounded-[3px] text-[13px] font-bold tracking-[0.2em] uppercase cursor-pointer"
            onClick={()=> handleResendEmail(email)}
          >
            Resend Email
          </button>
        </div>

        <div className="mt-8 text-[13px] text-[#888]">
          Didn't receive it? Check your spam folder or try resending.
        </div>
      </div>
    </div>
  );
}