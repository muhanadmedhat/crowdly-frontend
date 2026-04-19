import { Link, NavLink, useNavigate } from 'react-router-dom';
import type { NavLinkRenderProps } from 'react-router-dom';
import { useState } from 'react';
import { Search, User, LogOut, Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToken } from '../store/slices/authSlicer';

export default function Navbar() {
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?q=${encodeURIComponent(search)}`);
    setShowSearch(false);
    setMenuOpen(false);
  };

  const navLinkClasses = ({ isActive }: NavLinkRenderProps): string =>
    `relative py-1 duration-300 hover:text-primary-hover transition-all ` +
    (isActive
      ? 'text-primary border-b-2 border-primary'
      : 'text-on-surface border-b-2 border-transparent');

  const handleLogout = () => {
    dispatch(removeToken());
    navigate('/login');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="w-full sticky top-0 z-50 animate-slide-down bg-[var(--color-background)] border-b border-[var(--color-outline-variant)]/30">
      {/* ── Desktop + tablet bar ── */}
      <div className="w-[90%] mx-auto flex items-center justify-between py-4">
        <Link to="/" className="headline-md font-bold shrink-0" onClick={closeMenu}>
          Crowdly
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex space-x-6 uppercase font-medium">
          <NavLink to="/explore" className={navLinkClasses}>Explore</NavLink>
          <NavLink to="/categories" className={navLinkClasses}>Categories</NavLink>
          <NavLink to="/about" className={navLinkClasses}>About</NavLink>
          <NavLink to="/contact" className={navLinkClasses}>Contact</NavLink>
        </div>

        {/* Desktop auth / actions */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={() => setShowSearch(true)}
                  className="p-2 rounded-full hover:bg-black/5 hover:text-primary transition-colors duration-300"
                  aria-label="Open search"
                >
                  <Search className="cursor-pointer" size={20} />
                </button>

                {showSearch && (
                  <form
                    onSubmit={handleSearch}
                    className="absolute right-0 flex items-center overflow-hidden rounded-full border border-[#eee] bg-white shadow-md z-50"
                    style={{ minWidth: '220px' }}
                  >
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm outline-none bg-transparent"
                      autoFocus
                    />
                    <button type="submit" className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors">Go</button>
                    <button type="button" onClick={() => { setShowSearch(false); setSearch(''); }} className="px-3 py-2 text-sm text-gray-400 hover:text-black transition-colors">✕</button>
                  </form>
                )}
              </div>

              <Link to="/createProject">
                <button type="button" className="btn-primary">Start A Campaign</button>
              </Link>

              <Link to="/profile" className="p-2 rounded-full hover:bg-black/5 hover:text-primary transition-colors duration-300">
                <User className="cursor-pointer" />
              </Link>
              <button type="button" onClick={handleLogout} className="p-2 rounded-full hover:bg-black/5 hover:text-primary transition-colors duration-300" title="Logout">
                <LogOut className="cursor-pointer" size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <p className="uppercase hover:text-primary-hover duration-300 transition-colors">Login</p>
              </Link>
              <Link to="/register">
                <button type="button" className="btn-primary">Register</button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-black/5 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--color-background)] border-t border-[var(--color-outline-variant)]/30 px-6 pb-6 pt-4 flex flex-col gap-4">
          {/* Nav links */}
          <div className="flex flex-col gap-3 uppercase font-medium text-sm">
            <NavLink to="/explore" className={navLinkClasses} onClick={closeMenu}>Explore</NavLink>
            <NavLink to="/categories" className={navLinkClasses} onClick={closeMenu}>Categories</NavLink>
            <NavLink to="/about" className={navLinkClasses} onClick={closeMenu}>About</NavLink>
            <NavLink to="/contact" className={navLinkClasses} onClick={closeMenu}>Contact</NavLink>
          </div>

          <div className="border-t border-[var(--color-outline-variant)]/40 pt-4 flex flex-col gap-3">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex items-center overflow-hidden rounded-full border border-[#eee] bg-white shadow-sm">
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 text-sm outline-none bg-transparent"
              />
              <button type="submit" className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors">
                <Search size={16} />
              </button>
            </form>

            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <Link to="/createProject" onClick={closeMenu}>
                  <button type="button" className="btn-primary w-full">Start A Campaign</button>
                </Link>
                <div className="flex gap-3">
                  <Link to="/profile" onClick={closeMenu} className="flex-1">
                    <button type="button" className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-[var(--color-outline-variant)] text-sm font-medium hover:bg-black/5 transition-colors">
                      <User size={16} /> Profile
                    </button>
                  </Link>
                  <button type="button" onClick={handleLogout} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-[var(--color-outline-variant)] text-sm font-medium hover:bg-black/5 transition-colors">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" onClick={closeMenu} className="flex-1">
                  <button type="button" className="w-full py-2 rounded-lg border border-[var(--color-outline-variant)] text-sm font-medium uppercase hover:bg-black/5 transition-colors">Login</button>
                </Link>
                <Link to="/register" onClick={closeMenu} className="flex-1">
                  <button type="button" className="btn-primary w-full">Register</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
