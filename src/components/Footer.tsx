import { FaFacebook } from 'react-icons/fa';
import { FaSquareXTwitter, FaYoutube } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';

export default function Footer() {
  const ref = useReveal<HTMLElement>();
  const today = new Date();

  const footerLinkClasses =
    'relative py-1 duration-300 hover:text-primary transition-all text-on-surface border-b-2 border-transparent hover:border-primary';

  return (
    <footer
      ref={ref}
      className="bg-linear-to-br from-outline-variant/40 to-surface-container/30 border-t border-border-secondary/30"
    >
      {/* Main columns */}
      <div className="w-[90%] mx-auto flex justify-between py-16">

        {/* Motto */}
        <div className="reveal flex flex-col space-y-4">
          <p className="text-2xl font-black text-gradient">Crowdly</p>
          <p className="max-w-xs text-text-secondary body-md">
            Helping people co-operate and fill in the blanks! All for one and one
            for all!
          </p>
        </div>

        {/* Platform */}
        <div className="reveal delay-100">
          <div className="flex flex-col space-y-4 uppercase">
            <p className="text-sm font-black tracking-wider">Platform</p>
            <div className="text-sm flex flex-col space-y-2">
              <Link to="/campaigns"  className={footerLinkClasses}>Start A Campaign</Link>
              <Link to="/categories" className={footerLinkClasses}>View Categories</Link>
              <Link to="/explore"    className={footerLinkClasses}>Explore Projects</Link>
            </div>
          </div>
        </div>

        {/* Company */}
        <div className="reveal delay-200">
          <div className="flex flex-col space-y-4 uppercase">
            <p className="text-sm font-black tracking-wider">Company</p>
            <div className="text-sm flex flex-col space-y-2">
              <Link to="/about"          className={footerLinkClasses}>About Us</Link>
              <Link to="/contact"        className={footerLinkClasses}>Contact</Link>
              <Link to="/privacy&terms"  className={footerLinkClasses}>Privacy &amp; Terms</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="reveal-expand w-[90%] mx-auto h-px bg-gradient-to-r from-transparent via-border-secondary to-transparent" />

      {/* Social icons */}
      <div className="flex space-x-8 justify-center mt-8">
        {[FaFacebook, FaSquareXTwitter, FaYoutube].map((Icon, i) => (
          <div
            key={i}
            className="reveal-scale cursor-pointer transition-all duration-300 hover:text-primary hover:scale-125"
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <Icon size="1.5em" />
          </div>
        ))}
      </div>

      {/* Copyright */}
      <div className="reveal text-center py-8 delay-400">
        <p className="text-text-secondary text-sm">
          {today.getFullYear()} &copy; Crowdly All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
