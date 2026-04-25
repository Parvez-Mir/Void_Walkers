import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, Info, LogOut, Menu, Sparkles, TriangleAlert, X } from 'lucide-react';
import { loginSuccess, logout } from '../../store/authSlice';
import api from '../../utils/api';
import { BrandLogo } from './BrandLogo';

const navLinks = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/properties', label: 'Properties' },
  { href: '/properties?sortBy=investment', label: 'Investment Picks', ai: true },
];

const notifications = [
  {
    id: 'legal-review',
    tone: 'red',
    stage: 'Pre-buying',
    title: 'Legal review needed',
    message: 'RERA and title documents are still pending for one shortlisted Ambli property.',
    time: '10 min ago',
  },
  {
    id: 'price-watch',
    tone: 'yellow',
    stage: 'Pre-buying',
    title: 'Price watch triggered',
    message: 'Bopal 3 BHK prices moved 4.8% this week. Recheck negotiation room before booking.',
    time: '2 hrs ago',
  },
  {
    id: 'verification-cleared',
    tone: 'green',
    stage: 'Pre-buying',
    title: 'Verification cleared',
    message: 'Seller identity and uploaded approvals passed review for your Shela listing.',
    time: 'Today',
  },
  {
    id: 'tax-reminder',
    tone: 'red',
    stage: 'Post-buying',
    title: 'Property tax due soon',
    message: 'AMC tax payment window closes in 5 days for your saved ownership checklist.',
    time: 'Tomorrow',
  },
  {
    id: 'handover-pending',
    tone: 'yellow',
    stage: 'Post-buying',
    title: 'Handover checklist pending',
    message: 'Utility transfer and society NOC are still open for the possession workflow.',
    time: 'This week',
  },
  {
    id: 'rent-ready',
    tone: 'green',
    stage: 'Post-buying',
    title: 'Rental readiness improved',
    message: 'Comparable rents increased near GIFT City corridor. Estimated yield is now stronger.',
    time: 'Just now',
  },
];

const notificationTone = {
  red: {
    label: 'Critical',
    dot: 'bg-red-500',
    text: 'text-red-300',
    bg: 'bg-red-500/10',
    border: 'border-red-400/30',
    icon: TriangleAlert,
  },
  yellow: {
    label: 'Watch',
    dot: 'bg-yellow-400',
    text: 'text-yellow-300',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-400/30',
    icon: Info,
  },
  green: {
    label: 'Positive',
    dot: 'bg-emerald-400',
    text: 'text-emerald-300',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-400/30',
    icon: CheckCircle2,
  },
};

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

function NotificationItem({ notification }) {
  const tone = notificationTone[notification.tone];
  const Icon = tone.icon;

  return (
    <div className={`rounded-xl border ${tone.border} ${tone.bg} p-3`}>
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${tone.dot}`} />
          <span className={`text-xs font-black uppercase tracking-wide ${tone.text}`}>{tone.label}</span>
        </div>
        <span className="shrink-0 text-xs font-semibold text-white/40">{notification.time}</span>
      </div>
      <div className="flex gap-3">
        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone.text}`} />
        <div>
          <p className="text-sm font-bold text-white">{notification.title}</p>
          <p className="mt-1 text-xs leading-relaxed text-white/60">{notification.message}</p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-white/35">{notification.stage}</p>
        </div>
      </div>
    </div>
  );
}

function NotificationBell({ mobile = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const counts = notifications.reduce((summary, notification) => {
    summary[notification.tone] += 1;
    return summary;
  }, { red: 0, yellow: 0, green: 0 });

  if (mobile) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-amber-400" />
            <span className="font-bold text-white">Alerts</span>
          </div>
        </div>
        <div className="space-y-3">
          {notifications.slice(0, 3).map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 transition hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-300"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Property alerts"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-slate-900">
          {notifications.length}
        </span>
      </button>

      <div className={`absolute right-0 top-12 w-[390px] origin-top-right rounded-2xl border border-white/10 bg-slate-950/98 p-4 text-left shadow-2xl shadow-black/40 backdrop-blur-xl transition duration-200 ${isOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100'}`}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-white/40">Property alerts</p>
            <h3 className="mt-1 text-lg font-bold text-white">Pre and post-buying signals</h3>
          </div>
          <div className="flex gap-1.5 text-[11px] font-bold text-white/60">
            <span className="rounded-full bg-red-500/15 px-2 py-1 text-red-300">{counts.red}</span>
            <span className="rounded-full bg-yellow-500/15 px-2 py-1 text-yellow-300">{counts.yellow}</span>
            <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-300">{counts.green}</span>
          </div>
        </div>
        <div className="max-h-[430px] space-y-3 overflow-y-auto pr-1">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    </div>
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
              <NotificationBell />
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

        <div className={`overflow-hidden transition-all duration-300 md:hidden ${isMobileMenuOpen ? 'max-h-[760px] overflow-y-auto pb-6' : 'max-h-0'}`}>
          <div className="flex flex-col gap-4 border-t border-white/10 pt-4">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className="flex items-center gap-2 py-2 font-medium text-white/80 transition-colors hover:text-amber-400">
                <NavLabel link={link} />
              </Link>
            ))}
            <NotificationBell mobile />
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
