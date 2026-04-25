import { Sparkles, TrendingUp, AlertTriangle, Home, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';

const recStyleFor = (rec) => {
  switch (rec) {
    case 'Strong Buy':
    case 'Buy':
      return { bg: 'from-emerald-400 to-emerald-600', light: 'bg-emerald-50' };
    case 'Hold':
      return { bg: 'from-amber-400 to-amber-600', light: 'bg-amber-50' };
    case 'Avoid':
      return { bg: 'from-red-400 to-red-600', light: 'bg-red-50' };
    default:
      return { bg: 'from-slate-400 to-slate-600', light: 'bg-slate-50' };
  }
};

const riskStyleFor = (risk) => {
  switch (risk) {
    case 'Low':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
    case 'Medium':
      return { bg: 'bg-amber-100', text: 'text-amber-700' };
    case 'High':
      return { bg: 'bg-red-100', text: 'text-red-700' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700' };
  }
};

export function AIInsightsSummary({ insights }) {
  const recStyle = recStyleFor(insights.recommendation);
  const riskStyle = riskStyleFor(insights.riskLevel);

  return (
    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-lg overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-purple-400/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex items-center gap-3 mb-6 relative">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">AI Insights Summary</h2>
          <p className="text-sm text-muted-foreground">Powered by PropSight Intelligence</p>
        </div>
      </div>

      <div className={`p-6 rounded-2xl ${recStyle.light} border border-slate-200 mb-6 relative`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Investment Recommendation</p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${recStyle.bg} bg-clip-text text-transparent`}>
                {insights.recommendation}
              </span>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white shadow-sm">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-foreground">
                  {insights.confidenceScore}% confidence
                </span>
              </div>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-xl ${riskStyle.bg}`}>
            <p className="text-xs text-muted-foreground">Risk Level</p>
            <p className={`text-lg font-bold ${riskStyle.text}`}>{insights.riskLevel}</p>
          </div>
        </div>
        {insights.summary && (
          <p className="text-sm text-slate-600 mt-4 leading-relaxed">{insights.summary}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Home className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-muted-foreground">Rental Potential</span>
          </div>
          <p className="text-xl font-bold text-foreground">{insights.rentalPotential}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-muted-foreground">Expected ROI</span>
          </div>
          <p className="text-xl font-bold text-foreground">{insights.expectedROI}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-foreground">Key Highlights</h3>
          </div>
          <div className="space-y-2">
            {insights.highlights.map((highlight, index) => (
              <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                <p className="text-sm text-emerald-800">{highlight}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-foreground">Points to Consider</h3>
          </div>
          <div className="space-y-2">
            {insights.concerns.map((concern, index) => (
              <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800">{concern}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-3 rounded-lg bg-slate-100 border border-slate-200">
        <p className="text-xs text-muted-foreground text-center">
          AI-generated analysis based on available data. Conduct your own due diligence before making investment decisions.
        </p>
      </div>
    </div>
  );
}
