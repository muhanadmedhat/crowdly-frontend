import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">

      {/* Decorative spinning circles (background) */}
      <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full border-2 border-primary opacity-5 animate-spin-slower pointer-events-none" />
      <div className="absolute top-20 left-1/3 w-16 h-16 rounded-full border border-primary opacity-5 animate-spin-slow pointer-events-none" />

      <div className="text-center max-w-2xl w-full">

        {/* 404 — floats up and down + scale-in entrance */}
        <div className="mb-8 relative animate-float">
          <h1
            className="display-lg font-black text-primary animate-scale-in"
            style={{ fontSize: '7rem', lineHeight: 1 }}
          >
            404
          </h1>
        </div>

        {/* Heading */}
        <h2 className="headline-md text-on-background mb-4 font-bold animate-fade-in-up delay-200">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="body-md text-text-secondary mb-8 max-w-lg mx-auto animate-fade-in-up delay-300">
          The page you're looking for seems to have wandered off. Don't worry,
          we have plenty of other amazing campaigns to explore!
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-400">
          <button
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center gap-2 group"
          >
            {/* Arrow wiggles left-right continuously */}
            <ArrowLeft size={18} className="animate-wiggle" />
            Go Back
          </button>

          <Link to="/">
            <button className="btn-primary flex items-center gap-2">
              <Home size={18} />
              Back to Home
            </button>
          </Link>
        </div>

        {/* Explore suggestions */}
        <div className="mt-12 pt-8 border-t border-border-secondary animate-fade-in-up delay-500">
          <p className="text-text-secondary text-sm mb-6">
            Or explore these popular categories:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Explore', 'Categories', 'About', 'Contact'].map((label, i) => (
              <Link key={label} to={`/${label.toLowerCase()}`}>
                <button
                  className="btn-secondary text-sm hover:border-primary hover:text-primary transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${600 + i * 80}ms` }}
                >
                  {label}
                </button>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
