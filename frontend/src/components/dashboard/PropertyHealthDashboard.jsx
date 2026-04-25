import {
  ClipboardCheck,
  Zap,
  Wind,
  Bug,
  Shield,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

const healthSignals = [
  {
    id: 'inspection',
    title: 'Last Inspection',
    Icon: ClipboardCheck,
    status: 'green',
    value: 'Passed',
    subtitle: 'All 12 checkpoints clear',
    lastUpdated: 'Apr 10, 2024',
    nextDue: 'Jul 10, 2024',
  },
  {
    id: 'utilities',
    title: 'Utility Bills',
    Icon: Zap,
    status: 'amber',
    value: '₹4,250',
    subtitle: 'Electricity pending',
    lastUpdated: 'Due: Apr 25',
    nextDue: '3 days left',
  },
  {
    id: 'ac-service',
    title: 'AC/Geyser Service',
    Icon: Wind,
    status: 'amber',
    value: 'Due Soon',
    subtitle: 'AC service recommended',
    lastUpdated: 'Last: Nov 2023',
    nextDue: 'Overdue by 15 days',
  },
  {
    id: 'pest-control',
    title: 'Pest Control',
    Icon: Bug,
    status: 'green',
    value: 'Completed',
    subtitle: 'Quarterly treatment done',
    lastUpdated: 'Mar 15, 2024',
    nextDue: 'Jun 15, 2024',
  },
  {
    id: 'insurance',
    title: 'Property Insurance',
    Icon: Shield,
    status: 'red',
    value: 'Expiring',
    subtitle: 'HDFC Ergo Home Insurance',
    lastUpdated: 'Expires: May 1, 2024',
    nextDue: '6 days left',
  },
];

const statusConfig = {
  green: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    Icon: CheckCircle,
    label: 'Good',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    Icon: Clock,
    label: 'Attention',
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/30',
    Icon: AlertTriangle,
    label: 'Action Required',
  },
};

export function PropertyHealthDashboard() {
  const healthScore = Math.round(
    (healthSignals.filter((s) => s.status === 'green').length / healthSignals.length) * 100,
  );
  const scoreColor =
    healthScore >= 80 ? 'text-emerald-400' : healthScore >= 60 ? 'text-amber-400' : 'text-red-400';
  const scoreBg =
    healthScore >= 80 ? 'bg-emerald-500/20' : healthScore >= 60 ? 'bg-amber-500/20' : 'bg-red-500/20';
  const ScoreIcon = healthScore >= 80 ? CheckCircle : healthScore >= 60 ? Clock : AlertTriangle;
  const scoreIconColor = healthScore >= 80 ? 'text-emerald-400' : healthScore >= 60 ? 'text-amber-400' : 'text-red-400';

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Property Health Dashboard</h1>
          <p className="text-slate-400">Monitor all maintenance signals at a glance</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-slate-400">Overall Health Score</p>
            <p className={`text-4xl font-bold ${scoreColor}`}>{healthScore}%</p>
          </div>
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${scoreBg}`}>
            <ScoreIcon className={`w-8 h-8 ${scoreIconColor}`} />
          </div>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {['green', 'amber', 'red'].map((status) => {
          const count = healthSignals.filter((s) => s.status === status).length;
          const c = statusConfig[status];
          const StatusIcon = c.Icon;
          return (
            <div
              key={status}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border ${c.bg} ${c.border}`}
            >
              <StatusIcon className={`w-4 h-4 ${c.text}`} />
              <span className={`text-sm font-medium ${c.text}`}>
                {count} {status === 'green' ? 'Healthy' : status === 'amber' ? 'Attention' : 'Critical'}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthSignals.map((signal) => {
          const c = statusConfig[signal.status];
          const StatusIcon = c.Icon;
          const Icon = signal.Icon;
          return (
            <div
              key={signal.id}
              className={`rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all p-5 ${
                signal.status === 'red' ? 'border-red-500/30 hover:border-red-500/50' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg}`}>
                  <Icon className={`w-5 h-5 ${c.text}`} />
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {c.label}
                </span>
              </div>
              <h3 className="text-sm text-slate-400 mb-1">{signal.title}</h3>
              <p className="text-xl font-bold text-white mb-1">{signal.value}</p>
              <p className="text-sm text-slate-500 mb-3">{signal.subtitle}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{signal.lastUpdated}</span>
                {signal.nextDue && (
                  <span
                    className={`font-medium ${
                      signal.status === 'red'
                        ? 'text-red-400'
                        : signal.status === 'amber'
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {signal.nextDue}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30 p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">2 items need attention</h3>
              <p className="text-sm text-slate-400">Insurance renewal and AC service are due</p>
            </div>
          </div>
          <button
            type="button"
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all"
          >
            Schedule Now
          </button>
        </div>
      </div>
    </div>
  );
}
