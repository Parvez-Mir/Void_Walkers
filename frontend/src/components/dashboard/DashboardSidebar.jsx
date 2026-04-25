import { useState } from 'react';
import {
  Activity,
  Clock,
  FileText,
  Calendar,
  TrendingUp,
  Building2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const menuGroups = [
  {
    title: 'Maintenance & Health',
    items: [
      { id: 'health', label: 'Property Health', Icon: Activity },
      { id: 'incidents', label: 'Incident Timeline', Icon: Clock },
    ],
  },
  {
    title: 'Obligations',
    badge: 'NRI Gold',
    items: [
      { id: 'documents', label: 'Document Vault', Icon: FileText },
      { id: 'compliance', label: 'Tax & Compliance', Icon: Calendar },
    ],
  },
  {
    title: 'Value',
    items: [
      { id: 'valuation', label: 'Valuation Monitor', Icon: TrendingUp },
      { id: 'coming-soon', label: 'Coming Soon', Icon: Sparkles },
    ],
  },
];

const properties = [
  { id: 1, name: 'Satyam Skyline 3BHK', location: 'Bopal, Ahmedabad' },
  { id: 2, name: 'Green Valley Villa', location: 'Thaltej, Ahmedabad' },
];

export function DashboardSidebar({ activeSection, onSectionChange }) {
  const [selected, setSelected] = useState(properties[0]);
  const [open, setOpen] = useState(false);

  return (
    <aside className="fixed left-0 top-20 bottom-0 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 overflow-y-auto z-40">
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-slate-900" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-white truncate">{selected.name}</p>
              <p className="text-xs text-slate-400 truncate">{selected.location}</p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${
                open ? 'rotate-180' : ''
              }`}
            />
          </button>

          {open && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 rounded-xl border border-white/10 shadow-xl z-50 overflow-hidden">
              {properties.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelected(p);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-slate-700/50 transition-colors ${
                    selected.id === p.id ? 'bg-amber-500/10' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-white truncate">{p.name}</p>
                    <p className="text-xs text-slate-400 truncate">{p.location}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <nav className="p-4 space-y-6 pb-32">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {group.title}
              </h3>
              {group.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-gradient-to-r from-amber-400 to-amber-600 text-slate-900 rounded-full">
                  {group.badge}
                </span>
              )}
            </div>
            <div className="space-y-1">
              {group.items.map(({ id, label, Icon }) => {
                const isActive = activeSection === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onSectionChange(id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-400 border border-amber-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-slate-900/95">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-slate-900">RK</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Rajesh Kumar</p>
            <p className="text-xs text-slate-400 truncate">NRI Owner • Dubai</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
