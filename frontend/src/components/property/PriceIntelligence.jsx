import { TrendingUp, TrendingDown, BarChart3, ArrowUp, ArrowDown, Minus } from 'lucide-react';

// Inline SVG line chart — keeps us free of recharts/chart.js wrappers.
function LineChart({ data }) {
  if (!data || data.length < 2) {
    return (
      <div className="h-64 w-full flex items-center justify-center text-sm text-muted-foreground">
        Not enough price history to chart.
      </div>
    );
  }

  const W = 600;
  const H = 220;
  const PAD_L = 48;
  const PAD_R = 16;
  const PAD_T = 16;
  const PAD_B = 32;

  const prices = data.map((d) => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = Math.max(1, max - min);
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;

  const xFor = (i) => PAD_L + (i / (data.length - 1)) * innerW;
  const yFor = (price) => PAD_T + innerH - ((price - min) / range) * innerH;

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(d.price)}`).join(' ');
  const areaPath = `${linePath} L ${xFor(data.length - 1)} ${PAD_T + innerH} L ${PAD_L} ${PAD_T + innerH} Z`;

  // Y-axis ticks (4 evenly spaced)
  const yTicks = Array.from({ length: 4 }, (_, i) => Math.round(min + (range * i) / 3));

  return (
    <div className="h-64 w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
        <defs>
          <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid + Y labels */}
        {yTicks.map((tick, i) => {
          const y = yFor(tick);
          return (
            <g key={i}>
              <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x={PAD_L - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">
                ₹{tick.toLocaleString('en-IN')}
              </text>
            </g>
          );
        })}

        {/* X labels (first, mid, last) */}
        {[0, Math.floor(data.length / 2), data.length - 1].map((idx) => (
          <text key={idx} x={xFor(idx)} y={H - 10} textAnchor="middle" fontSize="10" fill="#64748b">
            {data[idx].month}
          </text>
        ))}

        {/* Area + line */}
        <path d={areaPath} fill="url(#priceFill)" />
        <path d={linePath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {/* Points */}
        {data.map((d, i) => (
          <circle key={i} cx={xFor(i)} cy={yFor(d.price)} r="3.5" fill="#f59e0b" stroke="white" strokeWidth="1.5" />
        ))}
      </svg>
    </div>
  );
}

const getDiffStyle = (diff) => {
  if (diff.startsWith('+')) return { Icon: ArrowUp, cls: 'text-red-600 bg-red-50' };
  if (diff.startsWith('-')) return { Icon: ArrowDown, cls: 'text-emerald-600 bg-emerald-50' };
  return { Icon: Minus, cls: 'text-slate-600 bg-slate-50' };
};

export function PriceIntelligence({ priceHistory, comparables, currentPrice, yoyChange }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Price Intelligence</h2>
          <p className="text-sm text-muted-foreground">Historical trends and market comparison</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Price Trend (₹/sqft)</h3>
          {Number.isFinite(yoyChange) && (
            <div className={`flex items-center gap-2 ${yoyChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {yoyChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {yoyChange >= 0 ? '+' : ''}
                {yoyChange.toFixed(1)}% YoY
              </span>
            </div>
          )}
        </div>
        <LineChart data={priceHistory} />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-foreground">Nearby Comparables</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Current property: <span className="font-semibold text-amber-600">{currentPrice}/sqft</span>
        </p>
        {comparables.length === 0 ? (
          <div className="rounded-xl bg-slate-50 p-6 text-center text-sm text-muted-foreground">
            No nearby comparables published yet.
          </div>
        ) : (
          <div className="space-y-3">
            {comparables.map((comp, index) => {
              const { Icon, cls } = getDiffStyle(comp.diff);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{comp.name}</p>
                    {comp.location && <p className="text-sm text-muted-foreground">{comp.location}</p>}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-semibold text-foreground">{comp.price}</span>
                    <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${cls}`}>
                      <Icon className="w-3 h-3" />
                      {comp.diff}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
