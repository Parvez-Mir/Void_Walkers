import { useState } from 'react';
import {
  Droplets,
  Zap,
  Wrench,
  Shield,
  Bug,
  Filter,
  Camera,
  MessageSquare,
} from 'lucide-react';

const incidents = [
  {
    id: '1',
    Icon: Droplets,
    title: 'Water Leak Resolved',
    description: 'Minor leak detected in bathroom sink pipe. Plumber fixed the worn washer.',
    date: 'Apr 18, 2024',
    time: '2:30 PM',
    severity: 'resolved',
    hasPhoto: true,
    photoUrl: '/images/ahmedabad-property-1.jpg',
    resolution: 'Washer replaced, pipe sealed. No water damage.',
    vendor: 'QuickFix Plumbers',
    cost: '₹450',
  },
  {
    id: '2',
    Icon: Zap,
    title: 'Circuit Breaker Trip',
    description: 'Main circuit breaker tripping frequently in kitchen area.',
    date: 'Apr 15, 2024',
    time: '10:15 AM',
    severity: 'moderate',
    hasPhoto: false,
    resolution: 'Electrician scheduled for Apr 22',
  },
  {
    id: '3',
    Icon: Wrench,
    title: 'AC Not Cooling',
    description: 'Split AC in master bedroom not cooling effectively. Possible gas leak or filter issue.',
    date: 'Apr 12, 2024',
    time: '6:45 PM',
    severity: 'low',
    hasPhoto: false,
  },
  {
    id: '4',
    Icon: Shield,
    title: 'Door Lock Malfunction',
    description: 'Main door smart lock battery low and intermittent connectivity issues.',
    date: 'Apr 8, 2024',
    time: '9:00 AM',
    severity: 'critical',
    hasPhoto: false,
  },
  {
    id: '5',
    Icon: Bug,
    title: 'Pest Control Completed',
    description: 'Quarterly pest control treatment completed successfully.',
    date: 'Mar 15, 2024',
    time: '11:00 AM',
    severity: 'resolved',
    hasPhoto: true,
    photoUrl: '/images/ahmedabad-property-2.jpg',
    resolution: 'Full treatment done. Next scheduled for Jun 15.',
    vendor: 'PestFree Services',
    cost: '₹1,200',
  },
];

const severityConfig = {
  critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', label: 'Critical', dot: 'bg-red-500' },
  moderate: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Moderate', dot: 'bg-amber-500' },
  low: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Low', dot: 'bg-blue-500' },
  resolved: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Resolved', dot: 'bg-emerald-500' },
};

const FILTERS = ['all', 'critical', 'moderate', 'low', 'resolved'];

export function IncidentTimeline() {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState('1');

  const filtered = filter === 'all' ? incidents : incidents.filter((i) => i.severity === filter);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Incident Timeline</h1>
        <p className="text-slate-400">Chronological feed of all property events and incidents</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-slate-400 mr-2" />
        {FILTERS.map((sev) => {
          const isActive = filter === sev;
          const c = severityConfig[sev];
          const cls = !isActive
            ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white'
            : sev === 'all'
            ? 'bg-white text-slate-900'
            : `${c.bg} ${c.text} border ${c.border}`;
          return (
            <button
              key={sev}
              type="button"
              onClick={() => setFilter(sev)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${cls}`}
            >
              {sev === 'all' ? 'All' : c.label}
              {sev !== 'all' && (
                <span className="ml-2 text-xs opacity-70">
                  ({incidents.filter((i) => i.severity === sev).length})
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-700/50" />

        <div className="space-y-4">
          {filtered.map((incident) => {
            const Icon = incident.Icon;
            const c = severityConfig[incident.severity];
            const isExpanded = expandedId === incident.id;
            return (
              <div key={incident.id} className="relative pl-16">
                <div className={`absolute left-4 top-6 w-5 h-5 rounded-full border-4 border-slate-900 ${c.dot}`} />
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : incident.id)}
                  className={`block w-full text-left rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all p-4 ${
                    isExpanded ? c.border : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.bg}`}>
                      <Icon className={`w-5 h-5 ${c.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <h3 className="text-lg font-semibold text-white">{incident.title}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {incident.hasPhoto && (
                            <span className="w-6 h-6 rounded bg-slate-700 flex items-center justify-center">
                              <Camera className="w-3 h-3 text-slate-400" />
                            </span>
                          )}
                          <span className={`inline-flex rounded-full px-3 py-0.5 text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
                            {c.label}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{incident.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{incident.date}</span>
                        <span>{incident.time}</span>
                      </div>

                      {isExpanded && incident.severity === 'resolved' && (
                        <div className="mt-4 pt-4 border-t border-slate-700/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {incident.hasPhoto && incident.photoUrl && (
                              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-700">
                                <img
                                  src={incident.photoUrl}
                                  alt="Incident"
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-xs text-white">
                                  After repair
                                </div>
                              </div>
                            )}
                            <div className="space-y-3">
                              {incident.resolution && (
                                <div>
                                  <p className="text-xs text-slate-500 mb-1">Resolution</p>
                                  <p className="text-sm text-white">{incident.resolution}</p>
                                </div>
                              )}
                              {incident.vendor && (
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-xs text-slate-500 mb-1">Vendor</p>
                                    <p className="text-sm text-white">{incident.vendor}</p>
                                  </div>
                                  {incident.cost && (
                                    <div className="text-right">
                                      <p className="text-xs text-slate-500 mb-1">Cost</p>
                                      <p className="text-sm font-semibold text-amber-400">{incident.cost}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {isExpanded && incident.severity !== 'resolved' && (
                        <div className="mt-4 pt-4 border-t border-slate-700/50 flex gap-2">
                          <span className="inline-flex items-center gap-2 rounded-md bg-amber-500 hover:bg-amber-600 text-slate-900 px-3 py-2 text-sm font-medium">
                            <Wrench className="w-4 h-4" />
                            Book Vendor
                          </span>
                          <span className="inline-flex items-center gap-2 rounded-md border border-slate-600 text-slate-300 px-3 py-2 text-sm font-medium">
                            <MessageSquare className="w-4 h-4" />
                            Add Note
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
