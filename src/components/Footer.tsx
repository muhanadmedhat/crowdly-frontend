import { FaFacebook } from 'react-icons/fa';
import { FaSquareXTwitter, FaYoutube } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

export default function Footer() {
  const ref = useReveal<HTMLElement>();
  const today = new Date();

  const footerLinkClasses =
    'text-[var(--color-text-secondary)] text-sm hover:text-[var(--color-primary)] transition-colors duration-200';

  return (
    <footer
      ref={ref}
      className="bg-[var(--color-surface-container)] border-t border-[var(--color-outline-variant)]/30"
    >
      {/* Main columns */}
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

          {/* Brand + social */}
          <div className="reveal flex flex-col gap-3 sm:col-span-2 md:col-span-1">
            <p className="text-2xl font-black text-gradient">Crowdly</p>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed max-w-xs">
              Helping people co-operate and fill in the blanks. All for one and one for all!
            </p>
            <div className="flex gap-5 mt-1">
              {[FaFacebook, FaSquareXTwitter, FaYoutube].map((Icon, i) => (
                <div
                  key={i}
                  className="cursor-pointer text-[var(--color-text-secondary)] transition-all duration-300 hover:text-[var(--color-primary)] hover:scale-125"
                >
                  <Icon size="1.4em" />
                </div>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div className="reveal delay-100 flex flex-col gap-4">
            <p className="text-xs font-black tracking-wider uppercase">Platform</p>
            <div className="flex flex-col gap-2">
              <Link to="/createProject" className={footerLinkClasses}>Start A Campaign</Link>
              <Link to="/categories"    className={footerLinkClasses}>View Categories</Link>
              <Link to="/explore"       className={footerLinkClasses}>Explore Projects</Link>
            </div>
          </div>

          {/* Company */}
          <div className="reveal delay-200 flex flex-col gap-4">
            <p className="text-xs font-black tracking-wider uppercase">Company</p>
            <div className="flex flex-col gap-2">
              <Link to="/about"         className={footerLinkClasses}>About Us</Link>
              <Link to="/contact"       className={footerLinkClasses}>Contact</Link>
              <Link to="/privacy&terms" className={footerLinkClasses}>Privacy &amp; Terms</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="reveal-expand h-px mx-6 max-w-6xl md:mx-auto bg-gradient-to-r from-transparent via-[var(--color-outline-variant)] to-transparent" />

      {/* Copyright */}
      <div className="reveal text-center py-6 delay-400">
        <p className="text-[var(--color-text-secondary)] text-xs tracking-wide">
          {today.getFullYear()} &copy; Crowdly &mdash; All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
