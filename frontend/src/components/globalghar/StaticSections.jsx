import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Bell, Building2, CheckCircle, Eye, FolderLock, MapPin, Search, Shield, ShieldCheck, Sparkles, TrendingUp, Users } from 'lucide-react';

const stats = [
  { icon: Building2, value: '1,000+', label: 'Properties listed' },
  { icon: MapPin, value: '20+', label: 'Ahmedabad localities' },
  { icon: Users, value: '3,800+', label: 'Remote buyers served' },
  { icon: ShieldCheck, value: '98%', label: 'Data confidence' },
];

const prePurchaseFeatures = [
  { icon: MapPin, title: 'Neighborhood Intelligence', description: 'Locality data including schools, hospitals, connectivity, and livability scores.' },
  { icon: BarChart3, title: 'AI Investment Ranking', description: 'Sort listings by investment potential, connectivity, and livability signals.' },
  { icon: TrendingUp, title: 'Comparable Discovery', description: 'Filter by locality, budget, area, BHK, amenities, and construction status.' },
];

const postPurchaseFeatures = [
  { icon: Shield, title: 'Verified Listing Signals', description: 'Structured seller, legal, RERA, and project metadata on every property detail page.' },
  { icon: FolderLock, title: 'Organized Property Data', description: 'Media, amenities, nearby places, pricing, scores, and highlights in one view.' },
  { icon: Bell, title: 'Search Alerts Ready', description: 'The API-ready flow can power saved searches and buyer alerts next.' },
];

const trustPoints = [
  { icon: Shield, title: 'RERA-aware Metadata', description: 'Listings include legal and RERA fields wherever the backend provides them.' },
  { icon: CheckCircle, title: 'Data-Driven, Not Opinions', description: 'Cards and recommendations use backend scores and structured filters.' },
  { icon: Sparkles, title: 'AI Search Fallback', description: 'Natural language search falls back to token search when no exact filters match.' },
];

export function StatsSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24">
      <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-amber-400/10 blur-[150px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Trusted by buyers across <span className="text-gold-gradient">India and abroad</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">Live search and recommendation flows powered by your property backend.</p>
        </div>
        <div className="grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:border-amber-400/30 hover:bg-white/10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30">
                <stat.icon className="h-7 w-7 text-slate-900" />
              </div>
              <div className="mb-2 text-4xl font-bold text-white md:text-5xl">{stat.value}</div>
              <p className="font-medium text-white/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="relative scroll-mt-24 overflow-hidden bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-sm font-semibold text-slate-700">Complete Property Solution</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Everything you need <span className="text-gold-gradient">before and after</span> buying
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">From intelligent search to structured detail pages, the frontend now follows the backend data model.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {[['Pre-Purchase', prePurchaseFeatures, 'teal'], ['Post-Purchase', postPurchaseFeatures, 'amber']].map(([title, items, color]) => (
            <div key={title} className="space-y-6">
              <div className="mb-8 flex items-center gap-3">
                <div className={`h-8 w-1.5 rounded-full ${color === 'teal' ? 'bg-teal-500' : 'bg-amber-500'}`} />
                <h3 className="text-xl font-bold text-foreground">{title}</h3>
              </div>
              {items.map((feature) => (
                <div key={feature.title} className={`rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${color === 'teal' ? 'border-l-4 border-l-teal-500' : 'border-l-4 border-l-amber-500'}`}>
                  <div className="flex gap-5">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${color === 'teal' ? 'bg-gradient-to-br from-teal-400 to-teal-600' : 'bg-gradient-to-br from-amber-400 to-amber-600'}`}>
                      <feature.icon className={`h-7 w-7 ${color === 'teal' ? 'text-white' : 'text-slate-900'}`} />
                    </div>
                    <div>
                      <h4 className="mb-2 text-lg font-bold text-foreground">{feature.title}</h4>
                      <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { icon: Search, title: 'Search & Analyse', description: 'Use AI search, filters, and recommendation sorts to narrow down matching properties.' },
    { icon: ShieldCheck, title: 'Compare with Confidence', description: 'Review scores, amenities, area, pricing, legal metadata, and nearby places.' },
    { icon: Eye, title: 'Shortlist Remotely', description: 'Open property details and similar listings without needing a broker-first workflow.' },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-24 bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Your end-to-end <span className="text-gold-gradient">property journey</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">The search flow is designed for remote buyers who need clear property data quickly.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-3xl border border-border bg-card p-8 text-center shadow-lg transition hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                <step.icon className="h-10 w-10 text-amber-600" />
              </div>
              <div className="mb-3 text-sm font-bold text-amber-600">0{index + 1}</div>
              <h3 className="mb-3 text-xl font-bold text-foreground">{step.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section id="for-nris" className="relative scroll-mt-24 overflow-hidden bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Built on <span className="text-gold-gradient">transparency</span>, not broker promises
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">Every visible listing signal comes from your backend response, not static marketing data.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {trustPoints.map((point) => (
            <div key={point.title} className="rounded-3xl border border-border bg-card p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
                <point.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-foreground">{point.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-semibold text-amber-400">Start with live search</span>
        </div>
        <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
          Start your property journey <span className="text-gold-gradient">today</span>
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-xl text-white/60">Browse seeded Ahmedabad listings, search with AI, and compare structured property details.</p>
        <Link to="/properties" className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-10 py-5 text-lg font-bold text-slate-900 shadow-2xl shadow-amber-500/30 transition hover:scale-105 hover:from-amber-500 hover:to-amber-600">
          Explore Properties
          <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
