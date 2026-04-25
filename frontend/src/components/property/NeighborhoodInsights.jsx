import { useState } from 'react';
import { GraduationCap, Hospital, Train, ShieldCheck, Wind, Star, MapPin } from 'lucide-react';

const getAqiColor = (aqi) => {
  if (aqi <= 50) return { bg: 'bg-emerald-500', text: 'text-emerald-600' };
  if (aqi <= 100) return { bg: 'bg-amber-500', text: 'text-amber-600' };
  if (aqi <= 150) return { bg: 'bg-orange-500', text: 'text-orange-600' };
  return { bg: 'bg-red-500', text: 'text-red-600' };
};

const TABS = [
  { key: 'schools', label: 'Schools', Icon: GraduationCap, listKey: 'schools', iconBg: 'bg-amber-100', iconFg: 'text-amber-600' },
  { key: 'hospitals', label: 'Hospitals', Icon: Hospital, listKey: 'hospitals', iconBg: 'bg-red-100', iconFg: 'text-red-600' },
  { key: 'transport', label: 'Transport', Icon: Train, listKey: 'transport', iconBg: 'bg-blue-100', iconFg: 'text-blue-600' },
];

export function NeighborhoodInsights({ neighborhood }) {
  const [active, setActive] = useState('schools');
  const aqiColor = getAqiColor(neighborhood.aqi);
  const activeTab = TABS.find((t) => t.key === active);
  const items = neighborhood[activeTab.listKey] || [];

  return (
    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
          <MapPin className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Neighborhood Insights</h2>
          <p className="text-sm text-muted-foreground">What&apos;s around this property</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Safety Index</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl font-bold text-blue-600">{neighborhood.safetyScore}</span>
            <span className="text-sm text-blue-600">/100</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-200 text-blue-700 ml-2">
              {neighborhood.safetyScore >= 80 ? 'Very Safe' : 'Safe'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
          <div className="flex items-center gap-2 mb-2">
            <Wind className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">Air Quality</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-2xl font-bold ${aqiColor.text}`}>{neighborhood.aqi}</span>
            <span className="text-sm text-emerald-600">AQI</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${aqiColor.bg} text-white ml-2`}>
              {neighborhood.aqiLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition ${
              active === key ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {items.length === 0 && (
          <div className="rounded-xl bg-slate-50 p-6 text-center text-sm text-muted-foreground">
            No nearby {activeTab.label.toLowerCase()} listed for this property.
          </div>
        )}
        {items.map((item, index) => (
          <div
            key={`${activeTab.key}-${index}`}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-10 h-10 rounded-lg ${activeTab.iconBg} flex items-center justify-center flex-shrink-0`}>
                <activeTab.Icon className={`w-5 h-5 ${activeTab.iconFg}`} />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground truncate">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.distance} away</p>
              </div>
            </div>
            {active === 'transport' ? (
              <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium flex-shrink-0">
                {item.type || 'Transit'}
              </span>
            ) : (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100 flex-shrink-0">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-medium text-amber-700">{Number(item.rating).toFixed(1)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
