import { Sparkles, Bell, Home, Wrench, Shield, ArrowRight, Receipt } from 'lucide-react';

const upcomingFeatures = [
  {
    id: 'tenants',
    title: 'Tenant Management',
    description:
      'Complete tenant lifecycle management with rent receipts, lease tracking, screened-tenant cards, and payment history.',
    Icon: Home,
    features: [
      'Rent receipt generation & tracking',
      'Lease expiry reminders',
      'Tenant background verification',
      'Payment score & history',
      'Document storage per tenant',
    ],
    eta: 'Q3 2026',
  },
  {
    id: 'society-dues',
    title: 'Society Dues Tracker',
    description:
      'Track and manage RWA bills, maintenance charges, and society payments with auto-sync and auto-pay features.',
    Icon: Receipt,
    features: [
      'RWA bill auto-sync',
      'Monthly dues breakdown',
      'Payment history & receipts',
      'Auto-pay setup',
      'Pending dues alerts',
    ],
    eta: 'Q3 2026',
  },
  {
    id: 'vendors',
    title: 'Vendor Marketplace',
    description:
      'Verified caretaker and vendor network with booking, payments, and before/after photo documentation.',
    Icon: Wrench,
    features: [
      'Verified plumbers, electricians, cleaners',
      'Slot booking system',
      'Before/after photo documentation',
      'In-platform payments',
      'Service history & ratings',
    ],
    eta: 'Q3 2026',
  },
  {
    id: 'security',
    title: 'Smart Security Integration',
    description: 'Connect with smart locks, CCTV, and security systems for real-time property monitoring.',
    Icon: Shield,
    features: [
      'Smart lock management',
      'CCTV feed access',
      'Motion alerts',
      'Visitor management',
      'Emergency contacts',
    ],
    eta: 'Q4 2026',
  },
];

export function ComingSoon() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-amber-400">Coming Soon</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Exciting features on the way</h1>
        <p className="text-slate-400">
          We&apos;re building powerful new tools to make property management even easier. Get notified when these
          features launch.
        </p>
      </div>

      <div className="grid gap-6">
        {upcomingFeatures.map((feature) => {
          const Icon = feature.Icon;
          return (
            <div key={feature.id} className="rounded-xl bg-slate-800/50 border border-slate-700/50 overflow-hidden p-5">
              <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 flex items-center justify-center border border-amber-500/30 flex-shrink-0">
                    <Icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-semibold mb-1">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </div>
                </div>
                <span className="inline-flex rounded-full px-3 py-1 text-xs font-medium border border-amber-500/30 text-amber-400 bg-amber-500/10">
                  {feature.eta}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {feature.features.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/30 border border-slate-600/30"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30 p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
              <p className="text-sm text-slate-400">Get notified when new features launch</p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-semibold px-4 py-2.5 shadow-lg shadow-amber-500/30 transition-all"
          >
            <Bell className="w-4 h-4" />
            Notify Me
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-slate-500 text-sm">
          Have a feature request?{' '}
          <button type="button" className="text-amber-400 hover:text-amber-300 underline underline-offset-2">
            Let us know
          </button>
        </p>
      </div>
    </div>
  );
}
