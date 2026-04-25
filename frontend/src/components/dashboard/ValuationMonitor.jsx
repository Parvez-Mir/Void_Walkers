import {
  TrendingUp,
  IndianRupee,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  BarChart3,
} from 'lucide-react';

const valuationHistory = [
  { month: 'Jan 23', value: 82, marketAvg: 80 },
  { month: 'Apr 23', value: 84, marketAvg: 81 },
  { month: 'Jul 23', value: 86, marketAvg: 83 },
  { month: 'Oct 23', value: 89, marketAvg: 85 },
  { month: 'Jan 24', value: 94, marketAvg: 88 },
  { month: 'Apr 24', value: 97, marketAvg: 90 },
];

const comparables = [
  { name: 'Satyam Skyline A-1105', price: 95, sqft: 1650, pricePerSqft: 5757, trend: 'up' },
  { name: 'Satyam Skyline B-804', price: 88, sqft: 1580, pricePerSqft: 5569, trend: 'up' },
  { name: 'Green Meadows 402', price: 78, sqft: 1520, pricePerSqft: 5131, trend: 'down' },
  { name: 'Paradise Heights 1201', price: 105, sqft: 1780, pricePerSqft: 5898, trend: 'up' },
];

// Inline SVG dual-area chart — no recharts needed.
function ValuationChart({ data }) {
  if (!data || data.length < 2) {
    return <div className="h-64 flex items-center justify-center text-slate-500 text-sm">Not enough data.</div>;
  }
  const W = 600;
  const H = 240;
  const PAD_L = 48;
  const PAD_R = 16;
  const PAD_T = 16;
  const PAD_B = 32;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const all = data.flatMap((d) => [d.value, d.marketAvg]);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const range = Math.max(1, max - min);

  const xFor = (i) => PAD_L + (i / (data.length - 1)) * innerW;
  const yFor = (v) => PAD_T + innerH - ((v - min) / range) * innerH;

  const buildPath = (key) => data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(d[key])}`).join(' ');
  const buildArea = (key) =>
    `${buildPath(key)} L ${xFor(data.length - 1)} ${PAD_T + innerH} L ${PAD_L} ${PAD_T + innerH} Z`;

  const yTicks = Array.from({ length: 4 }, (_, i) => Math.round(min + (range * i) / 3));

  return (
    <div className="h-64 w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
        <defs>
          <linearGradient id="valFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="mktFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#64748b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#64748b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicks.map((tick, i) => {
          const y = yFor(tick);
          return (
            <g key={i}>
              <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#334155" strokeDasharray="3 3" />
              <text x={PAD_L - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">
                ₹{tick}L
              </text>
            </g>
          );
        })}

        {data.map((d, i) => (
          <text key={i} x={xFor(i)} y={H - 10} textAnchor="middle" fontSize="10" fill="#64748b">
            {d.month}
          </text>
        ))}

        <path d={buildArea('marketAvg')} fill="url(#mktFill)" />
        <path d={buildPath('marketAvg')} fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5 5" />
        <path d={buildArea('value')} fill="url(#valFill)" />
        <path d={buildPath('value')} fill="none" stroke="#f59e0b" strokeWidth="2.5" />

        {data.map((d, i) => (
          <circle key={`v-${i}`} cx={xFor(i)} cy={yFor(d.value)} r="3" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.5" />
        ))}
      </svg>
    </div>
  );
}

export function ValuationMonitor() {
  const currentValue = 97;
  const purchaseValue = 82;
  const appreciationPercent = Math.round(((currentValue - purchaseValue) / purchaseValue) * 100);
  const appreciationAmount = currentValue - purchaseValue;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Valuation Monitor</h1>
        <p className="text-slate-400">Track your property&apos;s market value and investment performance</p>
      </div>

      <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 via-slate-800/50 to-amber-500/10 border border-emerald-500/30 p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-slate-400 mb-2">Current Market Value</p>
            <div className="flex items-baseline gap-2 mb-2 flex-wrap">
              <span className="text-5xl font-bold text-white inline-flex items-baseline">
                <IndianRupee className="w-10 h-10" />
                {currentValue}L
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-xs font-medium">
                <ArrowUpRight className="w-3 h-3" />
                +{appreciationPercent}%
              </span>
            </div>
            <p className="text-sm text-slate-400 inline-flex items-center gap-1">
              <IndianRupee className="w-3 h-3" />
              {appreciationAmount}L appreciation since purchase
            </p>
          </div>
          <div className="text-right space-y-4">
            <div>
              <p className="text-xs text-slate-500">Purchase Price (Jan 2023)</p>
              <p className="text-lg font-semibold text-white inline-flex items-center">
                <IndianRupee className="w-4 h-4" />
                {purchaseValue}L
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Price per Sq.ft</p>
              <p className="text-lg font-semibold text-amber-400 inline-flex items-center">
                <IndianRupee className="w-4 h-4" />
                5,878
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30 p-5">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-7 h-7 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="text-xl font-bold text-white">AI Verdict: Hold</h3>
              <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Insights AI
              </span>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Based on current market trends, upcoming metro connectivity (Q3 2025), and area development, we recommend{' '}
              <strong className="text-white">holding the property</strong>. Expected value in 12 months:{' '}
              <span className="text-emerald-400 font-semibold">₹1.08–1.12 Cr</span> (+11–15%).
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-300">Strong rental demand</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-slate-300">Metro in 18 months</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-slate-300">Market cooling expected in Q4</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-5">
        <h3 className="text-lg text-white flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-amber-400" />
          Value Trend vs Market Average
        </h3>
        <ValuationChart data={valuationHistory} />
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-sm text-slate-400">Your Property</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-500" />
            <span className="text-sm text-slate-400">Market Average</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-5">
        <h3 className="text-lg text-white flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-amber-400" />
          Nearby Comparables
        </h3>
        <div className="space-y-3">
          {comparables.map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors flex-wrap gap-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-5 h-5 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.sqft} sq.ft</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-semibold text-white inline-flex items-center">
                    <IndianRupee className="w-3 h-3" />
                    {p.price}L
                  </p>
                  <p className="text-xs text-slate-400 inline-flex items-center">
                    <IndianRupee className="w-2 h-2" />
                    {p.pricePerSqft.toLocaleString('en-IN')}/sqft
                  </p>
                </div>
                {p.trend === 'up' ? (
                  <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-red-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'YoY Growth', value: '+12.3%', Icon: TrendingUp, bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
          { label: 'Rental Yield', value: '3.8%', Icon: Target, bg: 'bg-blue-500/10', text: 'text-blue-400' },
          { label: 'Avg. Days to Sell', value: '45 days', Icon: Clock, bg: 'bg-amber-500/10', text: 'text-amber-400' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg}`}>
                <stat.Icon className={`w-5 h-5 ${stat.text}`} />
              </div>
              <div>
                <p className="text-xs text-slate-400">{stat.label}</p>
                <p className={`text-xl font-bold ${stat.text}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
