import { useNavigate } from "react-router-dom";

export default function DonationCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#fafafa] font-[var(--font-display)] antialiased p-6">
      <div className="w-full max-w-[480px] bg-white p-8 md:p-12 shadow-sm border border-[#eee] rounded-[4px] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-400 to-gray-500"></div>

        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Text content */}
        <h2 className="text-[28px] font-bold text-[#111] tracking-tight mb-3">
          Payment Cancelled
        </h2>
        <p className="font-[var(--font-serif)] italic text-[16px] text-[#666] mb-8 leading-relaxed">
          Your checkout process was cancelled and you haven't been charged. Feel free to try again whenever you're ready.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="w-full bg-[#151515] hover:bg-black transition-colors text-white border-0 py-3.5 px-6 rounded-[3px] text-[13px] font-bold tracking-[0.2em] uppercase cursor-pointer"
            onClick={() => navigate(-1)} // Takes them back to the previous page (project details)
          >
            Try Again
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
            onClick={() => navigate('/')}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
