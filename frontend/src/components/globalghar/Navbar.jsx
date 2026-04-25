import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Sparkles, X } from 'lucide-react';
import { loginSuccess, logout } from '../../store/authSlice';
import api from '../../utils/api';
import { BrandLogo } from './BrandLogo';

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/properties', label: 'Properties' },
  { href: '/properties?sortBy=investment', label: 'Investment Picks', ai: true },
];

function NavLabel({ link }) {
  if (!link.ai) {
    return link.label;
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <Sparkles className="h-3.5 w-3.5 text-amber-400 transition-transform duration-300 group-hover:scale-110" />
      <span>{link.label}</span>
      <span className="-ml-0.5 -translate-y-2 text-[10px] font-black uppercase leading-none tracking-wide text-amber-400">
        AI
      </span>
    </span>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = user?.email || localStorage.getItem('email') || '';
  const username = user?.username || user?.fullName || (userEmail ? userEmail.split('@')[0] : '');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!isAuthenticated || userEmail) return;

    let isMounted = true;

    api.get('/auth/me')
      .then((response) => {
        const currentUser = response.data?.data;
        if (isMounted && currentUser?.email) {
          dispatch(loginSuccess({ user: currentUser }));
        }
      })
      .catch(() => {
        // Keep the nav from showing a username/name fallback if the session is stale.
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch, isAuthenticated, userEmail]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Clear local auth even if the access token has already expired server-side.
    } finally {
      dispatch(logout());
      navigate('/');
    }
  };

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${isScrolled || location.pathname !== '/' ? 'border-b border-white/5 bg-slate-900/95 shadow-lg shadow-black/10 backdrop-blur-xl' : 'bg-transparent'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-20 items-center justify-between">
          <BrandLogo size="sm" />

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className={`group relative font-medium transition-colors duration-300 hover:text-white ${link.ai ? 'text-white' : 'text-white/70'}`}>
                <NavLabel link={link} />
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                to="/dashboard"
                title={userEmail ? `Open dashboard (${userEmail})` : 'Open dashboard'}
                className="max-w-[240px] truncate rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/80 transition-colors hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-300"
              >
                {username || 'Account'}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-amber-400/30 px-3 py-2 text-sm font-semibold text-amber-400 transition-colors hover:bg-amber-400/10 hover:text-amber-300"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-4 md:flex">
              <Link
                to="/login"
                state={{ from: location }}
                className="rounded-lg px-4 py-2 font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/signup"
                state={{ from: location }}
                className="rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 font-semibold text-slate-900 shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-600"
              >
                Get Started
              </Link>
            </div>
          )}

          <button
            onClick={() => setIsMobileMenuOpen((value) => !value)}
            className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        <div className={`overflow-hidden transition-all duration-300 md:hidden ${isMobileMenuOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
          <div className="flex flex-col gap-4 border-t border-white/10 pt-4">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className="flex items-center gap-2 py-2 font-medium text-white/80 transition-colors hover:text-amber-400">
                <NavLabel link={link} />
              </Link>
            ))}
            {isAuthenticated ? (
              <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
                <Link
                  to="/dashboard"
                  title={userEmail ? `Open dashboard (${userEmail})` : 'Open dashboard'}
                  className="truncate rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-center text-sm font-semibold text-white/80 transition-colors hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-300"
                >
                  {username || 'Account'}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-400/30 px-4 py-2 font-semibold text-amber-400"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
                <Link to="/login" state={{ from: location }} className="rounded-lg border border-white/20 px-4 py-2 text-center font-semibold text-white">
                  Login
                </Link>
                <Link to="/signup" state={{ from: location }} className="rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-center font-semibold text-slate-900">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
