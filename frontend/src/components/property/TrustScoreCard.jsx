import { Shield, Lock, Trees, TrendingUp, Info } from 'lucide-react';

const getScoreColor = (score) => {
  if (score >= 80) return { bg: 'bg-emerald-500', text: 'text-emerald-600' };
  if (score >= 60) return { bg: 'bg-amber-500', text: 'text-amber-600' };
  return { bg: 'bg-red-500', text: 'text-red-600' };
};

const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  return 'Average';
};

const scoreCategories = [
  {
    key: 'safety',
    label: 'Safety Score',
    Icon: Lock,
    description: 'Crime rates, police proximity, area safety history',
    gradient: 'from-blue-400 to-blue-600',
  },
  {
    key: 'infrastructure',
    label: 'Infrastructure Score',
    Icon: Shield,
    description: 'Roads, utilities, water, civic amenities',
    gradient: 'from-purple-400 to-purple-600',
  },
  {
    key: 'environment',
    label: 'Environment Score',
    Icon: Trees,
    description: 'Air quality, green cover, noise, pollution',
    gradient: 'from-emerald-400 to-emerald-600',
  },
  {
    key: 'investment',
    label: 'Investment Score',
    Icon: TrendingUp,
    description: 'Appreciation potential, rental yield, demand',
    gradient: 'from-amber-400 to-amber-600',
  },
];

export function TrustScoreCard({ scores }) {
  const overallColor = getScoreColor(scores.overall);

  return (
    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">PropSight Trust Score</h2>
            <p className="text-sm text-muted-foreground">AI-powered property analysis</p>
          </div>
        </div>
        <span title="Calculated using verified data from government records, satellite imagery, and real-time monitoring.">
          <Info className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-help" />
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-8 mb-8 p-6 rounded-2xl bg-slate-50">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${(scores.overall / 100) * 283} 283`}
              strokeLinecap="round"
              className={overallColor.text}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${overallColor.text}`}>{scores.overall}</span>
            <span className="text-xs text-muted-foreground">out of 100</span>
          </div>
        </div>
        <div>
          <p className={`text-2xl font-bold ${overallColor.text} mb-1`}>{getScoreLabel(scores.overall)}</p>
          <p className="text-muted-foreground text-sm max-w-xs">
            This property scores {scores.overall >= 80 ? 'above average' : 'in line with peers'} on
            {' '}safety and investment fundamentals — a {scores.overall >= 80 ? 'solid choice' : 'considered option'} for buyers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scoreCategories.map(({ key, label, Icon, description, gradient }) => {
          const score = Number(scores[key]) || 0;
          const color = getScoreColor(score);
          return (
            <div key={key} className="p-4 rounded-xl border border-border hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${color.bg} transition-all duration-1000`} style={{ width: `${score}%` }} />
                </div>
                <span className={`font-bold ${color.text}`}>{score}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
