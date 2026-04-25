import { useState } from 'react';
import {
  FileText,
  Shield,
  Receipt,
  FileCheck,
  Download,
  Eye,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  FolderOpen,
  Search,
} from 'lucide-react';

const documents = [
  { id: '1', name: 'Sale Deed', category: 'ownership', status: 'valid', uploadedDate: 'Jan 15, 2024', fileSize: '2.4 MB', verified: true },
  { id: '2', name: 'Property Tax Receipt 2023-24', category: 'tax', status: 'valid', expiryDate: 'Mar 31, 2025', daysUntilExpiry: 340, uploadedDate: 'Apr 1, 2024', fileSize: '856 KB', verified: true },
  { id: '3', name: 'Society NOC', category: 'society', status: 'expiring', expiryDate: 'May 15, 2024', daysUntilExpiry: 23, uploadedDate: 'May 15, 2023', fileSize: '1.2 MB', verified: true },
  { id: '4', name: 'Home Insurance Policy', category: 'insurance', status: 'expired', expiryDate: 'May 1, 2024', daysUntilExpiry: -6, uploadedDate: 'May 1, 2023', fileSize: '3.1 MB', verified: true },
  { id: '5', name: 'Encumbrance Certificate', category: 'legal', status: 'valid', expiryDate: 'Dec 31, 2024', daysUntilExpiry: 252, uploadedDate: 'Jan 5, 2024', fileSize: '1.8 MB', verified: true },
  { id: '6', name: 'RERA Registration', category: 'ownership', status: 'valid', uploadedDate: 'Dec 10, 2023', fileSize: '945 KB', verified: true },
  { id: '7', name: 'Fire Safety Certificate', category: 'legal', status: 'missing', uploadedDate: '-', fileSize: '-', verified: false },
];

const statusConfig = {
  valid: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', Icon: CheckCircle },
  expiring: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', Icon: Clock },
  expired: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', Icon: AlertTriangle },
  missing: { bg: 'bg-slate-700/50', text: 'text-slate-400', border: 'border-slate-600', Icon: FolderOpen },
};

const categoryConfig = {
  ownership: { label: 'Ownership', Icon: FileText },
  tax: { label: 'Tax', Icon: Receipt },
  society: { label: 'Society', Icon: Shield },
  insurance: { label: 'Insurance', Icon: Shield },
  legal: { label: 'Legal', Icon: FileCheck },
};

const aiAnalysis = {
  missing: ['Fire Safety Certificate'],
  recommendation:
    'Your Home Insurance has expired. Renew immediately to avoid coverage gaps. Society NOC expires in 23 days — initiate renewal process now.',
};

const CATEGORIES = ['all', 'ownership', 'tax', 'society', 'insurance', 'legal'];

export function DocumentVault() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = documents.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || d.category === category;
    return matchesSearch && matchesCategory;
  });

  const counts = {
    valid: documents.filter((d) => d.status === 'valid').length,
    expiring: documents.filter((d) => d.status === 'expiring').length,
    expired: documents.filter((d) => d.status === 'expired').length,
    missing: documents.filter((d) => d.status === 'missing').length,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Document Vault</h1>
          <p className="text-slate-400">Secure storage for all your property documents</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-semibold px-4 py-2.5"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      <div className="rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/30 p-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="text-lg font-semibold text-white">AI Document Analysis</h3>
              <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
                PropSight AI
              </span>
            </div>
            <p className="text-sm text-slate-300 mb-3">{aiAnalysis.recommendation}</p>
            <div className="flex flex-wrap gap-2">
              {aiAnalysis.missing.map((doc) => (
                <span
                  key={doc}
                  className="inline-flex rounded-full px-3 py-1 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30"
                >
                  Missing: {doc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Valid', count: counts.valid, status: 'valid' },
          { label: 'Expiring Soon', count: counts.expiring, status: 'expiring' },
          { label: 'Expired', count: counts.expired, status: 'expired' },
          { label: 'Missing', count: counts.missing, status: 'missing' },
        ].map((item) => {
          const c = statusConfig[item.status];
          const Icon = c.Icon;
          const cardBorder = item.count > 0 && item.status !== 'valid' ? c.border : 'border-slate-700/50';
          return (
            <div key={item.label} className={`rounded-xl bg-slate-800/50 border ${cardBorder} p-4 flex items-center gap-3`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${c.bg}`}>
                <Icon className={`w-5 h-5 ${c.text}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{item.count}</p>
                <p className="text-xs text-slate-400">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-100/10 outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-transparent'
              }`}
            >
              {cat === 'all' ? 'All' : categoryConfig[cat].label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((doc) => {
          const s = statusConfig[doc.status];
          const StatusIcon = s.Icon;
          const cat = categoryConfig[doc.category];
          const CategoryIcon = cat.Icon;
          const cardBorder =
            doc.status === 'expired'
              ? 'border-red-500/30'
              : doc.status === 'expiring'
              ? 'border-amber-500/30'
              : 'border-slate-700/50';
          return (
            <div
              key={doc.id}
              className={`rounded-xl bg-slate-800/50 border ${cardBorder} hover:border-slate-600 transition-all p-4`}
            >
              <div className="flex items-center gap-4 flex-wrap">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    doc.status === 'missing' ? 'bg-slate-700/50' : 'bg-slate-700'
                  }`}
                >
                  <CategoryIcon
                    className={`w-6 h-6 ${doc.status === 'missing' ? 'text-slate-500' : 'text-amber-400'}`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-white">{doc.name}</h3>
                    {doc.verified && (
                      <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400 flex-wrap">
                    <span>{cat.label}</span>
                    {doc.status !== 'missing' && (
                      <>
                        <span>·</span>
                        <span>{doc.fileSize}</span>
                        <span>·</span>
                        <span>Uploaded: {doc.uploadedDate}</span>
                      </>
                    )}
                  </div>
                </div>

                {doc.expiryDate && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {doc.status === 'expired'
                      ? `Expired ${Math.abs(doc.daysUntilExpiry || 0)} days ago`
                      : doc.status === 'expiring'
                      ? `Expires in ${doc.daysUntilExpiry} days`
                      : `Valid until ${doc.expiryDate}`}
                  </span>
                )}

                {doc.status === 'missing' && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    Missing
                  </span>
                )}

                <div className="flex items-center gap-2">
                  {doc.status !== 'missing' ? (
                    <>
                      <button
                        type="button"
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-900 px-3 py-1.5 text-sm font-medium"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
