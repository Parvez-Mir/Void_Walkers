import { useState } from 'react';
import {
  Calendar,
  Receipt,
  Percent,
  TrendingUp,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Bell,
} from 'lucide-react';

const complianceItems = [
  {
    id: '1',
    type: 'property-tax',
    title: 'Property Tax Q1 2024-25',
    description: 'Ahmedabad Municipal Corporation',
    dueDate: 'Jun 30, 2024',
    amount: '₹12,500',
    status: 'upcoming',
    nriSpecific: false,
    actionRequired: 'Pay before due date to avoid penalty',
  },
  {
    id: '2',
    type: 'tds',
    title: 'TDS on Rent (Q4)',
    description: '30% TDS applicable for NRI landlords',
    dueDate: 'Apr 30, 2024',
    amount: '₹18,000',
    status: 'pending',
    nriSpecific: true,
    actionRequired: 'TDS deposit due within 7 days',
  },
  {
    id: '3',
    type: 'capital-gains',
    title: 'Capital Gains Tax Planning',
    description: 'Property purchased in 2019 — 5 year holding complete',
    dueDate: 'Mar 31, 2025',
    amount: 'Potential LTCG applicable',
    status: 'upcoming',
    nriSpecific: true,
    actionRequired: 'Consult CA for tax-saving strategies',
  },
  {
    id: '4',
    type: 'fema',
    title: 'FEMA Repatriation Window',
    description: 'Annual repatriation limit: $1M',
    dueDate: 'Dec 31, 2024',
    amount: '₹0 / ₹83L repatriated',
    status: 'upcoming',
    nriSpecific: true,
    actionRequired: 'Plan rental income repatriation',
  },
  {
    id: '5',
    type: 'property-tax',
    title: 'Property Tax 2023-24',
    description: 'Annual payment completed',
    dueDate: 'Mar 31, 2024',
    amount: '₹48,000',
    status: 'completed',
    nriSpecific: false,
  },
  {
    id: '6',
    type: 'tds',
    title: 'TDS on Rent (Q3)',
    description: 'Form 15CA/CB filed',
    dueDate: 'Jan 31, 2024',
    amount: '₹18,000',
    status: 'completed',
    nriSpecific: true,
  },
];

const typeConfig = {
  'property-tax': { Icon: Receipt, label: 'Property Tax', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  tds: { Icon: Percent, label: 'TDS on Rent', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  'capital-gains': { Icon: TrendingUp, label: 'Capital Gains', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  fema: { Icon: Globe, label: 'FEMA Compliance', color: 'text-purple-400', bg: 'bg-purple-500/10' },
};

const statusConfig = {
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', Icon: Clock, label: 'Action Required' },
  upcoming: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', Icon: Calendar, label: 'Upcoming' },
  completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', Icon: CheckCircle, label: 'Completed' },
  overdue: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', Icon: AlertTriangle, label: 'Overdue' },
};

const FILTERS = ['all', 'pending', 'upcoming', 'completed'];

export function ComplianceCalendar() {
  const [filter, setFilter] = useState('all');
  const pending = complianceItems.filter((i) => i.status === 'pending' || i.status === 'overdue');
  const upcoming = complianceItems.filter((i) => i.status === 'upcoming');
  const completed = complianceItems.filter((i) => i.status === 'completed');

  const filtered = filter === 'all' ? complianceItems : complianceItems.filter((i) => i.status === filter);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Tax & Compliance Calendar</h1>
        <p className="text-slate-400">Track all tax obligations and compliance deadlines</p>
      </div>

      <div className="rounded-xl bg-gradient-to-r from-purple-500/10 to-amber-500/10 border border-purple-500/30 p-5">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Globe className="w-6 h-6 text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-lg font-semibold text-white">NRI Tax Tracker</h3>
              <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900">
                NRI Gold Feature
              </span>
            </div>
            <p className="text-sm text-slate-300">
              Automatic TDS tracking, FEMA repatriation limits, and capital gains calculator for NRI property owners
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-3 py-2 text-sm font-medium transition"
          >
            <FileText className="w-4 h-4" />
            Generate Tax Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: 'Action Required',
            count: pending.length,
            Icon: Clock,
            border: 'border-amber-500/30',
            text: 'text-amber-400',
            bg: 'bg-amber-500/10',
          },
          {
            label: 'Upcoming',
            count: upcoming.length,
            Icon: Calendar,
            border: 'border-blue-500/30',
            text: 'text-blue-400',
            bg: 'bg-blue-500/10',
          },
          {
            label: 'Completed (YTD)',
            count: completed.length,
            Icon: CheckCircle,
            border: 'border-emerald-500/30',
            text: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl bg-slate-800/50 border ${stat.border} p-4 flex items-center justify-between`}
          >
            <div>
              <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.text}`}>{stat.count}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
              <stat.Icon className={`w-6 h-6 ${stat.text}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              filter === f
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((item) => {
          const t = typeConfig[item.type];
          const s = statusConfig[item.status];
          const TypeIcon = t.Icon;
          const StatusIcon = s.Icon;
          const cardBorder =
            item.status === 'pending'
              ? 'border-amber-500/30'
              : item.status === 'overdue'
              ? 'border-red-500/30'
              : 'border-slate-700/50';
          return (
            <div
              key={item.id}
              className={`rounded-xl bg-slate-800/50 border ${cardBorder} hover:border-slate-600 transition-all p-4`}
            >
              <div className="flex items-center gap-4 flex-wrap">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${t.bg}`}>
                  <TypeIcon className={`w-6 h-6 ${t.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    {item.nriSpecific && (
                      <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/30">
                        NRI Specific
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mb-1">{item.description}</p>
                  {item.actionRequired && <p className="text-xs text-amber-400">{item.actionRequired}</p>}
                </div>
                {item.amount && (
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{item.amount}</p>
                    <p className="text-xs text-slate-500">Due: {item.dueDate}</p>
                  </div>
                )}
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}
                >
                  <StatusIcon className="w-3 h-3" />
                  {s.label}
                </span>
                {item.status !== 'completed' && (
                  <button
                    type="button"
                    className="inline-flex rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 px-3 py-1.5 text-sm font-medium"
                  >
                    {item.type === 'property-tax' || item.type === 'tds' ? 'Pay Now' : 'View Details'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
          <Bell className="w-5 h-5 text-amber-400" />
          Reminder Settings
        </h3>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-white">Email reminders enabled</p>
            <p className="text-xs text-slate-400">
              You&apos;ll receive reminders 30, 15, and 7 days before each deadline
            </p>
          </div>
          <button
            type="button"
            className="inline-flex rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700/50 px-3 py-2 text-sm font-medium transition"
          >
            Configure
          </button>
        </div>
      </div>
    </div>
  );
}
