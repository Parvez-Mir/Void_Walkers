import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';

const footerLinks = {
  product: [
    { label: 'Features', href: '/#features' },
    { label: 'How it Works', href: '/#how-it-works' },
    { label: 'Properties', href: '/properties' },
    { label: 'Investment Picks', href: '/properties?sortBy=investment' },
  ],
  company: [
    { label: 'About', href: '/#features' },
    { label: 'Search', href: '/properties' },
    { label: 'Login', href: '/login' },
    { label: 'Register', href: '/register' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link to="/" className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30">
                <span className="text-xl font-bold text-slate-900">P</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Prop<span className="text-amber-400">Intel</span>
              </span>
            </Link>
            <p className="mb-6 max-w-sm leading-relaxed text-white/60">AI-powered real estate search built for NRIs and remote buyers exploring Ahmedabad properties.</p>
            <div className="space-y-3">
              <a href="mailto:hello@propintel.com" className="flex items-center gap-3 text-white/60 transition-colors hover:text-amber-400">
                <Mail className="h-4 w-4" />
                hello@propintel.com
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-3 text-white/60 transition-colors hover:text-amber-400">
                <Phone className="h-4 w-4" />
                +91 98765 43210
              </a>
              <div className="flex items-center gap-3 text-white/60">
                <MapPin className="h-4 w-4" />
                Ahmedabad, Gujarat, India
              </div>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 font-semibold capitalize text-white">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-white/60 transition-colors hover:text-amber-400">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-6 pt-8 md:flex-row">
          <p className="text-center text-sm text-white/40 md:text-left">© 2026 PropIntel. Built for remote property decisions.</p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} aria-label={social.label} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-amber-400 hover:text-slate-900">
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
