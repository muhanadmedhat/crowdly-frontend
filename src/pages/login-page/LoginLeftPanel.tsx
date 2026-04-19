export default function LoginLeftPanel() {
  return (
    <div className="flex-1 lg:flex-[1.1] bg-gradient-to-br from-[#f4f3ef] via-[#f4f3ef] to-[#ebd7ca] p-8 lg:p-12 flex flex-col justify-between h-full overflow-hidden">
      <div className="flex flex-col w-full max-w-[560px] mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 xl:mb-14">
          <div className="w-7 h-7 rounded-md flex justify-center items-center overflow-hidden">
            <img src="icon.jpg" alt="" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-[#111]">CROWDLY</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl lg:text-5xl xl:text-[56px] leading-[1.1] font-normal text-[#1a1a1a] mb-10 xl:mb-14 tracking-tighter pr-4">
          Welcome back. The world needs your support.
        </h1>

        {/* Benefits List */}
        <ul className="flex flex-col gap-6 xl:gap-8">
          <li className="flex items-center gap-5">
            <div className="w-7 h-7 text-[var(--color-primary)] shrink-0 flex justify-center items-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <span className="text-xl text-[#333] leading-relaxed font-normal">
              Your donations make a real difference
            </span>
          </li>
          <li className="flex items-center gap-5">
            <div className="w-7 h-7 text-[var(--color-primary)] shrink-0 flex justify-center items-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M3 3v18h18M7 16l4-4 4 4 6-6" />
                <path d="M21 10V4h-6" />
              </svg>
            </div>
            <span className="text-xl text-[#333] leading-relaxed font-normal">
              Track all your backed campaigns
            </span>
          </li>
          <li className="flex items-center gap-5">
            <div className="w-7 h-7 text-[var(--color-primary)] shrink-0 flex justify-center items-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                <path d="M10 15l-3-3 1.41-1.41L10 12.17l5.59-5.59L17 8l-7 7z" fill="white" />
              </svg>
            </div>
            <span className="text-xl text-[#333] leading-relaxed font-normal">
              Secure & private account
            </span>
          </li>
        </ul>
      </div>

      {/* Global Stats Pill */}
      <div className="mt-8 w-full max-w-[560px] mx-auto flex justify-center lg:justify-start">
        <div className="bg-white/80 px-6 py-4 rounded-full inline-flex items-center gap-3 shadow-sm">
          <div className="w-5 h-5 text-[var(--color-primary)]">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
          <span className="text-[11px] font-bold tracking-[0.15em] text-[#111] uppercase">
            OVER 10,000 CAMPAIGNS FUNDED WORLDWIDE
          </span>
        </div>
      </div>
    </div>
  );
}
