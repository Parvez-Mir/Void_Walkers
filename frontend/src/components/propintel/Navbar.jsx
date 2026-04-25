import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Sparkles, X } from 'lucide-react';

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
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${isScrolled || location.pathname !== '/' ? 'border-b border-white/5 bg-slate-900/95 shadow-lg shadow-black/10 backdrop-blur-xl' : 'bg-transparent'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-20 items-center justify-between">
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 transition-all duration-300 group-hover:scale-105">
              <span className="text-xl font-bold text-slate-900">P</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Prop<span className="text-amber-400">Intel</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className={`group relative font-medium transition-colors duration-300 hover:text-white ${link.ai ? 'text-white' : 'text-white/70'}`}>
                <NavLabel link={link} />
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <Link to="/login" className="rounded-lg px-4 py-2 font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white">
              Login
            </Link>
            <Link to="/register" className="rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 font-semibold text-slate-900 shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:from-amber-500 hover:to-amber-600">
              Get Started
            </Link>
          </div>

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
            <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
              <Link to="/login" className="rounded-lg border border-white/20 px-4 py-2 text-center font-semibold text-white">
                Login
              </Link>
              <Link to="/register" className="rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2 text-center font-semibold text-slate-900">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
