import { useNavigate, useSearchParams } from "react-router-dom";

export default function DonationSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

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
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        {/* Text content */}
        <h2 className="text-[28px] font-bold text-[#111] tracking-tight mb-3">
          Donation Successful!
        </h2>
        <p className="font-[var(--font-serif)] italic text-[16px] text-[#666] mb-8 leading-relaxed">
          Thank you for your generous contribution. Your support is making a real difference and helping the project reach its goal.
        </p>

        {sessionId && (
            <p className="text-xs text-[#888] font-mono break-all mb-8 bg-gray-50 p-2 rounded border border-gray-100">
              Receipt ID: {sessionId}
            </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="w-full bg-[#151515] hover:bg-black transition-colors text-white border-0 py-3.5 px-6 rounded-[3px] text-[13px] font-bold tracking-[0.2em] uppercase cursor-pointer"
            onClick={() => navigate('/')}
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
}
