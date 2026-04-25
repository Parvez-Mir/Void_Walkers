import { Rocket, Train, Building2, CheckCircle, Clock, Calendar } from 'lucide-react';

const getStatusStyle = (status) => {
  switch (status) {
    case 'Completed':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', Icon: CheckCircle };
    case 'In Progress':
      return { bg: 'bg-blue-100', text: 'text-blue-700', Icon: Clock };
    case 'Approved':
      return { bg: 'bg-amber-100', text: 'text-amber-700', Icon: Calendar };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700', Icon: Clock };
  }
};

const getImpactColor = (impact) => {
  switch (impact) {
    case 'Very High':
      return 'bg-emerald-500';
    case 'High':
      return 'bg-blue-500';
    case 'Medium':
      return 'bg-amber-500';
    default:
      return 'bg-slate-400';
  }
};

const getImpactText = (impact) => {
  if (impact === 'Very High') return 'text-emerald-600';
  if (impact === 'High') return 'text-blue-600';
  return 'text-amber-600';
};

export function FutureGrowthSignals({ futureGrowth }) {
  const { metro, infrastructure } = futureGrowth;

  return (
    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
          <Rocket className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Future Growth Signals</h2>
          <p className="text-sm text-muted-foreground">Upcoming developments that may impact value</p>
        </div>
      </div>

      {metro && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <Train className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-200 text-blue-700 font-medium">
                  Upcoming Connectivity
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">{metro.name}</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-blue-700">
                  <span className="font-medium">{metro.distance}</span> from property
                </span>
                <span className="text-blue-700">
                  Expected: <span className="font-medium">{metro.completion}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-white/80">
            <p className="text-sm text-slate-600">
              <span className="font-medium text-blue-700">Impact Analysis:</span> Direct connectivity catalysts typically lift property values 15–25% within a 1km radius once operational.
            </p>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-rose-600" />
          <h3 className="font-semibold text-foreground">Infrastructure Developments</h3>
        </div>
        {infrastructure.length === 0 ? (
          <div className="rounded-xl bg-slate-50 p-6 text-center text-sm text-muted-foreground">
            No upcoming infrastructure projects mapped to this property.
          </div>
        ) : (
          <div className="space-y-3">
            {infrastructure.map((item, index) => {
              const { bg, text, Icon } = getStatusStyle(item.status);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-10 rounded-full ${getImpactColor(item.impact)} flex-shrink-0`} />
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${bg} ${text}`}>
                          <Icon className="w-3 h-3" />
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs text-muted-foreground">Impact</span>
                    <p className={`font-semibold ${getImpactText(item.impact)}`}>{item.impact}</p>
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
