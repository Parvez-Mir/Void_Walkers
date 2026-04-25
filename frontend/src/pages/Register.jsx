import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Check, Eye, EyeOff, Globe, Lock, Mail, Shield, Sparkles, User } from 'lucide-react';
import api from '../utils/api';

const BrandLogo = ({ align = 'left', reverse = false }) => (
  <Link to="/" className={`flex items-center gap-3 group w-fit ${align === 'center' ? 'mx-auto' : ''} ${align === 'right' ? 'ml-auto' : ''}`}>
    {!reverse && (
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-amber-500/50">
        <span className="text-2xl font-bold text-slate-900">P</span>
      </div>
    )}
    <span className="text-3xl font-bold tracking-tight text-white">
      Prop<span className="text-amber-400">Intel</span>
    </span>
    {reverse && (
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-amber-500/50">
        <span className="text-2xl font-bold text-slate-900">P</span>
      </div>
    )}
  </Link>
);

const initialForm = {
  fullName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const passwordRequirements = useMemo(() => [
    { text: 'At least 6 characters', met: formData.password.length >= 6 },
    { text: 'Passwords match', met: formData.password === formData.confirmPassword && formData.password.length > 0 },
    { text: 'Username added', met: formData.username.trim().length > 0 },
    { text: 'Terms accepted', met: acceptedTerms },
  ], [acceptedTerms, formData.confirmPassword, formData.password, formData.username]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: name === 'username' ? value.toLowerCase().replace(/\s+/g, '') : value,
    }));
  };

  const validate = () => {
    if (!formData.fullName.trim()) return 'Full name is required.';
    if (!formData.username.trim()) return 'Username is required.';
    if (!formData.email.trim()) return 'Email is required.';
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) return 'Enter a valid email address.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
    if (!acceptedTerms) return 'Please accept the terms to create an account.';
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');

    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/register', {
        fullName: formData.fullName.trim(),
        username: formData.username.trim().toLowerCase(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      navigate('/login');
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex w-full items-center justify-center overflow-y-auto p-6 sm:p-12 lg:w-1/2">
        <div className="w-full max-w-md animate-fade-in-left space-y-6 py-8">
          <div className="mb-6 flex justify-center lg:hidden">
            <BrandLogo align="center" />
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="mt-2 text-white/60">Start your smart property journey today</p>
          </div>

          {errorMsg && (
            <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-white/80">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <input id="fullName" name="fullName" type="text" placeholder="Enter your full name" value={formData.fullName} onChange={handleChange} className="h-14 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-white/40 outline-none transition focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20" autoComplete="name" required />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-white/80">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <input id="username" name="username" type="text" placeholder="choose-a-username" value={formData.username} onChange={handleChange} className="h-14 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-white/40 outline-none transition focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20" autoComplete="username" required />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white/80">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <input id="email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className="h-14 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-4 text-white placeholder:text-white/40 outline-none transition focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20" autoComplete="email" required />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white/80">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" value={formData.password} onChange={handleChange} className="h-14 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-12 text-white placeholder:text-white/40 outline-none transition focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20" autoComplete="new-password" required />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white/70" aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-white/80">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
                <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} className="h-14 w-full rounded-xl border border-white/10 bg-white/5 pl-12 pr-12 text-white placeholder:text-white/40 outline-none transition focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20" autoComplete="new-password" required />
                <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white/70" aria-label="Toggle confirm password visibility">
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {(formData.password || formData.username || acceptedTerms) && (
              <div className="grid grid-cols-2 gap-2">
                {passwordRequirements.map((requirement) => (
                  <div key={requirement.text} className={`flex items-center gap-2 text-xs ${requirement.met ? 'text-emerald-400' : 'text-white/40'}`}>
                    <span className={`flex h-4 w-4 items-center justify-center rounded-full ${requirement.met ? 'bg-emerald-500/20' : 'bg-white/10'}`}>
                      {requirement.met && <Check className="h-2.5 w-2.5" />}
                    </span>
                    {requirement.text}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-start gap-3">
              <button type="button" onClick={() => setAcceptedTerms((value) => !value)} className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${acceptedTerms ? 'border-amber-500 bg-amber-500' : 'border-white/20 bg-white/5'}`} aria-label="Accept terms">
                {acceptedTerms && <Check className="h-3 w-3 text-slate-900" />}
              </button>
              <p className="text-sm text-white/60">
                I agree to the <span className="text-amber-400">Terms of Service</span> and <span className="text-amber-400">Privacy Policy</span>.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !acceptedTerms}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-lg font-semibold text-slate-900 shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-[1.02] hover:from-amber-500 hover:to-amber-600 hover:shadow-amber-500/50 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-white/60">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-amber-400 transition-colors hover:text-amber-300">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
        <div className="absolute inset-0">
          <img src="/images/ahmedabad-property-3.jpg" alt="Luxury property interior" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-slate-900/95 via-slate-900/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/50" />
        </div>

        <div className="relative z-10 flex w-full flex-col justify-between p-12">
          <BrandLogo reverse align="right" />

          <div className="animate-fade-in-right space-y-8 text-right">
            <div>
              <h1 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                Join the future of <span className="text-gold-gradient">property intelligence</span>
              </h1>
              <p className="ml-auto mt-4 max-w-md text-lg text-white/70">
                Get access to AI-powered recommendations, structured listing data, and transparent search tools.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Sparkles, text: 'AI-powered recommendations' },
                { icon: Building2, text: 'Premium Ahmedabad listings' },
                { icon: Shield, text: 'Verified property signals' },
                { icon: Globe, text: 'Remote buyer support' },
              ].map((benefit, index) => (
                <div key={benefit.text} className="flex items-center justify-end gap-3 text-white/80" style={{ animationDelay: `${(index + 1) * 150}ms` }}>
                  <span className="font-medium">{benefit.text}</span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/20">
                    <benefit.icon className="h-5 w-5 text-amber-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-dark rounded-2xl p-6">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-gold-gradient text-3xl font-bold">1K+</p>
                <p className="mt-1 text-sm text-white/60">Properties</p>
              </div>
              <div>
                <p className="text-gold-gradient text-3xl font-bold">20+</p>
                <p className="mt-1 text-sm text-white/60">Localities</p>
              </div>
              <div>
                <p className="text-gold-gradient text-3xl font-bold">AI</p>
                <p className="mt-1 text-sm text-white/60">Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
