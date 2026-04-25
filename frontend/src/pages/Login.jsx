import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Eye, EyeOff, Globe, Lock, Shield, UserRound } from 'lucide-react';
import { loginSuccess } from '../store/authSlice';
import api from '../utils/api';

const BrandLogo = ({ align = 'left' }) => (
  <Link to="/" className={`flex items-center gap-3 group w-fit ${align === 'center' ? 'mx-auto' : ''}`}>
    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-amber-500/50">
      <span className="text-2xl font-bold text-slate-900">P</span>
    </div>
    <span className="text-3xl font-bold tracking-tight text-white">
      Prop<span className="text-amber-400">Intel</span>
    </span>
  </Link>
);

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');

    if (!identifier.trim() || !password) {
      setErrorMsg('Email or username and password are required.');
      return;
    }

    setIsLoading(true);
    try {
      const trimmedIdentifier = identifier.trim();
      const payload = trimmedIdentifier.includes('@')
        ? { email: trimmedIdentifier.toLowerCase(), password }
        : { username: trimmedIdentifier.toLowerCase(), password };

      const response = await api.post('/auth/login', payload);
      const { accessToken, refreshToken, user } = response.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      dispatch(loginSuccess({ user }));
      navigate('/dashboard');
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
        <div className="absolute inset-0">
          <img src="/images/ahmedabad-property-1.jpg" alt="Luxury property" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/50" />
        </div>

        <div className="relative z-10 flex w-full flex-col justify-between p-12">
          <BrandLogo />

          <div className="animate-fade-in-up space-y-8">
            <div>
              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Your property intelligence <span className="text-gold-gradient">dashboard awaits</span>
              </h1>
              <p className="mt-4 max-w-md text-lg text-white/70">
                Access AI-ranked listings, verified property data, and remote buyer workflows from one place.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Building2, text: 'Ahmedabad-focused property catalog' },
                { icon: Shield, text: 'Structured legal and seller signals' },
                { icon: Globe, text: 'Built for remote property decisions' },
              ].map((feature, index) => (
                <div key={feature.text} className="flex items-center gap-3 text-white/80" style={{ animationDelay: `${(index + 1) * 150}ms` }}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/20">
                    <feature.icon className="h-5 w-5 text-amber-400" />
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-dark rounded-2xl p-6">
            <p className="italic text-white/90">
              "PropIntel makes property discovery feel data-driven instead of guess-driven."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 font-bold text-slate-900">
                P
              </div>
              <div>
                <p className="font-semibold text-white">PropIntel Research</p>
                <p className="text-sm text-white/60">AI-assisted property intelligence</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-6 sm:p-12 lg:w-1/2">
        <div className="w-full max-w-md animate-fade-in-right space-y-8">
          <div className="mb-8 flex justify-center lg:hidden">
            <BrandLogo align="center" />
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="mt-2 text-white/60">Sign in to continue your property journey</p>
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="identifier" className="text-sm font-medium text-white/80">Email or Username</label>
              <div className="relative">
                <UserRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <input
                  id="identifier"
                  type="text"
                  placeholder="Enter your email or username"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  className="h-14 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-white/40 outline-none transition focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white/80">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-14 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-12 text-white placeholder:text-white/40 outline-none transition focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white/70" aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-lg font-semibold text-slate-900 shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-[1.02] hover:from-amber-500 hover:to-amber-600 hover:shadow-amber-500/50 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-white/60">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-amber-400 transition-colors hover:text-amber-300">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
